// pages/map/map.js
// 引用百度地图微信小程序JS api模块
var bmap = require("../../libs/bmap-wx.js");
var wxMarkerData = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    placeData: { title: '点击图上marker获取详细信息哦😋'},
    searchMethod: '酒店',
    bitmap: '',
    fail: '',
    success: '',
    selectState: [1,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: 'heTp7eyEK8d6cWplVB2VpXcmZywnhQfo'
    });
    that.setData({
      bitmap: BMap
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        fail: fail,
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    that.setData({
      success: success
    });
  },

  //点击地图标记点时触发，显示周边信息，改变标记点颜色
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.changeMarkerColor(wxMarkerData, id);
  },
  //上面方法调用，获得周边信息setData渲染到页面里
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: data[i].telephone == undefined ? '电话：暂无信息' : '电话：' + data[i].telephone
      }
    });
  },
  //上面方法调用，改变标记点颜色
  changeMarkerColor: function (data, id) {
    var that = this;
    var markersTemp = [];
    for (var i = 0; i < data.length; i++) {
      if (i === id) {
        data[i].iconPath = "../../images/img/find/marker_blue.png";
      } else {
        data[i].iconPath = "../../images/img/find/marker_red.png";
      }
      markersTemp[i] = data[i];
    }
    that.setData({
      markers: markersTemp
    });
  },

  //点击酒店图标
  clickHotel: function () {
    this.setData({
      searchMethod: '酒店',
      selsectState: [1, 0, 0],
      placeData: { title: '点击图上marker获得附近-酒店-信息哦😋' }
    });
    this.onShow();
  },
  //点击美食图标
  clickFood: function () {
    this.setData({
      searchMethod: '美食',
      selsectState: [0, 1, 0],
      placeData: { title: '点击图上marker获得附近-美食-信息哦😋' }
    });
    this.onShow();
  },
  //点击服务图标
  clickService: function () {
    this.setData({
      searchMethod: '生活服务',
      selsectState: [0, 0, 1],
      placeData: { title: '点击图上marker获得附近-生活服务-信息哦😋' }
    });
    this.onShow();
  },
  //根据不同类型，请求百度POI的数据
  onShow: function () {
    // 发起POI检索请求 
    this.data.bitmap.search({
      "query": this.data.searchMethod,
      fail: this.data.fail,
      success: this.data.success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/img/find/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/img/find/marker_red.png'
    });
  },
  /**
   * 点击分享
   */
  onShareAppMessage: function () {
    return {
      title: '生活服务',
      desc: '分享个小程序，希望你喜欢😁~',
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