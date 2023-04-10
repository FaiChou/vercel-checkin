import { signV2ex } from './v2ex'
import { signAliyunpan } from './aliyunpan'

async function sayToBot(message) {
  const token = process.env.TG_BOT_TOKEN
  const chatID = process.env.TELEGRAM_CHAT_ID
  if (!token) return;
  if (!chatID) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${encodeURIComponent(message)}`
  try {
    const r = await fetch(url)
    return await r.json()
  } catch (error) {
    console.log(error)
  }
}

export default async function handler(request, response) {
  try {
    const message1 = await signV2ex()
    await sayToBot(message1)
    const message2 = await signAliyunpan()
    await sayToBot(message2)
    response.status(200).json({ message: '签到完成' })
  } catch (error) {
    await sayToBot(`Error: ${error.message}`)
    response.status(500).json({
      message: error.message
    })
  }
}
