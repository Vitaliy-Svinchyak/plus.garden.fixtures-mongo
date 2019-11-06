let MongoFixtureLoader = function (Garden, config, logger) {
    const Fixtures = require('node-mongodb-fixtures')
    let paths = config.get('fixtures-mongo:fixtures')
    let dbUri = config.get('fixtures-mongo:uri')
    let wait = Garden.wait

    const fixtures = new Fixtures({
        dir: paths,
        filter: '.*',
    })

    this.load = function () {
        logger.info('Loading fixtures: ' + dbUri)

        try {
            wait.forMethod(fixtures, 'connect', dbUri)
            wait.forMethod(fixtures, 'load')
        } catch (e) {
            console.error(e)
        } finally {
            fixtures.disconnect()
        }

        logger.info('success')
    }

    this.drop = function () {
        logger.info('Dropping fixtures: ' + dbUri)
        try {
            wait.forMethod(fixtures, 'connect', dbUri)
            wait.forMethod(fixtures, 'unload')
        } catch (e) {
            console.error(e)
        } finally {
            fixtures.disconnect()
        }

        logger.info('success')
    }

}

module.exports = MongoFixtureLoader

module.exports.$inject = ['Garden', 'config', 'Logger']
module.exports.$tags = ['garden.js', 'fixtures', 'loader', 'loader.mongo']
