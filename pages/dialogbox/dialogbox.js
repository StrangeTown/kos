// pages/dialogbox/dialogbox.js
const get = require('lodash.get')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    source: '',
    nextIndex: 0,
    sentList: [],
    nextItem: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData({ id: options.id })
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
  initList: function() {
    const item = this.data.list[0]
    this.setData({
      nextItem: item
    })
  },
  updateList: function() {
    const nextIdx = this.data.nextIndex + 1
    const sentList = this.data.list.slice(0, nextIdx)
    const nextItem = this.data.list[nextIdx] || {}

    this.setData({
      sentList,
      nextItem: nextItem,
      nextIndex: nextIdx
    })
  },
  fetchData: function({ id }) {
    const db = wx.cloud.database()
    db.collection('dialog').where({
      _id: id
    }).get({
      success: res => {
        const data = res.data
        const dialogData = get(data, '[0]')
        const list = get(dialogData, 'content', [])
        const source = get(dialogData, 'source', '')
        this.setData({
          list,
          source
        })
        this.initList()
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
  sendMsg: function() {
    this.updateList()
  }
})
