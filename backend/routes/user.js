const middlewareController = require("../controllers/middlewareControllers");
const userController = require("../controllers/userControllers");

const router = require("express").Router();
//getAll user
router.get("/", middlewareController.verifyToken, userController.getAlluser);

// delete user
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdmin,
  userController.deleteUser
);

module.exports = router;
