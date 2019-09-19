// pages/index/music/music.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: ""
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var musicUrl = app.globalData.doubanBase + "/v2/music/search?tag=流行&count=20";
    util.http(musicUrl, this.getMusicDataByDouban);

  },

  // 处理豆瓣音乐数据
  getMusicDataByDouban: function (data) {
    var musics = [];
    for (var i in data.musics) {
      var music = data.musics[i];
      // 处理标题
      var title = music.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // 作者
      var author = "";
      for (var i in music.author) {
        author = author + "/" + music.author[i].name;
      }
      author = author.substring(1);
      if (author.length >= 9) {
        author = author.substring(0, 9) + "...";
      }
      var temp = {
        stars: this.convertToStarsArray(music.rating.average),
        title: title,
        average: music.rating.average,
        coverageUrl: music.image,
        musicId: music.id,
        musicAuthor: author,
      }
      musics.push(temp);
    }
    this.setData({
      musics: musics
    });
  },
  // 转换星级数据
  convertToStarsArray: function (score) {
    var num = parseFloat(score);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i * 2 <= num) {
        array.push(1);
      } else {
        array.push(0);
      }
    }
    return array;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})