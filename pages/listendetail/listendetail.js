// pages/listendetail/listendetail.js
const get = require('lodash.get')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio: '',
    audioContext: null,
    isPlaying: false,
    playbackRate: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.fetchData({ id })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  togglePaly: function() {
    const newState = !this.data.isPlaying
    if (newState) {
      this.data.audioContext.play()
    } else {
      this.data.audioContext.pause()
    }
    this.setData({
      isPlaying: newState
    })
  },
  updateSpeed: function(e) {
    const val = e.target.dataset.val
    this.setData({
      playbackRate: val
    })
    this.data.audioContext.playbackRate = val
  },
  initAudio: function() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = false
    innerAudioContext.src = this.data.audio
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    this.setData({
      audioContext: innerAudioContext
    })
  },
  fetchData: function({ id }) {
    const db = wx.cloud.database()
    db.collection('listening').where({
      _id: id
    }).get({
      success: res => {
        const data = res.data
        const audioItem = data[0]
        const audio = get(audioItem, 'audio', '')

        this.setData({
          audio
        })
        this.initAudio()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }
})
