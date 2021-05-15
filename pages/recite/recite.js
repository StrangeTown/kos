// pages/recite/recite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentences: [],
    activeIndex: 0,
    speed: 2000,
    reciteInterval: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
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
    clearInterval(this.data.reciteInterval)
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
  start: function() {
    clearInterval(this.data.reciteInterval)
    const milliseconds = this.data.speed

    const newInterval = setInterval(() => {
      const newIdx = Math.floor(Math.random() * 7)
      this.setData({
        activeIndex: newIdx
      })
    }, milliseconds);
    this.setData({
      reciteInterval: newInterval
    })
  },
  fetchData: function() {
    const db = wx.cloud.database()
    db.collection('sentences').limit(7).get({
      success: res => {
        this.setData({
          sentences: res.data
        })
        this.start()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  slow: function() {
    this.setData({
      speed: 3000
    })
    this.start()
  },
  fast: function() {
    this.setData({
      speed: 1500
    })
    this.start()
  }
})
