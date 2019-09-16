// pages/movies/movies.js

var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {}, // 正在上映
    comingSoon: {}, // 即将上映
    top250: {}, // 排行前250
    searchRes: {}, // 电影搜索结果
    containerShow: true,
    searchPanelShow: false,
    searchText: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 获取正在热映的电影：https://douban.uieee.com/v2/movie/in_theaters
     * 访问参数：start : 数据的开始项；count：单页条数
     */
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=10&city=" + app.globalData.defaultCity;
    /**
     * 获取即将上映电影：https://douban.uieee.com/v2/movie/coming_soon
     * 访问参数：start : 数据的开始项；count：单页条数
     */
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=10";
    /**
     * 获取电影Top250：https://douban.uieee.com/v2/movie/top250
     * 访问参数：start : 数据的开始项；count：单页条数
     */
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=10";
    /**电影本周口碑榜 */
    var highOpinionUrl = app.globalData.doubanBase + "/v2/movie/weekly" + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
    /**北美票房榜 */
    var usBoxUrl = app.globalData.doubanBase + "/v2/movie/us_box" + "?apikey=0df993c66c0c636e29ecbb5344252a4a";
    /**新片榜 */
    var newMoviesUrl = app.globalData.doubanBase + "/v2/movie/new_movies" + "?apikey=0df993c66c0c636e29ecbb5344252a4a";

    this.getMoviesData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMoviesData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMoviesData(top250Url, "top250", "豆瓣Top250");
    this.getMoviesData(highOpinionUrl, "highOpinion", "电影本周口碑榜");
    this.getMoviesData(usBoxUrl, "usBox", "北美票房榜");
    this.getMoviesData(newMoviesUrl, "newMovies", "新片榜");
  },

  // 获取电影数据集合
  getMoviesData: function (url, settedKey, categoryTitle) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        if (res.data.code != undefined || res.data.code != null) {
          wx.showToast({
            title: "获取影片数据失败！",
            duration: 1000,
            icon: "none"
          });
          wx.hideNavigationBarLoading();
        } else {
          that.processMoviesData(res.data, settedKey, categoryTitle);
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  // 处理获得的电影数据
  processMoviesData: function (doubanMovies, settedKey, categoryTitle) {
    var movies = [];
    for (var i in doubanMovies.subjects) {
      var subject = doubanMovies.subjects[i];
      var title = subject.title;
      if (title != undefined && title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var score = subject.rating.average + "";
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: score.length == 1 ? subject.rating.average + '.0' : subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  //点击搜索框，让container隐藏，搜索条显示
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  //搜索框失去焦点开始搜索
  onBindBlur: function (event) {
    var text = event.detail.value;
    /**
     * 电影搜索：https://douban.uieee.com/v2/movie/search
     * 访问参数：start : 数据的开始项；count：单页条数；q：要搜索的电影关键字；tag：要搜索的电影的标签
     */
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMoviesData(searchUrl, "searchRes", "");
  },

  //点击输入框的X 关闭
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchRes: {},
      searchText: ""
    });
  },

  // 跳转至更多电影页面
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },

  // 点击进入详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {
  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {
  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {
  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {
  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {
  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '豆瓣电影',
      desc: '一起看电影吧~'
    }
  }
})