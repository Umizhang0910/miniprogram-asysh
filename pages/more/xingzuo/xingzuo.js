// pages/more/xingzuo/xingzuo.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    g_windowsHeight: 0,
    g_windowWidth: 0,
    starSigns: [{
        starSignId: 'Aries',
        starSignName: '白羊座',
        xzMonth: '(3.21-4.19)',
        xzImgName: 'Aries'
      },
      {
        starSignId: 'Taurus',
        starSignName: '金牛座',
        xzMonth: '(4.20-5.20)',
        xzImgName: 'Taurus'
      },
      {
        starSignId: 'Gemini',
        starSignName: '双子座',
        xzMonth: '(5.21-6.21)',
        xzImgName: 'Gemini'
      },
      {
        starSignId: 'Cancer',
        starSignName: '巨蟹座',
        xzMonth: '(6.22-7.22)',
        xzImgName: 'Cancer'
      },
      {
        starSignId: 'Leo',
        starSignName: '狮子座',
        xzMonth: '(7.23-8.22)',
        xzImgName: 'Leo'
      },
      {
        starSignId: 'Virgo',
        starSignName: '处女座',
        xzMonth: '(8.23-9.22)',
        xzImgName: 'Virgo'
      },
      {
        starSignId: 'Libra',
        starSignName: '天秤座',
        xzMonth: '(9.23-10.23)',
        xzImgName: 'Libra'
      },
      {
        starSignId: 'Scorpio',
        starSignName: '天蝎座',
        xzMonth: '(10.24-11.22)',
        xzImgName: 'Scorpio'
      },
      {
        starSignId: 'Sagittarius',
        starSignName: '射手座',
        xzMonth: '(11.23-12.21)',
        xzImgName: 'Sagittarius'
      },
      {
        starSignId: 'Capricorn',
        starSignName: '摩羯座',
        xzMonth: '(12.22-1.19)',
        xzImgName: 'Capricorn'
      },
      {
        starSignId: 'Aquarius',
        starSignName: '水瓶座',
        xzMonth: '(1.20-2.18)',
        xzImgName: 'Aquarius'
      },
      {
        starSignId: 'Pisces',
        starSignName: '双鱼座',
        xzMonth: '(2.19-3.20)',
        xzImgName: 'Pisces'
      }
    ],
    qiniuyunUrl: ''
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
    that.setData({
      qiniuyunUrl: app.globalData.qiniuyunBase
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
  onShareAppMessage: function () {
    return {
      title: '星座运势~',
      desc: '分享个小程序，希望你喜欢~',
      success: function (res) {
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  }
})