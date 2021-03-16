# Shopify test project

Shopify test project using next.js. Based on https://github.com/ctrlaltdylan/shopify-session-tokens-nextjs to have the cookieless shopify OAuth workflow.

## Dev stack

React with Next.js, TypeScript, Graphql API, Polaris

## Spec

Create shopify app based on Next.js with cookieless authentication using shopify session tokens.
The application should be able to create text “report” (text file for download) with all items from orders. Then exported orders should be labeled as exported and excluded from another export.

Write application in Shopify Polaris framework without using any ad-hoc styles

## Bonus spec

Create queue for processing orders automatically. Listen for new orders and send their items somewhere into special processing queue (for example xml or csv feed on some specific url where some “robot” could read data to process)

## Possible improvements/things to be done

- Improve export order items algorithm to be much faster.
- Use types on every api endpoint.

