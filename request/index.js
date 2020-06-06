
// const baseUrl = 'https://dev.eleven.wang/read/api/wx/kos/'
const baseUrl = 'https://read.eleven.wang/api/wx/kos/'

const loginUrl = `${baseUrl}login`
const scentencesUrl = `${baseUrl}/sentence`


const urls = {
  loginUrl,
  scentencesUrl
}

const getToken = () => {
  return wx.getStorageSync('login_token')
}

const doRequest = config => {
  console.log(`request: ${config.url}`)
  const token = getToken()
  if (token) {
    config = {
      ...config,
      header: {
        'Authorization': token
      }
    }
  }
  wx.request(config)
}

export default {
  urls,
  doRequest
}
