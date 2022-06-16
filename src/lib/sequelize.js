const { Sequelize, DataTypes } = require("sequelize");
const mySqlConfig = require("../config/database");

const sequelize = new Sequelize({
  username: mySqlConfig.MYSQL_USERNAME,
  password: mySqlConfig.MYSQL_PASSWORD,
  database: mySqlConfig.MYSQL_DB_NAME,
  port: 3306,
  dialect: "mysql",
});

// call all the models
const User = require("../models/user")(sequelize);
const UserLoginSession = require("../models/userLoginSession")(sequelize);
const AccountVerificationToken = require("../models/accountVerificationToken")(
  sequelize
);
const ForgotPasswordToken = require("../models/forgotPasswordToken")(sequelize);
const Admin = require("../models/admin")(sequelize);
const AdminLoginSession = require("../models/adminLoginSession")(sequelize);
const Alamat = require("../models/alamat")(sequelize);
const Produk = require("../models/produk")(sequelize);
const Stok = require("../models/stok")(sequelize);
const StokStatus = require("../models/stokStatus")(sequelize);
const PurchaseOrder = require("../models/purchaseOrder")(sequelize);
const KategoriProduk = require("../models/kategoriProduk")(sequelize);
const Cart = require("../models/cart")(sequelize);
const DaftarTransaksi = require("../models/daftarTransaksi")(sequelize);
const DetailTransaksi = require("../models/detailTransaksi")(sequelize);
const MetodePembayaran = require("../models/metodePembayaran")(sequelize);
const BuktiPembayaran = require("../models/buktiPembayaran")(sequelize);
const StatusPembayaran = require("../models/statusPembayaran")(sequelize);
const MutasiStok = require("../models/mutasiStok")(sequelize);
const TipeMutasi = require("../models/tipeMutasi")(sequelize);

// defind the relationship of the model

module.exports = {
  sequelize,
};
