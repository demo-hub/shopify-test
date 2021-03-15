import { handleAuthCallback } from 'shopify-nextjs-toolbox'

const afterAuth = async(req, res, accessToken) => {
    // save accessToken with the shop
    console.log(accessToken)

    // redirect is handled by handleAuthCallback
};

export default handleAuthCallback(afterAuth);