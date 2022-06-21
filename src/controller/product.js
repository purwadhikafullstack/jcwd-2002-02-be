const ProductService = require("../services/product")

const productControllers = {
getProduct: async (req, res)=> {
    try {
        const serviceResult = await ProductService.getProduct(req)

        if(!serviceResult.success) throw serviceResult

        return res.status(serviceResult.statusCode || 200).json({
            message: serviceResult.message,
            result: serviceResult.data
        })
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            message: err.message
        })
    }
}
}

module.exports = productControllers