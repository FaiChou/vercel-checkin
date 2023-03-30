const UA = "AliApp(AYSD/4.2.2) com.alicloud.smartdrive/4.2.2 Version/16.3.1 Channel/201200 Language/en-CN /iOS Mobile/iPhone14,2"
const COMMON_HEADER = {
  'User-Agent': UA,
  'Content-Type': 'application/json',
  Referer: 'https://aliyundrive.com/'
}

async function getAliyunpanToken() {
  const refreshToken = process.env.ALIYUNPAN_REFRESH_TOKEN
  if (!refreshToken) {
    throw new Error("阿里云盘: 未设置 REFRESH TOKEN")
  }
  const url = "https://auth.aliyundrive.com/v2/account/token"
  const body = {
    grant_type: 'refresh_token',
    'app_id': 'pJZInNHN2dZWk8qg',
    refresh_token: refreshToken
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

export async function signAliyunpan() {
  const token = await getAliyunpanToken()
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

