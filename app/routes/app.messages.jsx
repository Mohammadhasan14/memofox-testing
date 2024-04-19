import React, { useState, useEffect } from 'react';
import {
  IndexTable,
  Card,
  Text,
  Page,
  Icon,
  Button,
  ButtonGroup,
  Box, Divider
} from '@shopify/polaris';
import '../components/messageComponents/css/message.css';
import DraftTable from "../components/messageComponents/DraftTable";
import MessageTable from "../components/messageComponents/MessageTable";
import AllMessageDataTable from '../components/messageComponents/AllMessageDataTable';
import { useNavigate } from '@remix-run/react';

export default function Messages() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [fetchAgain, setFetchAgain] = useState(false)

  const [messageCount, setMessageCount] = useState('');
  const [draftMessagesCount, setDraftMessagesCount] = useState('');
  const [allMessagesCount, setAllMessagesCount] = useState('');
  const navigate = useNavigate()


  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  useEffect(() => {

    const getData = async () => {

      try {
        const response = await fetch(`/api/getMessagesCounts`, {
          method: "GET",
        });
        if (response.ok) {
          const jsonData = await response.json();
          const { messageTableCount, draftMessagesTableCount, allMessagesCount } = jsonData;
          // console.log('jsonData from messageTableCount, draftMessagesTableCount, allMessagesCount',
          //   messageTableCount, draftMessagesTableCount, allMessagesCount);
          setAllMessagesCount(allMessagesCount)
          setMessageCount(messageTableCount)
          setDraftMessagesCount(draftMessagesTableCount)
        }
      } catch (error) {
        console.error('Error in getmessages:', error);
      }

    };

    getData();
  }, [fetchAgain]);

  useEffect(() => {
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
      tab.addEventListener('click', () => handleTabClick(tab.id));
    });
  }, []);

  const tabs = {
    All: { id: 'All', label: 'All', component: <AllMessageDataTable setFetchAgain={setFetchAgain} />, count: allMessagesCount },
    Messages: { id: 'Messages', label: 'Messages', component: <MessageTable setFetchAgain={setFetchAgain} />, count: messageCount },
    DraftMessages: { id: 'DraftMessages', label: 'Draft Messages', component: <DraftTable setFetchAgain={setFetchAgain} />, count: draftMessagesCount }
  };

  return (
    <Page fullWidth>

      <Box paddingBlockStart="200">

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '30px' }}>
          <Text variant="headingLg" as="h5">
            Messages Table
          </Text>
          <ButtonGroup>
            <Button variant="primary" onClick={() => navigate('/app/addNewMessage')}>Add New Message</Button>
          </ButtonGroup>
        </div>
        <Card padding={{ xs: '80', sm: '95' }}>
          <div style={{ marginTop: '13px' }}>
            <div className='divider-top'>
              <div className="tab-list">
                {Object.values(tabs).map(tab => (
                  <button
                    key={tab.id}
                    className={`tab ${selectedTab === tab.id ? 'on' : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {`${tab.label} (${tab.count})`}
                  </button>
                ))}
              </div>
            </div>
            <div className='divider'>
              <Divider />
            </div>

            <div className="section-list">
              <section
                key={tabs[selectedTab]?.id}
                data-tab={tabs[selectedTab]?.id}
                className={`section ${selectedTab === tabs[selectedTab]?.id ? 'on' : ''}`}
              >
                {tabs[selectedTab]?.component}
              </section>
            </div>
          </div>
        </Card>

      </Box>
    </Page>
  );
}
