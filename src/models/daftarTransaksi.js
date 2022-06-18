const { DataTypes } = require("sequelize");

const DaftarTransaksi = (sequelize) => {
  return sequelize.define("transaction_list", {
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_resep: {
      type: DataTypes.BOOLEAN,
    },
    resep_imag_url: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = DaftarTransaksi;
