// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const favouritesCollection = db.collection('favourites')
  const userOpenid = wxContext.OPENID

  const result = await favouritesCollection.aggregate()
    .match({
      open_id: userOpenid
    })
    .lookup({
      from: 'sentences',
      localField: 'sentence_id',
      foreignField: '_id',
      as: 'item'
    })
    .end()
  return result
}
