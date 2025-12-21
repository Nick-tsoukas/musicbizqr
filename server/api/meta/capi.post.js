// server/api/meta/capi.post.js
import crypto from 'node:crypto'

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export default defineEventHandler(async (event) => {
  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  const testCode = process.env.META_CAPI_TEST_CODE // optional

  if (!pixelId || !accessToken) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Meta CAPI not configured. Set META_PIXEL_ID and META_CAPI_ACCESS_TOKEN in server env.',
    })
  }

  const body = await readBody(event)

  const {
    event_name, // e.g. 'CompleteRegistration', 'Lead'
    event_id, // required for dedupe
    event_source_url, // recommended
    email, // optional but recommended for match quality
    custom_data = {}, // optional
  } = body || {}

  if (!event_name || !event_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: event_name, event_id',
    })
  }

  // IP + UA for match quality
  const headers = getRequestHeaders(event)
  const userAgent = headers['user-agent'] || ''
  const ip =
    (headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    event.node.req.socket?.remoteAddress ||
    ''

  const user_data = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  }

  if (email) {
    const normalized = String(email).trim().toLowerCase()
    user_data.em = sha256(normalized)
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url: event_source_url || '',
        action_source: 'website',
        user_data,
        custom_data,
      },
    ],
    ...(testCode ? { test_event_code: testCode } : {}),
  }

  const url = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`

  const res = await $fetch(url, {
    method: 'POST',
    body: payload,
  })

  return { ok: true, meta: res }
})
