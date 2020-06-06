//app.js
import req from './request/index.js'

App({
  onLaunch: function () {
    this.checkSession()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  doPageCallback: function () {
    if (this.pageCallback) {
      this.pageCallback()
    }
  },
  checkSession: function () {
    let self = this
    const loginToken = wx.getStorageSync('login_token')
    console.log("loginToken", loginToken)

    if (loginToken) {
      wx.checkSession({
        success() {
          console.log('CheckSession Success')
          self.doPageCallback()
          self.globalData.ready = true
        },
        fail() {
          self.doLogin()
        }
      })
    } else {
      self.doLogin()
    }
  },
  doLogin: function (callback = () => {}) {
    let self = this

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log("doLogin:function -> res.code", res.code)
          // 发起网络请求
          wx.request({
            url: req.urls.loginUrl,
            data: {
              code: res.code
            },
            success(res) {
              const token = res.data.token
              wx.setStorageSync('login_token', token)
              self.globalData.ready = true
              self.doPageCallback()
              if (callback) callback()
            },
            fail(res) {
              console.log(res)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    ready: false
  }
})
