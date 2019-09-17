//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");

Page({
  data: {
    location: '', // 城市
    county: '', // 区县
    sliderList: [{
        selected: true,
        imageSource: '04.jpg'
      },
      {
        selected: false,
        imageSource: '01.png'
      },
      {
        selected: false,
        imageSource: '02.png'
      },
      {
        selected: false,
        imageSource: '03.png'
      }
    ],
    today: "",
    inTheaters: {},
    containerShow: true,
    weatherData: '',
    air: '',
    dress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 更新当前日期
    app.globalData.day = util.formatTime(new Date()).split(' ')[0];
    this.setData({
      today: app.globalData.day
    });
    // 定位当前城市
    this.getLocation();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: 'a 尙源生活',
      desc: '分享个小程序，希望你喜欢😁~',
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          duration: 1000,
          icon: "success"
        })
      }
    }
  },

  // 引入了电影模板，绑定了点击方法，这里写跳转方法即可
  // 点击电影，进入详情页面
  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movies/movie-detail/movie-detail?id=" + movieId
    })
  },
  // 点击更多电影，跳转页面
  onMoreTap: function(event) {
    wx.switchTab({
      url: '../movies/movies'
    });
  },
  // 轮播图绑定change事件，修改图标的属性是否被选中
  switchTab: function(e) {
    var sliderList = this.data.sliderList;
    var i, item;
    for (i = 0; item = sliderList[i]; ++i) {
      item.selected = e.detail.current == i;
    }
    this.setData({
      sliderList: sliderList
    });
  },
  //点击更改定位切换到城市页面
  jump: function() {
    //关闭本页去切换城市，返回时就可以重新初始化定位信息哦
    wx.reLaunch({
      url: '../city/city'
    });
  },
  //点击天气跳转到天气页面
  gotoWeather: function() {
    wx.navigateTo({
      url: '../weather/weather'
    });
  },

  // 定位当前城市
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        // 当前的进度和纬度
        const latitude = res.latitude;
        const longitude = res.longitude;
        // 获取城市
        wx.request({
          url: app.globalData.tencentMapBase + '/ws/geocoder/v1',
          data: {
            "location": latitude + "," + longitude,
            "key": app.globalData.tencentMapKey
          },
          success: res => {
            app.globalData.defaultCity = app.globalData.defaultCity ? app.globalData.defaultCity : res.data.result.ad_info.city;
            app.globalData.defaultCounty = app.globalData.defaultCounty ? app.globalData.defaultCounty : res.data.result.ad_info.district;
            that.setData({
              location: app.globalData.defaultCity,
              county: app.globalData.defaultCounty
            });
            // 获取天气信息
            that.getWeather();
            // 获取空气质量
            that.getAir();
            // 获取豆瓣电影正在热映电影信息
            var getTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=10&city=" + app.globalData.defaultCity.substring(0, app.globalData.defaultCity.indexOf('市'));
            that.getMovieListData(getTheatersUrl, "inTheaters");
          }
        })
      }
    })
  },
  // 获取天气
  getWeather: function(e) {
    var length = this.data.location.length;
    var city = this.data.location.slice(0, length - 1); //分割字符串
    var that = this;
    var param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    //发出请求
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/weather",
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        app.globalData.weatherData = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0];
        var weatherData = app.globalData.weatherData ? app.globalData.weatherData.now : "暂无该城市天气信息";
        var dress = app.globalData.weatherData ? res.data.HeWeather6[0].lifestyle[1] : {
          txt: "暂无该城市天气信息"
        };
        that.setData({
          weatherData: weatherData, //今天天气情况数组 
          dress: dress //生活指数
        });
      }
    })
  },
  // 获取当前空气质量情况
  getAir: function(e) {
    var length = this.data.location.length;
    var city = this.data.location.slice(0, length - 1);
    var that = this;
    var param = {
      key: app.globalData.heWeatherKey,
      location: city
    };
    wx.request({
      url: app.globalData.heWeatherBase + "/s6/air/now",
      data: param,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        app.globalData.air = res.data.HeWeather6[0].status == "unknown city" ? "" : res.data.HeWeather6[0].air_now_city;
        that.setData({
          air: app.globalData.air
        });
      }
    })
  },
  // 调用豆瓣获取热映电影的api
  getMovieListData: function(url, settedKey) {
    wx.showNavigationBarLoading()
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
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
          that.processDoubanData(res.data, settedKey)
        }
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  // 获得电影数据后的加工处理方法
  processDoubanData: function(moviesDouban, settedKey) {
    var movies = [];
    for (var i in moviesDouban.subjects) {
      // 一部电影信息
      var subject = moviesDouban.subjects[i];
      // 对电影名称较长的处理
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: moviesDouban.title.substring(0, moviesDouban.title.indexOf("-")),
      position: moviesDouban.title.substring(moviesDouban.title.indexOf("-") + 1),
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  }
})