// pages/more/xingzuo/starsign-detail/starsign-detail.js
var app = getApp();
var util = require("../../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    starSigns: [{
        starSignId: 'Aries',
        starSignName: '白羊座',
        xzImgName: 'by'
      },
      {
        starSignId: 'Taurus',
        starSignName: '金牛座',
        xzImgName: 'jn'
      },
      {
        starSignId: 'Gemini',
        starSignName: '双子座',
        xzImgName: 'szz'
      },
      {
        starSignId: 'Cancer',
        starSignName: '巨蟹座',
        xzImgName: 'jx'
      },
      {
        starSignId: 'Leo',
        starSignName: '狮子座',
        xzImgName: 'sz'
      },
      {
        starSignId: 'Virgo',
        starSignName: '处女座',
        xzImgName: 'cn'
      },
      {
        starSignId: 'Libra',
        starSignName: '天秤座',
        xzImgName: 'tp'
      },
      {
        starSignId: 'Scorpio',
        starSignName: '天蝎座',
        xzImgName: 'tx'
      },
      {
        starSignId: 'Sagittarius',
        starSignName: '射手座',
        xzImgName: 'ss'
      },
      {
        starSignId: 'Capricorn',
        starSignName: '摩羯座',
        xzImgName: 'mj'
      },
      {
        starSignId: 'Aquarius',
        starSignName: '水瓶座',
        xzImgName: 'sp'
      },
      {
        starSignId: 'Pisces',
        starSignName: '双鱼座',
        xzImgName: 'sy'
      }
    ],
    swiperIndex: 0,
    dates: [{
        code: 'today',
        date: '今日'
      },
      {
        code: 'tomorrow',
        date: '明日'
      },
      {
        code: 'week',
        date: '本周'
      },
      {
        code: 'month',
        date: '本月'
      },
      {
        code: 'year',
        date: '我的年运'
      }
    ],
    selected: 'today',
    constellation: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var starSignId = options.id;
    // 遍历为swiperIndex赋值
    for (var i in that.data.starSigns) {
      if (that.data.starSigns[i].starSignId == starSignId) {
        that.setData({
          swiperIndex: i
        });
      }
    }
    var reqUrl = app.globalData.juhexingzuoBase + "/constellation/getAll?consName=" + that.data.starSigns[that.data.swiperIndex].starSignName + "&type=today&key=" + app.globalData.juhexingzuoKey;
    // 查询星座运势
    wx.showNavigationBarLoading();
    that.getStarSignData(reqUrl, "today");
    that.setData({
      selected: "today"
    })
    wx.setNavigationBarTitle({
      title: "今日运势"
    })
  },

  /** 改变轮番 */
  swiperChange(e) {
    console.log(e);
    this.setData({
      swiperIndex: e.detail.current,
      selected: "today"
    })
    var reqUrl = app.globalData.juhexingzuoBase + "/constellation/getAll?consName=" + this.data.starSigns[e.detail.current].starSignName + "&type=today&key=" + app.globalData.juhexingzuoKey;
    // 查询星座运势
    wx.showNavigationBarLoading();
    this.getStarSignData(reqUrl, "today");

    wx.setNavigationBarTitle({
      title: "今日运势"
    })
  },

  /** 选择日期 */
  onDateTap: function(e) {
    wx.showNavigationBarLoading();
    var that = this;
    var code = e.currentTarget.dataset.code;
    var title = '';
    var reqUrl = "http://web.juhe.cn:8080/constellation/getAll?consName=" + that.data.starSigns[that.data.swiperIndex].starSignName + "&type=" + code + "&key=6ac9204cc6613922a445bae75769d5db";
    // 查询星座运势
    that.getStarSignData(reqUrl, code);
    switch (code) {
      case "today":
        title = "今日运势";
        break;
      case "tomorrow":
        title = "明日运势";
        break;
      case "week":
        title = "本周运势";
        break;
      case "month":
        title = "本月运势";
        break;
      case "year":
        title = "今年运势";
        break;
    }
    this.setData({
      selected: code
    })
    wx.setNavigationBarTitle({
      title: title
    })

  },

/**
 * 获取星座数据
 */
  getStarSignData: function(url, type) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log(res);
        that.processData(res.data, type);
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  /**
   * 运势数据的封装
   */
  processData: function(data, type) {
    var constellation = {};
    constellation = data;
    if (type == 'today') {
      // 数据
      constellation.all = this.convertToArray(data.all);
      constellation.health = this.convertToArray(data.health);
      constellation.love = this.convertToArray(data.love);
      constellation.money = this.convertToArray(data.money);
      constellation.work = this.convertToArray(data.work);
    }

    this.setData({
      constellation: constellation
    })
    wx.hideNavigationBarLoading();
    console.log(constellation);
  },

  // 星座评分转换
  convertToArray: function(score) {
    console.log(score);
    var num = parseFloat(score);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if ((i * 20) <= num) {
        array.push(1);
      } else {
        array.push(0);
      }
    }
    return array;
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
  onShareAppMessage: function() {

  }
})