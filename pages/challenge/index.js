import get from 'lodash.get'

// pages/challenge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentences: [],
    fragments: [],
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchRandomData()
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
  initTabbar: function() {
    const tabBar = this.getTabBar()
    if (tabBar) {
      tabBar.setData({ selected: 2 })
    }
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
  fetchRandomData: async function() {
    const db = wx.cloud.database()
    const res = await db.collection('sentences').count()
    const total = res.total

    var arr = [];
    while(arr.length < 5){
      var r = Math.floor(Math.random() * total) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }

    const tasks = []
    arr.forEach(item => {
      const skipNum = item - 1
      const promise = db.collection('sentences').skip(skipNum).limit(1).get()
      tasks.push(promise)
    })
    const allResp = await Promise.all(tasks)
    const list = allResp.map(r => {
      return r.data[0]
    })
    const fragments = list.reduce((prev, curr) => {
      const words = get(curr, 'value', '').split(' ')
      return [ ...prev, ...words ]
    }, [])
    this.setData({
      sentences: list,
      fragments
    })
  },
})
