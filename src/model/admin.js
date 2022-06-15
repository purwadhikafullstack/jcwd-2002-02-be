const { DataTypes } = require("sequelize/types");

const Admin = (sequelize) => {
  return sequelize.define("Admin", {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = Admin;