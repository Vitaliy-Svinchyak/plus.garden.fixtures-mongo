var MongoFixtureLoader = function (Garden, config, logger) {

    var wait = Garden.wait;
    var dbUri = config.get('fixtures-mongo:uri');
    var fixtures = require('pow-mongodb-fixtures').connect(dbUri);
    var paths = config.get('fixtures-mongo:fixtures');

    function isAbsolute(path) {
        return /^\//.test(path);
    }

    function loadPath(path) {

        if (!isAbsolute(path)) {
            path = config.get('root_dir') + '/' + path;
        }

        logger.info('fixtures: ' + path);
        wait.forMethod(fixtures, 'load', path);
        logger.info('success');
    }

    this.load = function () {

        logger.info('Loading fixtures: ' + dbUri);

        if (paths instanceof Object) {
            for (var key in paths) {
                var path = paths[key];
                loadPath(path);
            }
        } else {
            loadPath(paths);
        }
    };

    this.drop = function () {
        logger.info('Dropping fixtures: ' + dbUri);
        wait.forMethod(fixtures, 'clear');
        logger.info('success');
    };

};

module.exports = MongoFixtureLoader;

module.exports.$inject = ['Garden', 'config', 'Logger'];
module.exports.$tags = ['garden.js', 'fixtures', 'loader'];