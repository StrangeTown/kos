// pages/explore.js
import get from 'lodash.get'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentences: [],
    headText: '',
    headTextInterval: null
  },
  initTabbar: function() {
    const tabBar = this.getTabBar()
    if (tabBar) {
      tabBar.setData({ selected: 0 })
    }
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
    this.initTabbar()
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
  initHeadText: function(sentenceIdx) {
    const sentences = this.data.sentences
    const sentence = get(sentences, `[${sentenceIdx}].label`)
    const sentenceLength = sentences.length

    let idx = 0
    const lastIdx = sentence.length - 1
    const interval = setInterval(() => {
      if (idx > lastIdx) {
        clearInterval(this.data.headTextInterval)
        const nextSentenceIdx = sentenceIdx === (sentenceLength - 1) ? 0 : (sentenceIdx + 1)
        setTimeout(() => {
          this.initHeadText(nextSentenceIdx)
        }, 2000);
      } else {
        this.setData({
          headText: sentence.slice(0, idx + 1)
        })
        idx++
      }
    }, 360);
    this.setData({
      headTextInterval: interval
    })
  },
  fetchData: function() {
    const db = wx.cloud.database()
    const fetchLimit = 10

    db.collection('sentences')
      .orderBy('created_at', 'desc')
      .limit(fetchLimit)
      .get({
        success: res => {
          this.setData({
            sentences: res.data,
          })
          this.initHeadText(0)
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
})
