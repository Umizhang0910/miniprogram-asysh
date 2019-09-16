// pages/welcome/welcome.js
const app = getApp();
const util = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    timerName: '',
    dateTime: util.formatDateTime(new Date()),
    dayTime: ''
  },

  /**
   * 页面加载时间
   */
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var dt = this.data.dateTime.substring(0, this.data.dateTime.indexOf(' '));
    if (parseInt(this.data.dateTime.substring(this.data.dateTime.indexOf(' '), this.data.dateTime.indexOf(' ') + 1)) <= 12) {
      this.setData({
        dateTime: dt,
        dayTime: '上午好'
      })
    }else {
      this.setData({
        dateTime: dt,
        dayTime: '下午好'
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow: function() {
    // 定时进入首页
    var timerName = setTimeout(function() {
      wx.reLaunch({
        url: '../index/index'
      })
    }, 3000);
    this.setData({
      timerName: timerName
    })
  },

  onHide: function() {
    clearTimeout(this.timerName);
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'a 尙源生活',
      desc: '分享个小程序，希望你喜欢😁~',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  },

  /**
   * 当前是 tab 页时，点击 tab 时触发
   */
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  }
})