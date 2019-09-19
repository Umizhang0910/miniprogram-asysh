//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util.js");

Page({
  data: {
    // 此处为日历自定义配置字段
    calendarConfig: {
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 初始化时不默认选中当天，则将该值配置为false。
       */
      defaultDay: true,
      multi: true, // 是否开启多选,
      theme: 'default', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: true, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      disablePastDay: true, // 是否禁选过去的日期
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    },
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
    dress: '',
    showDateSimple: true,
    showDateDetail: false,
    thisDate: util.formatDateTime(new Date()).split(' ')[0],
    thisTime: util.formatDateTime(new Date()).split(' ')[1],
    inMusics: {},
    inBooks: {}
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
    // 获取音乐信息
    var musicUrl = app.globalData.doubanBase + "/v2/music/search?tag=流行&count=20";
    util.http(musicUrl, this.getMusicDataByDouban);
    // 获取图书信息
    var bookUrl = app.globalData.doubanBase + "/v2/book/search?tag=文学&count=20";
    util.http(bookUrl, this.getBookDataByDouban);
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

  gotoSimpleDate: function() {
    this.setData({
      showDateSimple: false,
      showDateDetail: true,
    })
  },
  gotoDetailDate: function() {
    this.setData({
      showDateSimple: true,
      showDateDetail: false,
    })
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
  // 点击更多音乐，进入页面
  onMoreMusicTap: function() {
    var that = this;
    wx.navigateTo({
      url: 'music/music?movies'
    })
  },
  // 点击更多读书，进入页面
  onMoreBookTap: function() {
    var that = this;
    wx.navigateTo({
      url: 'book/book?books'
    })
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
    console.log(moviesDouban);
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
  },

  // 处理豆瓣音乐数据
  getMusicDataByDouban: function(data) {
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
    var readyData = {};
    readyData["inMusics"] = {
      categoryTitle: "流行音乐",
      musics: musics
    }
    this.setData(readyData);
  },
  // 处理豆瓣图书数据
  getBookDataByDouban: function(data) {
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
    var readyData = {};
    readyData["inBooks"] = {
      categoryTitle: "畅读书籍",
      books: books
    }
    this.setData(readyData);
  },

  // 转换星级数据
  convertToStarsArray: function(score) {
    var num = parseFloat(score);
    var array = [];
    for (var i = 1; i <= 5; i++) {
      if (i*2 <= num) {
        array.push(1);
      } else {
        array.push(0);
      }
    }
    return array;
  }
})