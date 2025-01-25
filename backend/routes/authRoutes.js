const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");


const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);


module.exports = router;
