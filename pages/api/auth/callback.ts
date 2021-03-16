import { handleAuthCallback } from 'shopify-nextjs-toolbox'
import { DeliveryMethod, registerWebhook } from '@shopify/koa-shopify-webhooks'
import { ApiVersion } from '@shopify/koa-shopify-graphql-proxy';
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

    const registration = await registerWebhook({
        address: `${process.env.SHOPIFY_APP_URL}/api/webhooks/orders/create`,
        topic: 'ORDERS_CREATE',
        accessToken: accessToken.access_token,
        shop: accessToken.shop,
        apiVersion: ApiVersion.October20,
        deliveryMethod: DeliveryMethod.Http
      });

      if (registration.success) {
        console.log('Successfully registered webhook!');
      } else {
        console.log('Failed to register webhook', registration.result);
      }

    // redirect is handled by handleAuthCallback
};

export default handleAuthCallback(afterAuth);