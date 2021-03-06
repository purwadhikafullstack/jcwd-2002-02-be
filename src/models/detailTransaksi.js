const { DataTypes } = require("sequelize");

const TransaksiDetail = (sequelize) => {
  return sequelize.define("transaction_detail", {
    price_when_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

module.exports = TransaksiDetail;
