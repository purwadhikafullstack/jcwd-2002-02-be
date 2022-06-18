const { DataTypes } = require("sequelize");

const MutasiStok = (sequelize) => {
  return sequelize.define("stock_mutation", {
    aktifitas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = MutasiStok;
