plus.garden.fixtures-mongo
=======================

mongo fixtures loader for plus.garden

this module uses https://github.com/powmedia/pow-mongodb-fixtures


Install
===========================

Install npm package
```
npm i plus.garden.fixtures-mongo --save
```

Add service to garden container
```
container.register('MongoFixtureLoaderModule', require('plus.garden.fixtures-mongo'));
```

Add config section to garden config

```javascript
"fixtures-mongo": {

    "uri": "mongodb://user:password@localhost:27017/dbname",

    "fixtures": "fixtures/mongo"  /fixtures folder
}
```

Usage
=========================================

Creating fixtures files:

FOR EXAMPLE:
With the file below, 3 documents will be inserted into the 'users' collection and 2 into the 'businesses' collection:
```javascript
    //fixtures.js
    exports.users = [
        { name: 'Gob' },
        { name: 'Buster' },
        { name: 'Steve Holt' }
    ];

    exports.businesses = [
        { name: 'The Banana Stand' },
        { name: 'Bluth Homes' }
    ];
```

You can also load fixtures as an object where each document is keyed, in case you want to reference another document. This example uses the included `createObjectId` helper:

```javascript
    //users.js
    var id = require('pow-mongodb-fixtures').createObjectId;

    var users = exports.users = {
        user1: {
            _id: id(),
            name: 'Michael'
        },
        user2: {
            _id: id(),
            name: 'George Michael',
            father: users.user1._id
        },
        user3: {
            _id: id('4ed2b809d7446b9a0e000014'),
            name: 'Tobias'
        }
    }
```

commands:
```
./garden.js fixtures.load
./garden.js fixtures.drop
```

`fixture.load` runs `fixtures.drop` automatically