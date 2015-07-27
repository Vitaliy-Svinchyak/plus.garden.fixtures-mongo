module.exports = function (Garden) {

    Garden.load({dir: __dirname});

};

module.exports.$inject = ['Garden'];
module.exports.$tags = ['garden.js', 'module'];