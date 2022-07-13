const moment = require("moment");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { DaftarTransaksi, Stok } = require("../../lib/sequelize");
const Service = require("../service");
const { sequelize } = require("../../lib/sequelize");

const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();
const endOfMonth = moment().endOf("month").format("YYYY-MM-DD hh:mm");
const nextThreeMonth = moment().add(3, "months");

class ReportService extends Service {
  static getTransactionCount = async (stateOfDate = "Harian") => {
    try {
      let countNewOrder;
      if (stateOfDate === "Harian") {
        countNewOrder = await DaftarTransaksi.count({
          where: {
            createdAt: {
              [Op.gt]: TODAY_START,
              [Op.lt]: NOW,
            },
          },
          group: ["paymentStatusId"],
        });
      } else if (stateOfDate === "Mingguan") {
        countNewOrder = await DaftarTransaksi.count({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(1, "week"),
              [Op.lt]: NOW,
            },
          },
          group: ["paymentStatusId"],
        });
      } else if (stateOfDate === "Bulanan") {
        countNewOrder = await DaftarTransaksi.count({
          where: {
            createdAt: {
              [Op.gt]: moment(TODAY_START).subtract(1, "month"),
              [Op.lt]: NOW,
            },
          },
          group: ["paymentStatusId"],
        });
      }

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
          [Sequelize.fn("sum", Sequelize.col("jumlah_stok")), "sum"],
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
          [Sequelize.fn("sum", Sequelize.col("jumlah_stok")), "sum"],
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
          [Sequelize.fn("sum", Sequelize.col("jumlah_stok")), "sum"],
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

  static getTodayStok = async () => {
    try {
      const todayStok = await Stok.findAll({
        where: {
          stockStatusId: 1,
        },
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("jumlah_stok")), "sum"],
        ],
        raw: true,
      });

      const yesterdayStok = await Stok.findAll({
        where: {
          stockStatusId: 1,
          updatedAt: {
            [Op.lt]: TODAY_START,
          },
        },
        attributes: [
          [Sequelize.fn("sum", Sequelize.col("jumlah_stok")), "sum"],
        ],
        raw: true,
      });

      const stokInfo = {
        todayStok: todayStok[0],
        yesterdayStok: yesterdayStok[0],
      };

      return this.handleSuccess({
        message: "Stok Found",
        statusCode: 200,
        data: stokInfo,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static getPenjualan = async (stateOfDate = "Bulanan") => {
    try {
      let results, metadata;

      if (stateOfDate === "Mingguan") {
        [results, metadata] = await sequelize.query(
          "SELECT WEEK(createdAt) as `week`, sum(`quantity`) AS `sum` FROM `transaction_details` AS `transaction_details` GROUP BY WEEK(createdAt) ORDER BY WEEK(createdAt) ASC"
        );
      } else if (stateOfDate === "Bulanan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `month`, sum(`quantity`) AS `sum` FROM `transaction_details` AS `transaction_details` WHERE YEAR (createdAt) = " +
            moment().format("YYYY") +
            " GROUP BY MONTH(createdAt) ORDER BY MONTH(createdAt) ASC"
        );
      } else if (stateOfDate === "Tahunan") {
        [results, metadata] = await sequelize.query(
          "SELECT createdAt as `year`, sum(`quantity`) AS `sum` FROM `transaction_details` AS `transaction_details` GROUP BY YEAR(createdAt) ORDER BY YEAR(createdAt) ASC"
        );
      }
      return this.handleSuccess({
        message: "Sales Found",
        statusCode: 200,
        data: results,
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