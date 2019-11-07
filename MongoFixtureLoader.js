let MongoFixtureLoader = function (Garden, config, logger) {
    const Fixtures = require('node-mongodb-fixtures')
    let paths = config.get('fixtures-mongo:fixtures')
    let dbUri = config.get('fixtures-mongo:uri')

    const fixtures = new Fixtures({
        dir: paths,
        filter: '.*',
    })

    this.load = async function () {
        logger.info('Loading fixtures: ' + dbUri)

        try {
            await fixtures.connect(dbUri)
            await fixtures.load()
        } catch (e) {
            console.error(e)
        } finally {
            fixtures.disconnect()
        }

        logger.info('success')
    }

    this.drop = async function () {
        logger.info('Dropping fixtures: ' + dbUri)
        try {
            await fixtures.connect(dbUri)
            await fixtures.unload()
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
