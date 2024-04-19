import React, { useCallback, useEffect, useState } from 'react';
import {
  IndexTable,
  Card,
  Text,
  Page,
  Icon,
  Button,
  ButtonGroup,
  Box, SkeletonBodyText
} from '@shopify/polaris';
import { useNavigate } from "@remix-run/react";
import DeleteModal from '../DeleteModal';
import { DeleteIcon } from '@shopify/polaris-icons';
import { showToast } from '../Toast';

export default function MessageTable({ setFetchAgain }) {
  const [messages, setMessages] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isLoading, setLoading] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();


  const getData = async () => {
    try {
      const response = await fetch(`/api/getMessages/${'messageData'}/${currentPage}/${5}`, {
        method: "GET",
      });

      if (response.ok) {
        const jsonData = await response.json();
        const { messageData, hasNextPage, hasPrevPage, totalItems, limit } = jsonData;
        // console.log('jsonData from messageData', messageData);
        setMessages(messageData);
        setHasNextPage(hasNextPage)
        setHasPrevPage(hasPrevPage)
        setTotalPages(Math.ceil(totalItems / limit));

      }
    } catch (error) {
      console.error('Error in getmessages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true)
    getData();
  }, [currentPage]);


  const rowMarkup = messages?.map(
    ({
      _id,
      campaignName,
      previewSubject,
      previewText,
      startDate,
      startTime,
      startAMorPM,
      endDate,
      endTime,
      endAMorPM,
      storeURL,
      selectedImage
    }, i) => (
      <IndexTable.Row
        id={_id}
        key={_id}
      >
        <IndexTable.Cell>
          <div style={{ whiteSpace: 'pre-wrap', width: '350px', fontWeight: '700' }}>
            {campaignName}
          </div>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>
              {selectedImage ? <img
                className='message-image'
                src={`/uploads/${storeURL}/${selectedImage}`}
                alt="Message Image"
                style={{
                  height: '45px', width: '45px', objectFit: 'cover',
                  borderRadius: '10%', marginRight: '10px'
                }}
              /> :
                <img
                  style={{
                    height: '45px', width: '45px', objectFit: 'cover',
                    borderRadius: '10%', marginRight: '10px', visibility: 'hidden'
                  }}
                />
              }
            </span>
            <div style={{ whiteSpace: 'pre-wrap', maxWidth: '300px' }}>
              {previewSubject}
            </div>
          </div>
        </IndexTable.Cell>
        {/* <IndexTable.Cell>
          <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: previewText }}>
          </div>
        </IndexTable.Cell> */}
        <IndexTable.Cell>{startDate?.split('T')?.[0] ?? '--'}</IndexTable.Cell>
        <IndexTable.Cell>{startTime ? startTime : '--'}</IndexTable.Cell>
        <IndexTable.Cell>{endDate?.split('T')?.[0] ?? '--'}</IndexTable.Cell>
        <IndexTable.Cell>{endTime ? endTime : '--'}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              icon={<Icon source={DeleteIcon} />}
              onClick={() => toggleDeleteModal(_id)}
              tone='critical'
            />
          </ButtonGroup>
        </IndexTable.Cell>


      </IndexTable.Row>
    )
  );

  const toggleDeleteModal = useCallback((id) => {
    setDeleteID(id)
    setDeleting((isDeleting) => !isDeleting)
  }, []);

  const handleDeleteSegment = async () => {
    // console.log(`Deleting message with ID ${deleteID}`);
    try {
      setDeleting(false)

      const response = await fetch('/api/deleteMessage', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageID: deleteID })
      })

      if (response.status >= 200 && response.status <= 299) {
        const jsonData = await response.json()
        // console.log('jsonData for delete', jsonData);
        showToast('Message deleted successfully!')
        setFetchAgain(prev => !prev)
        getData();
        const updatedData = messages.filter(dD => dD._id !== deleteID)
        setMessages(updatedData)
        setDeleteID('')
      }
    } catch (error) {
      console.log('error', error);
    }

  };

  return (
    <>
      <div className='table' style={{ marginBottom: '26px' }}>
        {isLoading ?
          <Box paddingBlockStart="200">
            <SkeletonBodyText
              lines={6}
            />
          </Box>
          :

          <IndexTable
            itemCount={messages?.length}
            headings={[
              { title: 'Campaign Name' },
              { title: 'Preview Subject' },
              // { title: 'Preview Text' },
              { title: 'Start Date' },
              { title: 'Start Time' },
              { title: 'End Date' },
              { title: 'End Time' },
              { title: 'Action' }

            ]}
            selectable={false}
            pagination={{
              hasNext: hasNextPage,
              hasPrevious: hasPrevPage,
              onNext: () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages)),
              onPrevious: () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1)),
            }}
          >
            {rowMarkup}
          </IndexTable>
        }
      </div>
      <DeleteModal
        isDeleting={isDeleting}
        setDeleting={setDeleting}
        toggleDeleteModal={toggleDeleteModal}
        handleDelete={handleDeleteSegment}
      />
    </>


  )
}


function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}