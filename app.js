const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

// dotenv把東西放入process.env
// console.log("before", process.env);
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// console.log("after", process.env);

const routes = require('./routes') // 預設會去找index.js，故省略(routes/index.js)
const usePassport = require('./config/passport') // 檔名，而非module名(有這東西嗎?)
require('./config/mongoose') // 對 app.js 而言，Mongoose 連線設定只需要「被執行」，不需要接到任何回傳參數繼續利用，所以這裡不需要再設定變數。

// 要注意 程式是由上而下讀取，所以port用了環境變數 必須放在dotenv那段的下面才讀得到
const app = express()
const port = process.env.PORT

// setting static files靜態檔案
app.use(express.static('public'))

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
      iconImage: function (number) {
        const category_image = {
          家居物業: '<i class="fa-solid fa-house"></i>',
          交通出行: '<i class="fa-solid fa-van-shuttle"></i>',
          休閒娛樂: '<i class="fa-solid fa-face-grin-beam"></i>',
          餐飲食品: '<i class="fa-solid fa-utensils"></i>',
          其他: '<i class="fa-solid fa-pen"></i>'
        }
        const category_number = {
          0: '類別',
          1: '家居物業',
          2: '交通出行',
          3: '休閒娛樂',
          4: '餐飲食品',
          5: '其他'
        }
        const item = category_number[number]
        return category_image[item]
      },
      dateFormat: function (dateFromDB) {
        return new Date(dateFromDB).toLocaleDateString()
      }
    }
  })
) // 建立名為hbs的樣板引擎
app.set('view engine', 'hbs') // 啟用樣板引擎

// 設定 express-session，需要放在較前面
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 這個參數是 session 用來驗證 session id 的字串。這組字串由伺服器設定，不會洩露給用戶端。
    resave: false, // 當設定為 true 時，會在每一次與使用者互動後，強制把 session 更新到 session store 裡。
    saveUninitialized: true // 強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的而且沒有被修改過，例如未登入的使用者的 session。
  })
)

// setting body-parser
app.use(express.urlencoded({ extended: true }))

// 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 掛載套件
app.use(flash())

// 使用 app.use 代表這組 middleware 會作用於所有的路由
app.use((req, res, next) => {
  // console.log(req.user); //在反序列化的時候，取出的 user 資訊
  // {
  // _id: 6360d8d82f2cdb12c0beb392,
  // name: 'lin',
  // email: 'wa@gmail.com',
  // password: 'WmRL.4BXUjbAN',
  // createdAt: 2022-11-01T08:29:12.292Z,
  // __v: 0
  // }
  res.locals.isAuthenticated = req.isAuthenticated() // 把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.user = req.user // 把使用者資料交接給 res 使用
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next() // res.locals：所有樣板都可以使用的變數，放在 res.locals 裡的資料，所有的 view 都可以存取。
})

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`running on https://localhost:${port}`)
})
