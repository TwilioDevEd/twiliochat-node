// containerConfig.js
var container = require('kontainer-di'),
    todoService = require('./services/tokenService'),
    tokenController = require('./controllers/token'),
    homeController = require('./controllers/home');

container.register('tokenService', [], todoService);
container.register('tokenController', ['tokenService'], tokenController);
container.register('homeController', [], homeController);

module.exports = container;
