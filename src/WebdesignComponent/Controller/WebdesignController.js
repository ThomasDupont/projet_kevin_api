const CONF = require("./../../../config/conf");
const WebDesign = require('./../../DocumentComponent/Model/WebDesign');

/**
 * Main controller class
 */
class WebdesignController
{
    mainAction(req)
    {
        return {status : 'ok', message: 'api ok', statusCode : 200};
    }

    /**
     *
     * @param request
     * @returns {Promise.<*>}
     */
    async getListAction(request)
    {
        let countResult = 2;
        return await WebDesign.find({
            createdAt : {
                $lte : new Date()
            }
        }).limit(countResult).skip(request.page * countResult).lean().exec();
    }

    /**
     *
     * @param request
     * @returns {Promise.<*>}
     */
    async getSingleWebdesignAction(request)
    {
        return await WebDesign.findOne({_id : request.id}).lean().exec();
    }
}

module.exports = new WebdesignController();

