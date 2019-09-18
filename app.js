//app.js
App({
  // 生命周期回调——监听小程序初始化。
  onLaunch: function () {
    // Do something initial when launch.

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
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
  // 生命周期回调——监听小程序启动或切前台。
  onShow() {
    // Do something when show.
  },
  // 生命周期回调——监听小程序切后台。
  onHide() {
    // Do something when hide.
  },
  // 错误监听函数。
  onError(msg) {
    console.log(msg)
  },
  // 页面不存在监听函数。
  onPageNotFound(res) {
    console.log("页面"+page+"不存在！")
    wx.redirectTo({
      url: 'pages/welcome/welcome'
    }) // 如果是 tabbar 页面，请使用 wx.switchTab
  },
  globalData: {
    defaultCity: '',
    defaultCounty: '',
    weatherData: '',
    air: '',
    day: '',
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    curBook: "",
    // doubanBase: "https://douban.uieee.com",
    tencentMapBase: "https://apis.map.qq.com",
    tencentMapKey: "4HYBZ-EB23D-SLC42-HQ5R3-LP3LQ-OZFU5",
    heWeatherBase: "https://free-api.heweather.com",
    heWeatherKey: "4a817b4338e04cc59bdb92da7771411e",
    // juhetoutiaoBase: "https://v.juhe.cn/toutiao/index",
    // juhetoutiaoKey: "a9f703a0200d68926f707f3f13629078",
    // // juhexingzuoBase: "http://web.juhe.cn:8080",
    // // juhexingzuoKey: "6ac9204cc6613922a445bae75769d5db",
    jisuBase: "https://api.jisuapi.com",
    jisuappkey: "4dcd91e05013ea27",
    jisuappsecret: "SZiv8qrwXyslbFbci7zdWU6EI4A4FNdK"
  }
})