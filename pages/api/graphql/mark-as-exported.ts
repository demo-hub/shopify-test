import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionToken } from "shopify-nextjs-toolbox";
import mongodb from 'mongodb'
import { OrdersQuery } from "../models/ordersQuery";
import axios from 'axios';
import { Order } from '../models/order';
const { MongoClient } = mongodb

const client = new MongoClient(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    const orders: OrdersQuery = <OrdersQuery> req.body;

    if (!client.isConnected()) {
        await client.connect();
    }

    const accessToken = client.db('shopify').collection('users').findOne({ name: 'user' }).accessToken

    orders.data.orders.edges.forEach(async (value) => {
        await axios.request({
            method: 'POST',
            url: `https://test-project-next-js.myshopify.com/admin/api/graphql.json`,
            headers: {
                'Content-Type': 'application/json',
                "X-Shopify-Access-Token": accessToken,
            },
            data: JSON.stringify({
                query: `mutation tagsAdd($id: ID!, $tags: [String!]!) {
                    tagsAdd(id: $id, tags: $tags) {
                      node {
                        id
                      }
                      userErrors {
                        field
                        message
                      }
                    }
                  }`,
                variables: { id: (value.node as Order).id, tags: ['exported'] }
            })
        });
    })

    res.statusCode = 200
    res.json('Orders marked')
}

export default handler;