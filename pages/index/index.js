// index.js
// 获取应用实例
const app = getApp()
const recorderManager = wx.getRecorderManager();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  bindtest:function () {

      wx.request({
        url: 'http://47.97.152.69:8080/webtest1/TestServlet',
        data: {account:'abc',
               account:'test1'},
        enableCache: true,
        enableHttp2: true,
        enableQuic: true,
        header: {
          'content-type':
          'application/json' //默认值
        },
        method: 'GET',
        timeout: 0,
        success: (res) => {console.log(res.data);},
        fail: (res) => {console.log("失败");},
        complete: (res) => {},
      })
   }
,
  
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tip: function (msg) {
    wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false
    })
  },

  startRecordMp3: function () {
    recorderManager.start({
        format: 'mp3'
    });
}

/**
 * 停止录音
 */
, stopRecord: function () {
    recorderManager.stop()
}

/**
 * 播放录音
 */
, playRecord: function () {
    var that = this;
    var src = this.data.src;
    if (src == '') {
        this.tip("请先录音！")
        return;
    }
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.play()
},
sendRecord: function () {
  var that = this;
  wx.uploadFile({
    url: 'http://47.97.152.69:8080/voice/aip',
    filePath: that.data.src,
    formData: {
      method: 'POST'
    },
    name: 'file',
    success: function(res) {
      console.log(res.data)
    }
});
},

onLoad: function (options) {
    var that = this;
    recorderManager.onError(function () {
        that.tip("录音失败！")
    });
    recorderManager.onStop(function (res) {
        that.setData({
            src: res.tempFilePath
        })
        console.log(res.tempFilePath)
        that.tip("录音完成！")
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
        that.tip("播放录音失败！")
    })

},


})