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
import convertSegmentQuery from '../convertSegmentQuery';
import { showToast } from '../Toast';

export default function DraftTable({ setFetchAgain }) {
    const [isDeleting, setDeleting] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [segmentDraftData, setSegmentDraftData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();



    const getDraftData = async () => {
        try {
            const response = await fetch(`/api/getSegments/${'segmentDraft'}/${currentPage}/${5}`, {
                method: "GET",
            });

            if (response.ok) {
                const jsonData = await response.json();
                const { segmentData, hasNextPage, hasPrevPage, totalItems, limit } = jsonData;
                // console.log('jsonData from segmentDataDraft', segmentData);
                setSegmentDraftData(segmentData);
                setHasNextPage(hasNextPage)
                setHasPrevPage(hasPrevPage)
                setTotalPages(Math.ceil(totalItems / limit));
            }
        } catch (error) {
            console.error('Error in getDiscountData:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDraftData();
    }, [currentPage]);

    const handleEditDiscount = (id) => {
        const dataForUpdate = segmentDraftData.filter(dD => dD._id === id)
        // console.log('dataForUpdate', dataForUpdate)
        navigate('/app/addNewSegment', { state: { data: dataForUpdate } })
    };

    const handleDeleteDraftSegment = async () => {
        // console.log(`Deleting draft with ID ${deleteID}`);
        try {
            setDeleting(false)

            const response = await fetch('/api/deleteDraftSegment', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ segmentID: deleteID })
            })

            if (response.status >= 200 && response.status <= 299) {
                const jsonData = await response.json()
                // console.log('jsonData for delete', jsonData);
                showToast('Draft segment deleted successfully!')
                setFetchAgain(prev => !prev)
                getDraftData()
                const updatedData = segmentDraftData.filter(dD => dD._id !== deleteID)
                setSegmentDraftData(updatedData)
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


    const rowMarkup = segmentDraftData?.map(
        (data, i) => (
            <IndexTable.Row
                id={data._id}
                key={data._id}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {data?.segmentDraft?.segmentName}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        <Code>
                            {convertSegmentQuery(data?.segmentDraft?.segmentCriteria)}
                        </Code>
                    </div>
                </IndexTable.Cell>

                <IndexTable.Cell>
                    <ButtonGroup>
                        <Button
                            icon={<Icon source={EditIcon} />}
                            onClick={() => handleEditDiscount(data._id)}

                        />
                        <Button
                            icon={<Icon source={DeleteIcon} />}
                            onClick={() => toggleDeleteModal(data._id)}
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
                        itemCount={segmentDraftData.length}
                        headings={[
                            { title: 'SegmentName' },
                            { title: 'SegmentQuery' },
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
                handleDelete={handleDeleteDraftSegment}
            />
        </ >

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