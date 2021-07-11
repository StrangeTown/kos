// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const favouritesCollection = db.collection('favourites')

  const userOpenid = wxContext.OPENID
  const sentenceid = event.sentenceid

  const existedResult = await favouritesCollection.where({
    open_id: userOpenid,
    sentence_id: sentenceid
  }).get()
  const data = existedResult.data || []
  const hasDataAlready = !!data.length

  if (hasDataAlready) {
    return {
      success: false,
      msg: '数据已经存在'
    }
  }

  const result = await favouritesCollection.add({
    data: {
      open_id: userOpenid,
      sentence_id: sentenceid
    }
  })
  if (result.errMsg === 'collection.add:ok') {
    return {
      success: true,
      msg: '添加成功'
    }
  } else {
    return {
      success: false,
      msg: '出错了'
    }
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}
