import type { NextApiRequest, NextApiResponse } from 'next'
import { receiveWebhook } from '@shopify/koa-shopify-webhooks'

const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_PRIVATE_KEY });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req)
    console.log(webhook)
    res.statusCode = 200
    res.json('orders webhook')
}

export default handler;