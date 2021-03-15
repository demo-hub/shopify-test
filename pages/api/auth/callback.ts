import { handleAuthCallback } from 'shopify-nextjs-toolbox'
import mongodb from 'mongodb'
const { MongoClient } = mongodb

const client = new MongoClient(process.env.CONNECTION_STRING, {
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