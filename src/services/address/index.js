const rajaOngkirInstance = require("../../lib/axiosInstance");
const { Alamat } = require("../../lib/sequelize");
const Service = require("../service");

class AddressService extends Service {
  static getAllProvince = async () => {
    try {
      const province = await rajaOngkirInstance.get("/province");

      return this.handleSuccess({
        message: "Provinces Found",
        statusCode: 200,
        data: province.data.rajaongkir.results,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static getAllCity = async (query) => {
    try {
      const { provinceTerpilih } = query;

      const city = await rajaOngkirInstance.get(
        `/city?province=${provinceTerpilih}`
      );

      return this.handleSuccess({
        message: "Cities Found",
        statusCode: 200,
        data: city.data.rajaongkir.results,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static addNewAddress = async (
    label_alamat,
    nama_penerima,
    no_telepon_penerima,
    alamat_lengkap,
    kode_pos,
    provinsi_id,
    kota_kabupaten_id,
    kecamatan,
    userId
  ) => {
    try {
      const isAddressMain = await Alamat.findOne({
        where: {
          is_main_address: true,
        },
      });
      if (!isAddressMain) {
        const newAddress = await Alamat.create({
          label_alamat,
          nama_penerima,
          no_telepon_penerima,
          alamat_lengkap,
          kode_pos,
          provinsi_id,
          kota_kabupaten_id,
          kecamatan,
          userId,
          is_main_address: true,
        });

        return this.handleSuccess({
          statusCode: 200,
          message: "Address Added Successfully",
          data: newAddress,
        });
      }
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };
}

module.exports = AddressService;
