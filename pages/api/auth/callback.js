import { handleAuthCallback } from 'shopify-nextjs-toolbox'
import mongodb from 'mongodb'
const { MongoClient } = mongodb

const client = new MongoClient('mongodb+srv://shopify_admin:Q7bLqx23MzV4H14T@cluster0.ietwu.mongodb.net/shopify?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const afterAuth = async(req, res, accessToken) => {
    // save accessToken
    if (!client.isConnected()) {
        await client.connect();
    }

    client.db('shopify').collection('users').updateOne({ name: 'user' }, { $set: { accessToken: accessToken.access_token } }, { upsert: true });

    // redirect is handled by handleAuthCallback
};

export default handleAuthCallback(afterAuth);