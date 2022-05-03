const jwt = require("jsonwebtoken");

const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      jwt.verify(token, "secret", (err, user) => {
        if (err) {
          return res.status(403).json("token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("you're not authenticated");
    }
  },
  verifyTokenAndAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        return res.status(403).json("you're not allowed to delete other");
      }
    });
  },
};

module.exports = middlewareController;
