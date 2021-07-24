const get = require('lodash.get')

// pages/review/review.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sentences: [],
    modelVisible: false,
    modelItem: null,
    typeid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setPageTitle(options.type_label)

    this.setData({ typeid: options.typeid }, () => {
      this.fetchData()
    })
  },
  setPageTitle: function(title) {
    wx.setNavigationBarTitle({
      title: title || '列表',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  fetchData: function () {
    const db = wx.cloud.database()
    const whereCondition = {}
    const { typeid } = this.data
    if (typeid) whereCondition.type_id = typeid

    db.collection('sentences')
      .orderBy('created_at', 'desc')
      .where(whereCondition)
      .limit(20)
      .skip(this.data.sentences.length)
      .get({
        success: (res) => {
          const sentences = [...this.data.sentences, ...res.data]
          this.setData({
            sentences,
          })
        },
        fail: (err) => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败',
          })
          console.error('[数据库] [查询记录] 失败：', err)
        },
      })
  },
  like: function () {
    const sentenceId = get(this.data.modelItem, '_id')
    if (!sentenceId) return

    wx.cloud.callFunction({
      // 云函数名称
      name: 'like',
      // 传给云函数的参数
      data: {
        sentenceid: sentenceId,
      },
      success: (res) => {
        const msg = get(res, 'result.msg')
        this.setData({ modelVisible: false })
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1000,
        })
      },
      fail: console.error,
    })
  },
  focus: function (e) {
    const sentenceId = e.target.dataset.id
    if (!sentenceId) return

    const modelItem = this.data.sentences.find((s) => s._id === sentenceId)
    this.setData({
      modelItem,
      modelVisible: true,
    })
  },
  close: function () {
    this.setData({ modelVisible: false })
  },
})
