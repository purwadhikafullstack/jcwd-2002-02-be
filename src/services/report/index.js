const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { DaftarTransaksi, Stok } = require("../../lib/sequelize");
const Service = require("../service");

const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();
const endOfMonth = moment().endOf("month").format("YYYY-MM-DD hh:mm");
const nextThreeMonth = moment().add(3, "months");

class ReportService extends Service {
  static getTransactionCount = async (userId) => {
    try {
      const countNewOrder = await DaftarTransaksi.count({
        where: {
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
        },
        group: ["paymentStatusId"],
      });

      return this.handleSuccess({
        message: "Transaction found!",
        statusCode: 200,
        data: countNewOrder,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static getExpDateInfo = async () => {
    try {
      const expProduct = await Stok.findAll({
        where: {
          exp_date: {
            [Op.lt]: NOW,
          },
        },
        attributes: [
          [sequelize.fn("sum", sequelize.col("jumlah_stok")), "sum"],
        ],
        raw: true,
      });

      const expSoon = await Stok.findAll({
        where: {
          exp_date: {
            [Op.between]: [NOW, endOfMonth],
          },
        },
        attributes: [
          [sequelize.fn("sum", sequelize.col("jumlah_stok")), "sum"],
        ],
        raw: true,
      });

      const expIn3Months = await Stok.findAll({
        where: {
          exp_date: {
            [Op.between]: [endOfMonth, nextThreeMonth],
          },
        },
        attributes: [
          [sequelize.fn("sum", sequelize.col("jumlah_stok")), "sum"],
        ],
        raw: true,
      });

      const allData = {
        expStok: expProduct[0],
        expSoon: expSoon[0],
        expIn3Months: expIn3Months[0],
      };

      return this.handleSuccess({
        message: "Exp Product Found!",
        statusCode: 200,
        data: allData,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static getTodayOrder = async () => {
    try {
      const todayOrder = await DaftarTransaksi.count({
        where: {
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
          paymentStatusId: {
            [Op.ne]: 5,
          },
        },
      });

      const yesterdayOrder = await DaftarTransaksi.count({
        where: {
          createdAt: {
            [Op.gt]: moment(TODAY_START).subtract(1, "day"),
            [Op.lt]: TODAY_START,
          },
          paymentStatusId: {
            [Op.ne]: 5,
          },
        },
      });

      console.log(todayOrder, yesterdayOrder);

      const todayAndYesterdayOrder = {
        todayOrder,
        yesterdayOrder,
      };

      return this.handleSuccess({
        message: "Transaction found!",
        statusCode: 200,
        data: todayAndYesterdayOrder,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };
}

module.exports = ReportService;
