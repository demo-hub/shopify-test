import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionToken } from "shopify-nextjs-toolbox";
import mongodb from 'mongodb'
import { OrdersQuery } from "../models/ordersQuery";
import axios from 'axios';
import { Order } from '../models/order';
import { LineItem } from '../models/lineItem';
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

    let lineItemsCursor = '';

    while (hasNextPage) {
        const response = await getOrders(accessToken, cursor, lineItemsCursor);

        result.push(response.data);

        hasNextPage = response.data.data.orders.pageInfo.hasNextPage;

        response.data.data.orders.edges.forEach(async (value, index) => {
            if ((value.node as Order).lineItems.pageInfo.hasNextPage) {
                lineItemsCursor = (value.node as Order).lineItems.edges[(value.node as Order).lineItems.edges.length - 1].cursor;
                const lineItemsResponse = await getOrders(accessToken, cursor, lineItemsCursor);
                (value.node as Order).lineItems.edges.push.apply((value.node as Order).lineItems.edges, (lineItemsResponse.data.data.orders.edges[index].node as Order).lineItems);
            }
        })

        if (hasNextPage) {
            cursor = response.data.data.orders.edges[response.data.data.orders.edges.length - 1].cursor;
        }
    }

    res.statusCode = 200
    res.json(result)
}

const getOrders = async (accessToken: string, cursor?: string, lineItemsCursor?: string) => {
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
                                                        lineItems(first: 10${lineItemsCursor ? ', after: ' + lineItemsCursor : ''}) {
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