async function sign() {
  const r = await fetch("https://www.v2ex.com/mission/daily", {
    headers: {
      Cookie: process.env.V2EX_COOKIE
    }
  })
  if (r.status === 200) {
    const data = await r.text()
    if (data.indexOf('每日登录奖励已领取') >= 0) {
      return "v2ex: 今天已经签过了"
    } else {
      const redeemCode = data.match(/<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/)
      if (Array.isArray(redeemCode) && redeemCode.length > 1) {
        return signMission(redeemCode[1])
      }
      return "v2ex: 请登录"
    }
  }
  throw new Error("v2ex: 请求异常")
}

async function signMission(code) {
  const r = await fetch(`https://www.v2ex.com/mission/daily/redeem?once=${code}`, {
    headers: { Cookie: process.env.V2EX_COOKIE }
  })
  if (r.status === 200) {
    const data = await r.text()
    console.log(data)
    if (data.indexOf('每日登录奖励已领取') >= 0) {
      return "v2ex: 签到成功"
    } else {
      return "v2ex: 签到失败"
    }
  }
  throw new Error("v2ex: 请求签到接口失败")
}

async function sayToBot(message) {
  const url = `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`
  try {
    const r = await fetch(url)
    return await r.json()
  } catch (error) {
    console.log(error)
    // throw new Error("TG通知失败")
  }
}

export default async function handler(request, response) {
  try {
    const message = await sign()
    await sayToBot(message)
    response.status(200).json({ message })
  } catch (error) {
    await sayToBot(error.message)
    response.status(500).json({
      message: error.message
    })
  }
}
