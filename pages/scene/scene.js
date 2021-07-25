// pages/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '场景'
    })
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

  }
})
