const { DataTypes } = require("sequelize");

const MetodePembayaran = (sequelize) => {
  return sequelize.define("Metode_pembayaran", {
    nama_metode: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = MetodePembayaran;
