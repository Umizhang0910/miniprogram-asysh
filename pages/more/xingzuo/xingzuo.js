// pages/more/xingzuo/xingzuo.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    g_windowsHeight: 0,
    g_windowWidth: 0
  },

  /** 进入详情 */
  onStarSignTap: function(e) {
    var starSign = e.currentTarget.dataset.starsignid;
    wx.navigateTo({
      url: 'starsign-detail/starsign-detail?id=' + starSign
    })
  },

  /** 查看图片 */
  viewStarSignImg: function(e) {
    console.log(e);
    var src = e.currentTarget.dataset.src;
    console.log(src);
    if (src.indexOf("http") == -1) {
      wx.showToast({
        title: '抱歉，暂时无法查看大图！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src], // 需要预览的图片http链接列表
        fail: function(err) {
          console.log(err);
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取星座数据
    wx.request({
      url: app.globalData.jisuBase + "/astro/all?appkey=" + app.globalData.jisuappkey,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        that.setData({
          starSigns: res.data.result
        })
        
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '星座运势~',
      desc: '分享个小程序，希望你喜欢😁~',
      success: function(res) {
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})