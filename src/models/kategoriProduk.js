const { DataTypes } = require("sequelize/types");

const KategoriProduk = (sequelize) => {
  return sequelize.define("Kategori_produk", {
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = KategoriProduk;
