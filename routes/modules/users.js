// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();

const User = require("../../models/user");
// 引用 passport套件
const passport = require("passport");
// 引用 bcrypt套件
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("login");
});

// 加入 middleware，驗證 request 登入狀態
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = []; //可能會同時產生多則訊息，所以建立個陣列存放
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位皆為必填。" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符！" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({ message: "這個 Email 已經註冊過了" });
        return res.render("register", {
          errors,
          name,
          email,
          password,
          confirmPassword,
        });
      }
      return bcrypt
        .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
        .then((salt) => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
        .then((hash) => User.create({ name, email, password: hash }))
        .then(() => res.redirect("/")) //回到http://localhost:3000/，而不是/users。跟post那行不同
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout(); //是 Passport.js 提供的函式，會幫你清除 session
  req.flash("success_msg", "你已經成功登出。");
  res.redirect("/users/login");
});

module.exports = router;
