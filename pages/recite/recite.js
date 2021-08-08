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
    loading: true,
    loadingTip: '',
    hinting: false,
    voicePlaying: false,
    working: true,
    autoUpdating: false
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

    this.fetchData({
      typeid,
      cb: this.activateNext
    })
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
    clearInterval(timeInterval)
    this.setData({ working: false })
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
  getRandomIndex: function() {
    const dataLength = this.data.sentences.length
    let newIdx = Math.floor(Math.random() * dataLength)

    const sameAsBefore = newIdx === this.data.activeIndex
    const noValue = !get(this.data.sentences, `[${newIdx}].value`)

    if (sameAsBefore || noValue) {
      newIdx = newIdx + 1 > dataLength - 1 ? 0 : newIdx + 1
    }

    return newIdx
  },
  autoUpdate: function(sentennceIndex) {
    if (Math.random() < 0.6) return

    setTimeout(() => {
      this.fetchNew((item) => {
        this.updateSentencesData(item, sentennceIndex)
      })
    }, 1000)
  },
  loadSentence: function(sentennceIndex) {
    this.playSentenceAudio(sentennceIndex)
    this.setData({
      activeIndex: sentennceIndex
    })

    if (this.data.autoUpdating) {
      this.autoUpdate(sentennceIndex)
    }
  },
  getIntervalTime: function(sentennceIndex) {
    const str = this.data.sentences[sentennceIndex]
    const strLength = get(str, 'label.length')
    const intervalTime = strLength ? strLength * 680 : 3000
    return intervalTime
  },
  activateNext: function() {
    if (!this.data.working) return

    const sentennceIndex = this.getRandomIndex()
    console.log(sentennceIndex)
    this.loadSentence(sentennceIndex)

    setTimeout(this.activateNext, this.getIntervalTime(sentennceIndex))
  },
  setTitle: function(title) {
    if (title) {
      wx.setNavigationBarTitle({
        title
      })
    }
  },
  updateSentencesData: function(item, indexToDelete) {
    const sentences = this.data.sentences.map((s, idx) => {
      return idx === indexToDelete ? item : s
    })
    this.setData({ sentences })
  },
  fetchNew: function(cb) {
    const db = wx.cloud.database()
    const fetchLimit = 1
    const skipCount = this.data.fetchedCount

    db.collection('sentences')
      .orderBy('created_at', 'desc')
      .limit(fetchLimit)
      .skip(skipCount)
      .get({
        success: res => {
          const item = get(res, 'data[0]')
          if (item) {
            this.setData({
              fetchedCount: this.data.fetchedCount + fetchLimit
            })
            cb && cb(item)
          } else {
            'no item found'
          }
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
  fetchData: function({ typeid, cb }) {
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
          cb && cb()
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
  },
  fast: function() {
    this.setData({
      speed: 1500
    })
  },
  deleteItem: function(e) {
    const indexToDelete = e.currentTarget.dataset.val
    this.fetchNew((item) => {
      this.updateSentencesData(item, indexToDelete)
    })
  },
  initLoadingTip: function() {
    const tipsLength = loadingTips.length
    const tipIdx = Math.floor(Math.random() * tipsLength)
    const activeTip = loadingTips[tipIdx]
    this.setData({
      loadingTip: activeTip
    })
  },
  toggleHint: function() {
    const hintState = this.data.hinting
    this.setData({
      hinting: !hintState
    })
  },
  toggleAutoUpdate: function() {
    const newState = !this.data.autoUpdating
    this.setData({
      autoUpdating: newState
    })
    wx.showToast({
      title: newState ? '自动更换句子' : '手动更换句子',
      icon: 'none'
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
