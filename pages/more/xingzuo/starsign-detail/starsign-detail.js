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
        xzImgName: 'by',
        astroid: 1
      },
      {
        starSignId: 'Taurus',
        starSignName: '金牛座',
        xzImgName: 'jn',
        astroid: 2
      },
      {
        starSignId: 'Gemini',
        starSignName: '双子座',
        xzImgName: 'szz',
        astroid: 3
      },
      {
        starSignId: 'Cancer',
        starSignName: '巨蟹座',
        xzImgName: 'jx',
        astroid: 4
      },
      {
        starSignId: 'Leo',
        starSignName: '狮子座',
        xzImgName: 'sz',
        astroid: 5
      },
      {
        starSignId: 'Virgo',
        starSignName: '处女座',
        xzImgName: 'cn',
        astroid: 6
      },
      {
        starSignId: 'Libra',
        starSignName: '天秤座',
        xzImgName: 'tp',
        astroid: 7
      },
      {
        starSignId: 'Scorpio',
        starSignName: '天蝎座',
        xzImgName: 'tx',
        astroid: 8
      },
      {
        starSignId: 'Sagittarius',
        starSignName: '射手座',
        xzImgName: 'ss',
        astroid: 9
      },
      {
        starSignId: 'Capricorn',
        starSignName: '摩羯座',
        xzImgName: 'mj',
        astroid: 10
      },
      {
        starSignId: 'Aquarius',
        starSignName: '水瓶座',
        xzImgName: 'sp',
        astroid: 11
      },
      {
        starSignId: 'Pisces',
        starSignName: '双鱼座',
        xzImgName: 'sy',
        astroid: 12
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
    var reqUrl = app.globalData.jisuBase + "/astro/fortune?astroid=" + that.data.starSigns[that.data.swiperIndex].astroid + "&appkey=" + app.globalData.jisuappkey;
    // 查询星座运势
    wx.showNavigationBarLoading();
    that.getStarSignData(reqUrl);
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
    if (this.data.swiperIndex != e.detail.current) {
      this.setData({
        swiperIndex: e.detail.current,
        selected: "today"
      })
      var reqUrl = app.globalData.jisuBase + "/astro/fortune?astroid=" + this.data.starSigns[e.detail.current].astroid + "&appkey=" + app.globalData.jisuappkey;
      // 查询星座运势
      wx.showNavigationBarLoading();
      this.getStarSignData(reqUrl);

      wx.setNavigationBarTitle({
        title: "今日运势"
      })
    }
  },

  /** 选择日期 */
  onDateTap: function(e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    var title = '';
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
  getStarSignData: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        that.processData(res.data);
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  /**
   * 运势数据的封装
   */
  processData: function(data) {
    var constellation = {};
    if (data.status == 0) {
      constellation = data.result;
      // 数据转换 今日
      constellation.today.summary = this.convertToArray(constellation.today.summary);
      constellation.today.health = this.convertToArray(constellation.today.health);
      constellation.today.love = this.convertToArray(constellation.today.love);
      constellation.today.money = this.convertToArray(constellation.today.money);
      constellation.today.career = this.convertToArray(constellation.today.career);
      // 数据转换 明日
      constellation.tomorrow.summary = this.convertToArray(constellation.tomorrow.summary);
      constellation.tomorrow.health = this.convertToArray(constellation.tomorrow.health);
      constellation.tomorrow.love = this.convertToArray(constellation.tomorrow.love);
      constellation.tomorrow.money = this.convertToArray(constellation.tomorrow.money);
      constellation.tomorrow.career = this.convertToArray(constellation.tomorrow.career);
    } else {
      console.log(data);
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
      if (i <= num) {
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