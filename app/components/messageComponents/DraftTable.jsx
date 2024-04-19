import React, { useCallback, useEffect, useState } from 'react'
import {
  IndexTable,
  Card,
  Text,
  Button,
  ButtonGroup,
  Box,
  Icon, SkeletonBodyText, Page
} from '@shopify/polaris';
import { DeleteIcon, EditIcon } from '@shopify/polaris-icons';
import DeleteModal from '../DeleteModal';
import { useNavigate } from "@remix-run/react";
import { showToast } from '../Toast';

export default function DraftTable({ setFetchAgain }) {
  const [isDeleting, setDeleting] = useState(false)
  const [deleteID, setDeleteID] = useState(null)
  const [messageDraftData, setMessageDraftData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();


  const getDraftData = async () => {
    try {
      const response = await fetch(`/api/getMessages/${'messageDraft'}/${currentPage}/${5}`, {
        method: "GET",
      });

      if (response.ok) {
        const jsonData = await response.json();
        const { messageData, hasNextPage, hasPrevPage, totalItems, limit } = jsonData;
        // console.log('jsonData from messageDataDraft', messageData);
        setMessageDraftData(messageData);
        setHasNextPage(hasNextPage)
        setHasPrevPage(hasPrevPage)
        setTotalPages(Math.ceil(totalItems / limit));
      }
    } catch (error) {
      console.error('Error in messageDataDraft:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDraftData();
  }, [currentPage]);

  const handleEditDiscount = (id) => {
    const dataForUpdate = messageDraftData.filter(dD => dD._id === id)
    // console.log('dataForUpdate', dataForUpdate)
    navigate('/app/addNewMessage', { state: { data: dataForUpdate } })
  };

  const handleDeleteDraftMessage = async () => {
    // console.log(`Deleting draft with ID ${deleteID}`);
    try {
      setDeleting(false)

      const response = await fetch('/api/deleteDraftMessage', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageID: deleteID })
      })

      if (response.status >= 200 && response.status <= 299) {
        const jsonData = await response.json()
        // console.log('jsonData for delete', jsonData);
        showToast('Draft message deleted successfully!')
        setFetchAgain(prev => !prev)
        getDraftData()
        const updatedData = messageDraftData.filter(dD => dD._id !== deleteID)
        setMessageDraftData(updatedData)
        setDeleteID(null)
      }
    } catch (error) {
      console.log('error', error);
    }

  };

  const toggleDeleteModal = useCallback((id) => {
    setDeleteID(id)
    setDeleting((isDeleting) => !isDeleting)
  }, []);


  const rowMarkup = messageDraftData?.map(
    ({ _id,
      campaignName,
      storeURL,
      selectedImage,
      previewSubject }, i) => (
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

        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              icon={<Icon source={EditIcon} />}
              onClick={() => handleEditDiscount(_id)}

            />
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
            itemCount={messageDraftData.length}
            headings={[
              { title: 'Campaign Name' },
              { title: 'Preview Subject' },
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
        handleDelete={handleDeleteDraftMessage}
      />
    </>


  );
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