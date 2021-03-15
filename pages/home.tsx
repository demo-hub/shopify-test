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
    api.get("/api/graphql/get-orders")
    .then((res) => {
      console.log(res)
      const element = document.createElement("a");
      const file = new Blob([res.toString()], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "orderItems.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    })
    .catch((res) => {
      console.log(res);
    });
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
