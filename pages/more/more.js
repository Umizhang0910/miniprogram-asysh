// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [{
        toolIcon: "constellation",
        toolTitle: "星座运势",
        toolDesc: "十二星座每日、每周、每月、每年运势详解"
      }
    ]
  },

// ,
//       {
//         toolIcon: "zipcode",
//         toolTitle: "邮编查询",
//         toolDesc: "提供全国邮政编码大全,为你快速准确查邮编"
//       },
//       {
//         toolIcon: "dictionary",
//         toolTitle: "新华字典",
//         toolDesc: "最大最全的新华汉语词典，按拼音查、按部首查、按笔画查"
//       }
  /**
   * 点击进入功能使用页
   */
  onUseTap: function(event) {
    var toolTitle = event.currentTarget.dataset.tool;
    var toUrl = "";
    if (toolTitle == '星座运势') {
      toUrl = "xingzuo/xingzuo";

    } else if (toolTitle == '邮编查询') {
      toUrl = "youbian/youbian";

    } else if (toolTitle == '新华字典') {
      toUrl = "zidian/zidian";
    }
    wx.navigateTo({
      url: toUrl,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideNavigationBarLoading();
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