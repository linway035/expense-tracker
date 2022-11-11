// 封裝 home 模組，這支模組專門管理首頁

// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用資料庫model
const Record = require('../../models/record')

// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  // const categoryOptions = new Set();
  // const recordsById = Record.find({ userId }).lean().sort({ _id: "desc" });
  // recordsById.forEach((record) => {
  //   const categoryId = record.categoryId;
  //   categoryOptions.add(categoryId);
  // });
  Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let totalAmount = 0
      records.forEach((element) => {
        totalAmount += Number(element.amount)
      })
      res.render('index', { records, totalAmount })
    })
    .catch((err) => console.log(err))
})

// 定義類別路由
router.get('/category', (req, res) => {
  const userId = req.user._id
  const categoryId = Number(req.query.categoryId)
  // catValue是為了hbs用而無關篩選。除了可以選0外，因為是submit onchange，不改的話會一直選0(類別)
  const catValue = {
    all: categoryId === 0, // 是Number不是字串
    housing: categoryId === 1,
    traffic: categoryId === 2,
    entertainment: categoryId === 3,
    diet: categoryId === 4,
    others: categoryId === 5
  }
  // model沒有設0為all，所以用if else
  if (categoryId > 0 && categoryId < 6 && categoryId % 1 === 0) {
    // 或categoryId.isInteger
    return Record.find({ categoryId, userId })
      .lean()
      .sort({ date: 'desc' })
      .then((records) => {
        let totalAmount = 0
        records.forEach((element) => {
          totalAmount += Number(element.amount)
        })
        res.render('index', { records, totalAmount, catValue })
      })
      .catch((err) => console.log(err))
  } else {
    return Record.find({ userId })
      .lean()
      .sort({ date: 'desc' })
      .then((records) => {
        let totalAmount = 0
        records.forEach((element) => {
          totalAmount += Number(element.amount)
        })
        res.render('index', { records, totalAmount, catValue })
      })
      .catch((err) => console.log(err))
  }
})
// 匯出路由模組
module.exports = router
