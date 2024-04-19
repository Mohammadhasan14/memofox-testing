import React from 'react'
import {
  Card,
  Box, Page, Text, BlockStack, Button, Divider
} from "@shopify/polaris";
import Placeholder from '../components/Placeholder';
import { useLoaderData, Link, useNavigate } from "@remix-run/react";


const App = () => {
  const navigate = useNavigate();

  return (
    <Page fullWidth>

      <Box paddingBlockStart="200">

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px', }}>
          <Text variant="heading3xl" as="h2">
            Welcome to Memofox App
          </Text>
        </div>

        <Placeholder
          component={
            <Card>
              <BlockStack gap="200">
                <div style={{ marginBottom: '15px', }}>

                  <Text as="h3" variant="headingSm" fontWeight="medium">
                    Select any option from below to continue:{'             '}
                  </Text>
                </div>

                <Button variant="primary" onClick={() => navigate('/app/addNewSegment')}>Add New Segment {'->'}</Button>
                <Divider borderColor="transparent" />
                <Button variant="primary" onClick={() => navigate('/app/addNewMessage')}>Add New Message {'->'}</Button>
              </BlockStack>
            </Card>
          }
          marginTop='0'
          padding='30px'
          marginBottom='20px'
          itemsCentered={true}
        />

      </Box>
    </Page>



  )
}



export default App

