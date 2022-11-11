// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const moment = require("moment");
// 引用 Todo model
const Record = require("../../models/record");

//展現Create頁面
router.get("/new", (req, res) => {
  return res.render("new");
});

//Create後表單回傳至首頁
router.post("/", (req, res) => {
  const userId = req.user._id; //存使用者ID，下下句用
  const body = req.body;
  // 用賦值的方式把userId一併存入
  body.userId = userId;
  console.log("create", body);
  return Record.create(body)
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log("create error")); //在html皆設為required，省得寫錯誤訊息
});

//展項各id的edit頁面
router.get("/:identity/edit", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  return (
    Record.findOne({ _id: id, userId })
      .lean()
      .then((record) => {
        console.log("edit", record);
        const catValue = {
          all: record.categoryId === 0, //是Number不是字串
          housing: record.categoryId === 1,
          traffic: record.categoryId === 2,
          entertainment: record.categoryId === 3,
          diet: record.categoryId === 4,
          others: record.categoryId === 5,
        };
        record.dateFormat = moment(record.date).format("YYYY-MM-DD");
        res.render("edit", { record, catValue });
      })
      // .then((todo) => console.log(todo)) //若想知道為什模要在edit.hbs寫todo.name可以用此查看(前一句需註解調)
      .catch((error) => console.log("error"))
  );
});

//edit後表單回傳至各id明細頁面
router.put("/:identity", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  return Record.findOneAndUpdate({ _id: id, userId }, req.body)
    .lean()
    .then(() => res.redirect("/"))
    .catch((error) => console.log("edit error")); //中途任一時點失敗就回傳error
});

//delete後回首頁
router.delete("/:identity", (req, res) => {
  const userId = req.user._id;
  const id = req.params.identity;
  return Record.findOne({ _id: id, userId })
    .then((record) => record.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log("delete error"));
});

module.exports = router;
