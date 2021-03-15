import React, { useEffect, useState } from "react";
import { useApi } from 'shopify-nextjs-toolbox';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';


export default function Home() {
  const api = useApi();
  const [response, setResponse] = useState(false);
  const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

  // the session token is now available for use to make authenticated requests to the our server
  useEffect(() => {
    api.get("/api/verify-token")
    .then((res) => {
      setResponse(res.data);
    })
    .catch((res) => {
      console.log(res);
    });
  }, []);

  const exportItems = () => {
    console.log('Not implemented yet')
  };

  return (
    <Page>
          <Layout>
            <EmptyState
                heading="Export"
                action={{
                content: 'Export',
                onAction: () => exportItems() ,
                }}
                image={img}
            >
                <p>Export order items</p>
            </EmptyState>
          </Layout>
      </Page>
  )
}
