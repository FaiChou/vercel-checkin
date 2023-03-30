export async function signV2ex() {
  const cookie = process.env.V2EX_COOKIE;
  if (!cookie) {
    throw new Error("v2ex: 未设置 v2ex cookie")
  }
  const r = await fetch("https://www.v2ex.com/mission/daily", {
    headers: {
      Cookie: cookie
    }
  })
  if (r.status === 200) {
    const data = await r.text()
    if (data.indexOf('每日登录奖励已领取') >= 0) {
      return "v2ex: 今天已经签过了"
    } else {
      const redeemCode = data.match(/<input[^>]*\/mission\/daily\/redeem\?once=(\d+)[^>]*>/)
      if (Array.isArray(redeemCode) && redeemCode.length > 1) {
        return signV2exMission(redeemCode[1])
      }
      return "v2ex: 请登录"
    }
  }
  throw new Error("v2ex: 请求异常")
}

async function signV2exMission(code) {
  const cookie = process.env.V2EX_COOKIE;
  if (!cookie) {
    throw new Error("v2ex: 未设置 v2ex cookie")
  }
  const r = await fetch(`https://www.v2ex.com/mission/daily/redeem?once=${code}`, {
    headers: { Cookie: pcookie }
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
