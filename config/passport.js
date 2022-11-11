const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy // passport-local的Strategy物件
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        // 把驗證項目從預設的 username 改成 email。
        // 欄位名稱email是字串所以要加引號
        // done( 錯誤訊息/是否有錯(null or err), 使用者資訊(truthy or false), 訊息 )
        // A verify function yields under one of three conditions: success, failure, or an error.
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash('warning_msg', 'That email is not registered!')
              ) // If the credential does not belong to a known user, or is not valid, the verify function calls the callback with false to indicate an authentication failure。 找不到使用者輸入的 username，用戶物件為 false
            }
            // 第一個參數是使用者的輸入值，而第二個參數是資料庫裡的雜湊值，bcrypt 會幫我們做比對，並回傳布林值 (我設為isMatch)
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                // 原本是 user.password !== password
                return done(
                  null,
                  false,
                  req.flash('warning_msg', 'Email or Password incorrect.')
                ) // 找到使用者，但發現密碼錯誤，用戶物件為 false
              }
              return done(null, user) // success
            })
          })
          // If an error occurs, such as the database not being available, the callback is called with an error
          .catch((err) => done(err, false)) // 其實 done(err) 就夠了
      }
    )
  )

  // 設定facebook策略
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user)
          const randomPassword = Math.random().toString(36).slice(-8)
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) =>
              User.create({
                name,
                email,
                password: bcrypt.hash
              })
            )
            .then((user) => done(null, user))
            .catch((err) => done(err, false))
        })
      }
    )
  )
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    // console.log(user);
    // {
    //   _id: 6360d8d82f2cdb12c0beb392,
    //   name: 'lin',
    //   email: 'wa@gmail.com',
    //   password: 'WmRL.4BXUjbAN',
    //   createdAt: 2022-11-01T08:29:12.292Z,
    //   __v: 0
    // }
    done(null, user.id) // mongoose幫忙做出的_id，這裡用別名(不用底線)id也可
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean() // 把資料庫物件轉換成 JavaScript 原生物件
      .then((user) => done(null, user))
      .catch((err) => done(err, null)) // 其實Passport看到第一個參數有 err 就不會處理後面的參數了，放一個 null 只是語意表達用
  })
}
