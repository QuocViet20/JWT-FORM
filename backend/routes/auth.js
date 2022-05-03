const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareControllers");

const router = require("express").Router();
//register
router.post("/register", authController.registerUser);

// //login
router.post("/login", authController.loginUser);
//refresh
router.post("/refresh", authController.requestRefreshToken);
// logout
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.userLogout
);

module.exports = router;
