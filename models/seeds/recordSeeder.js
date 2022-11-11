// npm run seed
const bcrypt = require('bcryptjs')
// 因為種子資料檔是一個獨立執行的檔案，它沒經過app.js，所以這裡要寫一次，不然db(mongoose)中的process.env.MONGODB_URI讀不到
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Record = require('../record')
const User = require('../user')

// 注意，這句要放在dotenv後面，才會有採用到環境變數
const db = require('../../config/mongoose')

const SEED_USERS = [
  {
    name: '廣志',
    email: 'hiroshi@test.com',
    password: 'nh35',
    recordIndex: [0, 1, 2, 4]
  },
  {
    name: '小新',
    email: 'shin@test.com',
    password: 'ns05',
    recordIndex: [3]
  }
]

const SEED_RECORDS = [
  {
    name: '午餐',
    date: '2019-04-23',
    amount: '60',
    categoryId: '4'
  },
  {
    name: '晚餐',
    date: '2019-04-23',
    amount: '60',
    categoryId: '4'
  },
  {
    name: '捷運',
    date: '2019-04-23',
    amount: '120',
    categoryId: '2'
  },
  {
    name: '電影:驚奇隊長',
    date: '2019-04-23',
    amount: '220',
    categoryId: '3'
  },
  {
    name: '租金',
    date: '2019-04-23',
    amount: '25000',
    categoryId: '1'
  }
]

// 因為db.once內容有不同，要取得連線的回傳結果，並把結果放進 db 繼續使用
// 只需要寫db沒有的內容
db.once('open', () => {
  Promise.all(
    SEED_USERS.map((user) => {
      const { name, email, password, recordIndex } = user
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // 注意兩個都是sync
      }).then((user) => {
        const records = recordIndex.map((index) => {
          const record = SEED_RECORDS[index]
          record.userId = user._id
          return record
        })
        return Record.create(records)
      })
    })
  )
    .then(() => {
      console.log('recordSeeder Done!')
      process.exit()
    })
    .catch((err) => console.log(err))
})
