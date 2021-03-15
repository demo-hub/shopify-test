import React from 'react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import store from 'store-js';

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

class Index extends React.Component {
  state = { open: false };
  render() {
    return (
      <Page>
        <TitleBar
          title="Sample App"
          primaryAction={{
            content: 'Select products',
            onAction: () => this.setState({ open: true }),
          }}
        />
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
          <Layout>
            <EmptyState
                heading="Export"
                action={{
                content: 'Export',
                onAction: () => this.exportItems() ,
                }}
                image={img}
            >
                <p>Export order items</p>
            </EmptyState>
          </Layout>
      </Page>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    console.log(idsFromResources);
  }
  exportItems = () => {
    fetch(`https://test-project-next-js.myshopify.com/admin/api/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": store.get('accessToken'),
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
    })
  };
}

export default Index;