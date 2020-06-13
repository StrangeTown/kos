// pages/training/training.js
import req from '../../request/index'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scentences: [],
    activeIndex: 0,
    pregressLeft: '0',
    pregressDone: '0',
    previewDisplay: true,
    enStateClass: '',
    textLeftBtn: '忘了',
    textRightBtn: '记得'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type || 0
    const time = options.time || ''
    const tag = options.tag || 0
    this.fetchScentences({ type, time, tag })
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
  fetchScentences: function({ type, time, tag}) {
    let self = this
    const params = {
      url: req.urls.scentencesUrl,
      data: {
        type,
        time,
        tag
      },
      success: function (res) {
        if (res.statusCode === 401) {
          self.updateToken()
          return
        }

        if (res.data.status === 0) {
          self.setData({
            scentences: [...res.data.sentences_list]
          })
          app.globalData.scentences = [...res.data.sentences_list]
          self.setProgress(-1)
        }
      },
      fail: function (res) {
        console.log("res", res)
      },
      complete: function (res) { 
        wx.hideLoading()
      },
    }

    req.doRequest(params)
  },
  updateToken() {
    wx.removeStorage({
      key: 'login_token',
      success: function() {
        console.log('login_token removed')
        app.doLogin(() => {
          wx.reLaunch({
            url: '/pages/home/home'
          })
        })
      }
    })
  },
  setProgress(index) {
    const percentage = (index + 1) / this.data.scentences.length

    this.setData({
      pregressLeft: `${(1 - percentage) * 30}vh`,
      pregressDone: `${percentage * 30}vh`
    })
  },
  remember: function() {
    const index = this.data.activeIndex
    const hasMore = index < this.data.scentences.length - 1
    if (hasMore) {
      this.setData({
        activeIndex: index + 1
      })
    } else {
      wx.showToast({
        title: '全部完成',
        icon: 'success',
        duration: 2000
      })
    }
    this.setProgress(index)
  },
  forget: function() {
    this.setData({
      activeIndex: 0
    })
    this.setProgress(-1)
  },
  handleReadyClick: function() {
    this.setData({
      previewDisplay: false
    })
  },
  lightEn () {
    this.setData({ enStateClass: 'active' })
  },
  darkEn () {
    this.setData({ enStateClass: '' })
  },
})
