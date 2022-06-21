const AuthService = require("../services/auth");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
      const { name, username, email, password } = req.body;

      const hashedPassword = bcrypt.hashSync(password, 5);

      const serviceResult = await AuthService.registerUser(
        username,
        email,
        name,
        hashedPassword
      );

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const serviceResult = await AuthService.loginAdmin(username, password);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  keepLoginAdmin: async (req, res) => {
    try {
      const { token } = req;
      const serviceResult = await AuthService.keepLoginAdmin(token);

      if (!serviceResult.success) throw serviceResult;

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  registerAdmin: async (req, res) => {
    try {
      const { name, username, email, password } = req.body;

      const hashedPassword = bcrypt.hashSync(password, 5);

      const serviceResult = await AuthService.registerAdmin(
        username,
        email,
        name,
        hashedPassword
      );

      if (!serviceResult.success) throw serviceResult;
      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data,
      });
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const {credential, password} = req.body
      const serviceResult = await AuthService.loginUser(credential, password)

      if(!serviceResult.success) throw serviceResult

      return res.status(serviceResult.statusCode || 200).json({
        message: serviceResult.message,
        result: serviceResult.data
      })
    } catch (err) {
      console.log(err);
      return res.status(err.statusCode || 500).json({
        message: err.message
      })
    }
  }
};

module.exports = authController;
