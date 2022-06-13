const { Sequelize } = require("sequelize");
const mySqlConfig = require("../config/database");

const sequelize = new Sequelize({
  username: mySqlConfig.MYSQL_USERNAME,
  password: mySqlConfig.MYSQL_PASSWORD,
  database: mySqlConfig.MYSQL_DB_NAME,
  port: 3306,
  dialect: "mysql",
});
