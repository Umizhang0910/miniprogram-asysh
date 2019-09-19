// pages/index/book/book.js
const app = getApp();
const util = require("../../../utils/util.js");

Page({

  /**
     * 页面的初始数据
     */
  data: {
    inputShowed: false,
    inputVal: "",
    books: {}
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
    // 获取图书信息
    var bookUrl = app.globalData.doubanBase + "/v2/book/search?tag=文学&count=20";
    util.http(bookUrl, this.getBookDataByDouban);
  },
  // 处理豆瓣图书数据
  getBookDataByDouban: function (data) {
    var books = [];
    for (var i in data.books) {
      var book = data.books[i];
      // 处理标题
      var title = book.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // 作者
      var author = "";
      for (var i in book.author) {
        author = author + "/" + book.author[i];
      }
      author = author.substring(1);
      if (author.length >= 9) {
        author = author.substring(0, 9) + "...";
      }
      var temp = {
        stars: this.convertToStarsArray(book.rating.average),
        title: title,
        average: book.rating.average,
        coverageUrl: book.image,
        bookId: book.id,
        bookAuthor: author,
      }
      books.push(temp);
    }
    this.setData({
      books: books
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