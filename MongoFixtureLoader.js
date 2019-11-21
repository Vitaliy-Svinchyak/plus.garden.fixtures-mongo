let MongoFixtureLoader = function (Garden, config, logger) {
    const Fixtures = require('node-mongodb-fixtures')

    Fixtures.prototype.clear = function () {
        const assert = require('assert')
        const fs = require('fs')
        const path = require('path')

        const readdir = Promise.promisify(fs.readdir)

        assert(this._db, 'must call connect')

        return readdir(this._dir).then(files => {
            const promises = files.filter(this._filterFiles).map(file => {
                const parse = path.parse(file)
                const collectionName = parse.name
                const ext = parse.ext

                if (!isSupportedExt(ext) || isScript(collectionName, ext)) {
                    return null
                }

                const dropCollection = this._db.collection(collectionName).
                    remove({}).
                    catch(e => {
                        if (e.code !== 26) throw e
                    })
                return dropCollection
            })
            return Promise.all(promises).tap(() => log(this._mute, '[done ] *unload all')).then(() => this)
        })
    }

    let paths = config.get('fixtures-mongo:fixtures')
    let dbUri = config.get('fixtures-mongo:uri')

    const fixtures = new Fixtures({
        dir: paths,
        filter: '.*',
        mute: true,
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
            await fixtures.clear()
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
