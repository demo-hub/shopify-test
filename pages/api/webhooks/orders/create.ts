import { withSessionToken } from "shopify-nextjs-toolbox";

const handler = async (req, res) => {
  res.statusCode = 200
  res.json('orders webhook')
}

export default withSessionToken(handler);