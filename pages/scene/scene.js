// pages/scene/scene.js
const get = require('lodash.get')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalLabel: '',
    scenes: [
      {
        label: 'Airport',
        id: 1,
        bg: 'cloud://main-6lo90.6d61-main-6lo90-1300808637/img/amarnath-tade-gXs-mwiXrhA-unsplash (1).jpeg'
      },
      {
        label: 'Hotel',
        id: 2,
        bg: 'cloud://main-6lo90.6d61-main-6lo90-1300808637/img/anmol-seth-hDbCjHNdF48-unsplash (1).jpeg'
      },
      {
        label: 'Restaurant',
        id: 3,
        bg: 'cloud://main-6lo90.6d61-main-6lo90-1300808637/img/stil-u2Lp8tXIcjw-unsplash (1).jpeg'
      },
      {
        label: 'Shopping',
        id: 4,
        bg: 'cloud://main-6lo90.6d61-main-6lo90-1300808637/img/eduardo-soares-QsYXYSwV3NU-unsplash (1).jpeg'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  initTabbar: function() {
    const tabBar = this.getTabBar()
    if (tabBar) {
      tabBar.setData({ selected: 1 })
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'Home'
    })
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
  fetchData: async function () {
    const db = wx.cloud.database()
    const whereCondition = {}
    const { typeid } = this.data
    if (typeid) whereCondition.type_id = typeid

    const count = await db.collection('sentences').count()
    const total = get(count, 'total')
    this.setData({ totalLabel: total ? `共${total}句口语` : ''})
  },
})
