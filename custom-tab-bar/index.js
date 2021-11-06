Component({
  data: {
    selected: -1,
    color: "#7A7E83",
    selectedColor: "#fff",
    list: [
      // {
      //   "pagePath": "/pages/explore/explore",
      //   "iconPath": "/assets/images/tab/home.png",
      //   "selectedIconPath": "/assets/images/tab/home.png",
      //   "text": "首页",
      //   "cls": "home",
      // }, 
      {
        "pagePath": "/pages/scene/scene",
        "iconPath": "/assets/images/tab/home.png",
        "selectedIconPath": "/assets/images/tab/home.png",
        "text": "Home",
        "cls": "type",
      },
      // {
      //   "pagePath": "/pages/challenge/index",
      //   "iconPath": "/assets/images/tab/trophy.png",
      //   "selectedIconPath": "/assets/images/tab/trophy.png",
      //   "text": "挑战",
      //   "cls": "challenge",
      // },
      {
        "pagePath": "/pages/me/index",
        "iconPath": "/assets/images/tab/me.png",
        "selectedIconPath": "/assets/images/tab/me.png",
        "text": "Me",
        "cls": "me",
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    }
  }
})
