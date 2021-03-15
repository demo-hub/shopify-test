import { withSessionToken } from "shopify-nextjs-toolbox";
import mongodb from 'mongodb'
const { MongoClient } = mongodb

const client = new MongoClient('mongodb+srv://shopify_admin:Q7bLqx23MzV4H14T@cluster0.ietwu.mongodb.net/shopify?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const handler = async(req, res) => {

    if (!client.isConnected()) {
        await client.connect();
    }

    const accessToken = client.db('shopify').collection('users').findOne({ name: 'user' }).accessToken

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
    }).then(response => {
        console.log(response.json())

        res.statusCode = 200
        res.json(response)
    });
}

export default withSessionToken(handler);