let MongoFixtureLoader = function (Garden, config, logger) {

    let wait = Garden.wait
    let dbUri = config.get('fixtures-mongo:uri')
    let fixtures = require('pow-mongodb-fixtures').connect(dbUri)
    let paths = config.get('fixtures-mongo:fixtures')
    let fs = require('fs')

    function isAbsolute (path) {
        return /^\//.test(path)
    }

    function getListOfFilesInPaths () {
        let resultPaths

        if (paths instanceof Object) {
            resultPaths = []
            for (let key in paths) {
                let path = paths[key]

                if (!isAbsolute(path)) {
                    resultPaths.push(config.get('root_dir') + '/' + path)
                }
            }
        } else {
            if (!isAbsolute(paths)) {
                resultPaths = config.get('root_dir') + '/' + paths
            }
        }

        return resultPaths
    }

    function loadPath (path) {
        logger.info('fixtures: ' + path)
        wait.forMethod(fixtures, 'load', path)
        logger.info('success')
    }

    this.load = function () {
        logger.info('Loading fixtures: ' + dbUri)
        let formattedPaths = getListOfFilesInPaths()

        if (formattedPaths instanceof Object) {
            for (let path of paths) {
                loadPath(path)
            }
        } else {
            loadPath(formattedPaths)
        }
    }

    this.drop = function () {
        let formattedPaths = getListOfFilesInPaths()
        let collectionNames = []

        if (formattedPaths instanceof Object) {
            for (let path of formattedPaths) {
                collectionNames = [...collectionNames, ...fs.readdirSync(paths)]
            }
        } else {
            collectionNames = fs.readdirSync(paths)
        }

        collectionNames = collectionNames.map(name => name.substr(0, name.length - 3))

        logger.info('Dropping fixtures: ' + dbUri)
        wait.forMethod(fixtures, 'clear', collectionNames)
        logger.info('success')
    }

}

module.exports = MongoFixtureLoader

module.exports.$inject = ['Garden', 'config', 'Logger']
module.exports.$tags = ['garden.js', 'fixtures', 'loader', 'loader.mongo']
