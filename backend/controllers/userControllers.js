const Users = require("../models/user");

const userController = {
  getAlluser: async (req, res) => {
    try {
      const user = await Users.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      res.status(200).json("Delete successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
