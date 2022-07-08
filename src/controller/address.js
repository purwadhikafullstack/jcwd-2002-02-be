const AddressService = require("../services/address");

const addressControllers = {
  getAllProvince: async (req, res) => {
    try {
      const serviceResult = await AddressService.getAllProvince();
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

  getAllCity: async (req, res) => {
    const serviceResult = await AddressService.getAllCity(req.query);
    if (!serviceResult.success) throw serviceResult;
    return res.status(serviceResult.statusCode || 200).json({
      message: serviceResult.message,
      result: serviceResult.data,
    });
  },

  addNewAddress: async (req, res) => {
    try {
      // const user_id = req.user.id;
      const {
        label_alamat,
        nama_penerima,
        no_telepon_penerima,
        alamat_lengkap,
        kode_pos,
        provinsi_id,
        kota_kabupaten_id,
        kecamatan,
        is_main_address,
      } = req.body;

      const serviceResult = await AddressService.addNewAddress(
        label_alamat,
        nama_penerima,
        no_telepon_penerima,
        alamat_lengkap,
        kode_pos,
        provinsi_id,
        kota_kabupaten_id,
        kecamatan,
        user_id,
        is_main_address
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
};

module.exports = addressControllers;
