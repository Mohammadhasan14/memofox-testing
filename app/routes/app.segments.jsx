import React, { useState, useEffect } from 'react';
import {
  IndexTable,
  Card,
  Text,
  Page,
  Button,
  ButtonGroup,
  Box, Divider
} from '@shopify/polaris';
import '../components/messageComponents/css/message.css';
import SegmentTable from '../components/segmentComponents/SegmentTable';
import DraftTable from '../components/segmentComponents/DraftTable';
import AllSegmentDataTable from '../components/segmentComponents/AllSegmentDataTable';
import { useNavigate } from '@remix-run/react';

export default function Messages() {
  const [selectedTab, setSelectedTab] = useState('All');
  const [fetchAgain, setFetchAgain] = useState(false)

  const [segmentCount, setSegmentCount] = useState('');
  const [draftSegmentsCount, setDraftSegmentsCount] = useState('');
  const [allSegmentsCount, setAllSegmentsCount] = useState('');
  const navigate = useNavigate()


  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  useEffect(() => {

    const getData = async () => {

      try {
        const response = await fetch(`/api/getSegmentsCounts`, {
          method: "GET",
        });
        if (response.ok) {
          const jsonData = await response.json();
          const { segmentTableCount, draftSegmentsTableCount, allSegmentsCount } = jsonData;
          // console.log('jsonData from segmentTableCount, draftSegmentsTableCount, allSegmentsCount',
          //   segmentTableCount, draftSegmentsTableCount, allSegmentsCount);
          setAllSegmentsCount(allSegmentsCount)
          setSegmentCount(segmentTableCount)
          setDraftSegmentsCount(draftSegmentsTableCount)
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
    All: { id: 'All', label: 'All', component: <AllSegmentDataTable setFetchAgain={setFetchAgain} />, count: allSegmentsCount },
    Messages: { id: 'Messages', label: 'Segments', component: <SegmentTable setFetchAgain={setFetchAgain} />, count: segmentCount },
    DraftMessages: { id: 'DraftMessages', label: 'Draft Segments', component: <DraftTable setFetchAgain={setFetchAgain} />, count: draftSegmentsCount }
  };

  return (
    <Page fullWidth>

      <Box paddingBlockStart="200">

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '30px' }}>
          <Text variant="headingLg" as="h5">
            Segments Table
          </Text>
          <ButtonGroup>
            <Button variant="primary" onClick={() => navigate('/app/addNewSegment')}>Add New Segment</Button>
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
