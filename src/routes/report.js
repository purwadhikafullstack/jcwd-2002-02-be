const ReportController = require("../controller/report");

const router = require("express").Router();

router.get("/get-transaction-count", ReportController.getTransactionCount);
router.get("/get-exp-product", ReportController.getExpProduct);
router.get("/get-today-transaction", ReportController.getTodayTransaction);
router.get("/get-today-stok", ReportController.getTodayStok);

module.exports = router;
