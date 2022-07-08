const addressControllers = require("../controller/address");
const { authorizedLoginUser } = require("../middleware/authorizeLoginUser");

const router = require("express").Router();

router.get("/province", addressControllers.getAllProvince);

router.get("/city", addressControllers.getAllCity);

router.post(
  "/add-new-address",
  authorizedLoginUser,
  addressControllers.addNewAddress
);

module.exports = router;
