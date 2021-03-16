import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionToken } from "shopify-nextjs-toolbox";
import mongodb from 'mongodb'
import { OrdersQuery } from "../models/ordersQuery";
import axios from 'axios';
const { MongoClient } = mongodb

const client = new MongoClient(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    if (!client.isConnected()) {
        await client.connect();
    }

    const accessToken = client.db('shopify').collection('users').findOne({ name: 'user' }).accessToken

    // pagination

    let hasNextPage = true;

    let result: OrdersQuery[] = [];

    let cursor = '';

    while (hasNextPage) {
        const response = await getOrders(accessToken, cursor);

        result.push(response.data);

        hasNextPage = response.data.data.orders.pageInfo.hasNextPage;

        if (hasNextPage) {
            cursor = response.data.data.orders.edges[response.data.data.orders.edges.length - 1].cursor;
        }
    }

    res.statusCode = 200
    res.json(result)
}

// TODO: pagination of the line items

const getOrders = async (accessToken: string, cursor?: string) => {
    return await axios.request<OrdersQuery>({
        method: 'POST',
        url: `https://test-project-next-js.myshopify.com/admin/api/graphql.json`,
        headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
        },
        data: JSON.stringify({
            query: `query getOrders {
                                            orders(first: 10, query: "NOT tag:exported"${cursor ? ', after: ' + cursor : ''}) {
                                                pageInfo {
                                                    hasNextPage
                                                }
                                                edges {
                                                    cursor
                                                    node {
                                                        id
                                                        tags
                                                        lineItems(first: 10) {
                                                            pageInfo {
                                                                hasNextPage
                                                            }
                                                            edges {
                                                                cursor
                                                                node {
                                                                name
                                                                }
                                                            }
                                                        }
                                                    }
                                                    }
                                                }
                                            }`
        })
    });
}

export default withSessionToken(handler);