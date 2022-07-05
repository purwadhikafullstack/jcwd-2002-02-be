const CartService = require("../services/cart");

const cartController = {
  addToCarts: async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const serviceResult = await CartService.addToCart(
        productId,
        userId,
        quantity
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode).json({
        message: serviceResult.message,
        data: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
  getCartData: async (req, res) => {
    try {
      const userId = req.user.id;

      const serviceResult = await CartService.getAllCart(userId);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode).json({
        message: serviceResult.message,
        data: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

module.exports = cartController;
