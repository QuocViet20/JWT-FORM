const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new Users({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // generate accesstoken
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      "secret",
      { expiresIn: "30s" }
    );
  },
  // generate refreshToken
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      "secretRefresh",
      { expiresIn: "365d" }
    );
  },
  //login
  loginUser: async (req, res) => {
    try {
      const user = await Users.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("wrong username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("wrong password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("you're not authenticated");
    if (!refreshTokens.includes(refreshToken))
      res.status(401).json("refreshToken is not valid");
    jwt.verify(refreshToken, "secretRefresh", (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },
  //log out
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json("logged out");
  },
};

module.exports = authController;
