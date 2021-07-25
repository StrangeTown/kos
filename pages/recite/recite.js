const get = require("lodash.get")
// 在页面中定义激励视频广告
let videoAd = null

// pages/recite/recite.js
const loadingTips = [
  '利用碎片时间背几句口语吧',
  '删除记熟的条目，载入新的口语',
  '使用夸张的语气，给大脑更丰富的刺激',
  '积累足够多，让开口更容易',
  '刷短视频的时间，不如背上几句口语',
]
let timeInterval = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fetchedCount: 0,
    sentences: [],
    activeIndex: 0,
    speed: 2500,
    reciteInterval: null,
    loading: true,
    loadingTip: '',
    progress: Array(7).fill(1),
    startTime: null,
    timeStr: '',
    hinting: false,
    voicePlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const typeid = options.typeid

    this.initLoadingTip()
    setTimeout(() => {
      this.setData({ loading: false })
    }, 2000)

    this.fetchData({ typeid })
    this.initAd()
    this.setTitle(' ')
  },
  initAd: function() {
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-403748566480b308'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          this.togglePlay()
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
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
    clearInterval(timeInterval)
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
  playSentenceAudio: function(sentenceIdx) {
    const item = this.data.sentences[sentenceIdx]
    const mp3 = get(item, 'mp3')
    if (mp3 && this.data.voicePlaying) {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src = mp3
    }
  },
  start: function() {
    clearInterval(this.data.reciteInterval)
    const milliseconds = this.data.speed

    const newInterval = setInterval(() => {
      const dataLength = this.data.sentences.length
      const newIdx = Math.floor(Math.random() * dataLength)
      this.playSentenceAudio(newIdx)
      this.setData({
        activeIndex: newIdx
      })
    }, milliseconds);

    this.setData({
      reciteInterval: newInterval
    })
  },
  setTitle: function(title) {
    if (title) {
      wx.setNavigationBarTitle({
        title
      })
    }
  },
  fetchMore: function() {
    const db = wx.cloud.database()
    const fetchLimit = 1
    const skipCount = this.data.fetchedCount
  
    db.collection('sentences')
      .orderBy('created_at', 'desc')
      .limit(fetchLimit)
      .skip(skipCount)
      .get({
        success: res => {
          const newSentences = [...this.data.sentences, ...res.data]
          this.setData({
            sentences: newSentences,
            fetchedCount: this.data.fetchedCount + fetchLimit
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
  fetchData: function({ typeid }) {
    const db = wx.cloud.database()
    const fetchLimit = 7
    const whereCondition = {}
    if (typeid) whereCondition.type_id = typeid

    db.collection('sentences')
      .orderBy('created_at', 'desc')
      .where(whereCondition)
      .limit(fetchLimit)
      .get({
        success: res => {
          this.setData({
            sentences: res.data,
            fetchedCount: this.data.fetchedCount + fetchLimit
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
  },
  updateProgress: function() {
    const newProgerss = [...this.data.progress, 1]
    this.setData({ progress: newProgerss })
  },
  deleteItem: function(e) {
    const itemIdx = e.currentTarget.dataset.val
    const newSentences = [...this.data.sentences]
    newSentences.splice(itemIdx, 1)

    this.setData({
      sentences: newSentences,
    })
    this.fetchMore()
    this.updateProgress()
  },
  initLoadingTip: function() {
    const tipsLength = loadingTips.length
    const tipIdx = Math.floor(Math.random() * tipsLength)
    const activeTip = loadingTips[tipIdx]
    this.setData({
      loadingTip: activeTip
    })
  },
  startTimeInterval: function() {
    timeInterval = setInterval(() => {
      this.updateTimeStr()
    }, 1000);
  },
  updateTimeStr: function() {
    let startDate = this.data.startTime
    if (!startDate) {
      startDate = new Date()
      this.setData({ startTime: startDate })
    }
    const endDate = new Date()

    const secondsDiff = (endDate.getTime() - startDate.getTime()) / 1000
    const intSeconds = Number.parseInt(secondsDiff, 10)
    const minutes = Math.floor(intSeconds / 60)
    const seconds = intSeconds - (minutes * 60)
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds
    this.setData({ timeStr: `${minutes}:${secondsStr}` })
  },
  toggleHint: function() {
    const hintState = this.data.hinting
    this.setData({
      hinting: !hintState
    })
  },
  showAd: function() {
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  handleVoiceClick: function() {
    if (this.data.voicePlaying) {
      this.togglePlay()
    } else {
      this.showAd()
    }
  },
  togglePlay: function() {
    const playState = this.data.voicePlaying
    this.setData({
      voicePlaying: !playState
    })
  }
})
