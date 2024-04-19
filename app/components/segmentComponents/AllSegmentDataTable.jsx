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
import convertSegmentQuery from '../convertSegmentQuery';

export default function AllSegmentDataTable({ setFetchAgain }) {
    const [segments, setSegments] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [deleteID, setDeleteID] = useState({
        dbID: '',
        segmentID: ''
    })
    const [deleteDataType, setDeleteDataType] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();


    const getData = async () => {
        setSegments([])
        try {
            const response = await fetch(`/api/getSegments/${'segmentData'}/${currentPage}/${3}`, {
                method: "GET",
            });

            const responseDraft = await fetch(`/api/getSegments/${'segmentDraft'}/${currentPage}/${3}`, {
                method: "GET",
            });

            if (responseDraft.ok) {
                const jsonData = await responseDraft.json();
                const { segmentData } = jsonData;
                // console.log('jsonData from segmentData', segmentData);
                setSegments(segmentData);
            }

            if (response.ok) {
                const jsonData = await response.json();
                const { segmentData, hasNextPage, hasPrevPage, totalItems, limit } = jsonData;
                // console.log('jsonData from segmentData', segmentData);
                setSegments((prev) => {
                    return [...prev, ...segmentData]
                });
                setHasNextPage(hasNextPage)
                setHasPrevPage(hasPrevPage)
                setTotalPages(Math.ceil(totalItems / limit));
            }
        } catch (error) {
            console.error('Error in getSegments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true)
        getData();
    }, [currentPage]);

    const sortedData = segments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const rowMarkup = sortedData?.map(
        ({
            _id,
            id,
            name,
            query,
            segmentDraft,
            type,
            createdAt
            ,
        }, i) => {
            // console.log('createdAt', createdAt);
            return (
                <IndexTable.Row
                    id={_id}
                    key={_id}
                >
                    <IndexTable.Cell>{name || segmentDraft?.segmentName}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', lineHeight: 1.5 }}>
                            <Code>
                                {query || convertSegmentQuery(segmentDraft?.segmentCriteria)}
                            </Code>
                        </div>
                    </IndexTable.Cell>

                    <IndexTable.Cell>
                        <ButtonGroup>
                            <Button
                                icon={<Icon source={DeleteIcon} />}
                                onClick={() => {
                                    toggleDeleteModal(_id, id)
                                    setDeleteDataType(type)
                                }}
                                tone='critical'
                            />
                        </ButtonGroup>
                    </IndexTable.Cell>
                </IndexTable.Row>
            )
        }
    );

    const toggleDeleteModal = useCallback((dbID, segmentID) => {
        setDeleteID({
            dbID,
            segmentID
        })
        setDeleting((isDeleting) => !isDeleting)
    }, []);

    const handleDeleteSegment = async () => {
        // console.log(`Deleting segment with ID ${deleteID}`);
        try {
            setDeleting(false)

            let response
            if (deleteDataType === 'draftSegment') {
                response = await fetch('/api/deleteDraftSegment', {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ segmentID: deleteID.dbID })
                })
            } else {
                response = await fetch('/api/deleteSegment', {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ segmentDBID: deleteID.dbID, segmentID: deleteID.segmentID })
                })
            }


            if (response.status >= 200 && response.status <= 299) {
                const jsonData = await response.json()
                // console.log('jsonData for delete', jsonData);
                setFetchAgain(prev => !prev)
                getData()
                showToast('Segment deleted successfully!')
                const updatedData = segments.filter(dD => dD._id !== deleteID.dbID)
                setSegments(updatedData)
                setDeleteID({
                    dbID: '',
                    segmentID: ''
                })
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
                        itemCount={segments.length}
                        headings={[
                            { title: 'Segment Name' },
                            { title: 'Segment Query' },
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