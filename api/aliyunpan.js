const UA = "AliApp(AYSD/4.2.2) com.alicloud.smartdrive/4.2.2 Version/16.3.1 Channel/201200 Language/en-CN /iOS Mobile/iPhone14,2"
const COMMON_HEADER = {
  'User-Agent': UA,
  'Content-Type': 'application/json',
  Referer: 'https://aliyundrive.com/'
}

async function getToken() {
  const url = "https://auth.aliyundrive.com/v2/account/token"
  const body = {
    grant_type: 'refresh_token',
    'app_id': 'pJZInNHN2dZWk8qg',
    refresh_token: process.env.ALIYUNPAN_REFRESH_TOKEN
  }
  const r = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: COMMON_HEADER
  })
  if (r.status === 200) {
    const data = await r.json()
    return data.access_token
  }
  throw new Error("阿里云盘: 获取 TOKEN 失败")
}

async function sign() {
  const token = await getToken()
  const url = "https://member.aliyundrive.com/v1/activity/sign_in_list"
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      ...COMMON_HEADER
    },
    body: JSON.stringify({})
  })
  if (r.status === 200) {
    const data = await r.json()
    if (!data.success) {
      return "阿里云盘: 签到失败"
    }
    return "阿里云盘: 签到成功"
  }
  throw new Error("阿里云盘: 签到失败")
}

async function sayToBot(message) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`
  try {
    const r = await fetch(url)
    return await r.json()
  } catch (error) {
    throw new Error("TG通知失败")
  }
}

export default async function handler(request, response) {
  try {
    const message = await sign()
    await sayToBot(message)
    response.status(200).json({ message })
  } catch (error) {
    response.status(500).json({
      message: error.message
    })
  }
}
