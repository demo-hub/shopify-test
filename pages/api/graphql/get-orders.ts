import { withSessionToken } from "shopify-nextjs-toolbox";
import mongodb from 'mongodb'
import { OrdersQuery } from "../models/ordersQuery";
// import * as fetch from 'node-fetch'
const { MongoClient } = mongodb

const client = new MongoClient(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const handler = async(req, res) => {

    if (!client.isConnected()) {
        await client.connect();
    }

    const accessToken = client.db('shopify').collection('users').findOne({ name: 'user' }).accessToken

    // TODO: pagination

    fetch(`https://test-project-next-js.myshopify.com/admin/api/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({
            query: `query getOrders {
                                            orders(first: 10, query: "NOT tag:exported") {
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
    }).then((response: any) => {
        const result = <OrdersQuery> response;

        res.statusCode = 200
        res.json(result)
    });
}

export default withSessionToken(handler);