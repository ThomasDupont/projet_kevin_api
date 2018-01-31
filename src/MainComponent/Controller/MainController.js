const CONF              = require(ROOT+"/config/conf");

/**
 * Main controller class
 */
class MainController
{
    mainAction(req)
    {
        return {status : 'ok', message: 'api ok', statusCode : 200};
    }
}

module.exports = new MainController();

