import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import MessageCard from '../message/MessageCard';
import axios from 'axios'
import MessageDetailsCard from '../message/MessageDetailsCard';

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    // const [messages, setMessages] = useState([{
    //     "_id": "661929bc73327d22865ebd9f",
    //     "storeURL": "rocco-scavetta.myshopify.com",
    //     "selectedImage": "1712925115926.Frame 1547753406.png",
    //     "campaignName": "que sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel ",
    //     "previewSubject": "pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ",
    //     "selectedTags": [
    //         "Discount",
    //         "Announcement"
    //     ],
    //     "previewText": "<p>Risus quis varius quam quisque. Orci nulla pellentesque dignissim enim. Nunc faucibus a pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Pulvinar elementum integer enim neque volutpat ac. Vitae tortor condimentum lacinia quis vel eros donec ac. Blandit cursus risus at ultrices mi tempus imperdiet.<p>Risus quis varius quam quisque. Orci nulla pellentesque dignissim enim. Nunc faucibus a pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Pulvinar elementum integer enim neque volutpat ac. Vitae tortor condimentum lacinia quis vel eros donec ac. Blandit cursus risus at ultrices mi tempus imperdiet.</p></p>",
    //     "ctaType": "External link",
    //     "ctaLabel": "Shop now",
    //     "externalURL": "https://www.wikipedia.org/",
    //     "assignedSegments": [
    //         "gid://shopify/Segment/476886171799",
    //         "gid://shopify/Segment/476885581975"
    //     ],
    //     "startDate": null,
    //     "startTime": "",
    //     "startAMorPM": "AM",
    //     "endDate": null,
    //     "endTime": "",
    //     "endAMorPM": "AM",
    //     "createdAt": "2024-04-12T12:31:56.137Z",
    //     "__v": 0
    // },
    // {
    //     "_id": "661929bc73327d22865ebd9f",
    //     "storeURL": "rocco-scavetta.myshopify.com",
    //     "selectedImage": "1712925115926.Frame 1547753406.png",
    //     "campaignName": "que sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel ",
    //     "previewSubject": "pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ",
    //     "selectedTags": [
    //         "Discount",
    //         "Announcement"
    //     ],
    //     "previewText": "<p>Risus quis varius quam quisque. Orci nulla pellentesque dignissim enim. Nunc faucibus a pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Pulvinar elementum integer enim neque volutpat ac. Vitae tortor condimentum lacinia quis vel eros donec ac. Blandit cursus risus at ultrices mi tempus imperdiet.</p>",
    //     "ctaType": "External link",
    //     "ctaLabel": "Shop now",
    //     "externalURL": "https://www.wikipedia.org/",
    //     "assignedSegments": [
    //         "gid://shopify/Segment/476886171799",
    //         "gid://shopify/Segment/476885581975"
    //     ],
    //     "startDate": null,
    //     "startTime": "",
    //     "startAMorPM": "AM",
    //     "endDate": null,
    //     "endTime": "",
    //     "endAMorPM": "AM",
    //     "createdAt": "2024-04-12T12:31:56.137Z",
    //     "__v": 0
    // },
    // {
    //     "_id": "661929bc73327d22865ebd9f",
    //     "storeURL": "rocco-scavetta.myshopify.com",
    //     "selectedImage": "1712925115926.Frame 1547753406.png",
    //     "campaignName": "que sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel ",
    //     "previewSubject": "pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ",
    //     "selectedTags": [
    //         "Discount",
    //         "Announcement"
    //     ],
    //     "previewText": "<p>Risus quis varius quam quisque. Orci nulla pellentesque dignissim enim. Nunc faucibus a pellentesque sit amet. Nisl condimentum id venenatis a condimentum. Condimentum lacinia quis vel eros donec ac odio. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Pulvinar elementum integer enim neque volutpat ac. Vitae tortor condimentum lacinia quis vel eros donec ac. Blandit cursus risus at ultrices mi tempus imperdiet.</p>",
    //     "ctaType": "External link",
    //     "ctaLabel": "Shop now",
    //     "externalURL": "https://www.wikipedia.org/",
    //     "assignedSegments": [
    //         "gid://shopify/Segment/476886171799",
    //         "gid://shopify/Segment/476885581975"
    //     ],
    //     "startDate": null,
    //     "startTime": "",
    //     "startAMorPM": "AM",
    //     "endDate": null,
    //     "endTime": "",
    //     "endAMorPM": "AM",
    //     "createdAt": "2024-04-12T12:31:56.137Z",
    //     "__v": 0
    // }])
    const [messages, setMessages] = useState([])
    const [selectedMessages, setSelectedMessage] = useState(null)

    useEffect(() => {
        console.log('hit .............nnnnnnnnnnn');
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerID = ShopifyAnalytics.meta.page.customerId;
                if (!customerID) return; 
    
                console.log('Fetching data...');
    
                const response = await fetch(
                    `https://${location.host}/apps/getmsg/api/getStoreMessages/${customerID}/${location.host}`,
                    {
                        method: "GET",
                    }
                );
    
                const { data } = await response.json();
                console.log('Response data:', data);
                setMessages(data);
                
                const openSidebarButton = document.querySelector('.openSidebarButton');
                if (openSidebarButton) {
                    openSidebarButton.style.display = 'block';
                }
            } catch (error) {
                console.error('Error on response:', error);
            }
        };
    
        fetchData();
    }, []);
    

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleOpenMessage = (data) => {
        console.log('open message clicked!');
        setSelectedMessage(data)
    }

    return (
        <div className="Sidebar-parent">
            <div className="content">
                <div onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#EB3223" className="bi bi-chat-dots-fill openSidebarButton" viewBox="0 0 16 16">
                        <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    </svg>
                </div>
            </div>

            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>

                {selectedMessages ?
                    <>
                        <div className='backButton' onClick={() => setSelectedMessage(null)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                        </div>
                        <div className='detailsDivParent'>
                            <h2 className='detailsHeadTitle'>Message Details</h2>
                        </div>

                        <div className='scrollable'>
                            <MessageDetailsCard
                                data={selectedMessages}
                            />
                            <div style={{ marginBottom: '50px', visibility: 'hidden' }}>bottom-spacing</div>

                        </div>
                    </>
                    :

                    <>
                        <div onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg closeSidebarButton" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </div>
                        <div className='padding'>
                            <h2 className='headTitle'>Your messages</h2>
                            <p className='headParagraph'>Updates, offers, and news personalized for you.</p>
                        </div>
                        <div className='scrollable'>
                            {messages?.length > 0 ? <>
                                {
                                messages && messages?.map((data, index) => {
                                    console.log('data from messages map', data);
                                    return (
                                        <MessageCard
                                            key={index}
                                            data={data}
                                            handleOpenMessage={() => handleOpenMessage(data)}
                                            isItLast={index === messages.length - 1}
                                        />
                                    )
                                })
                            }
                            </> : 
                                <div className='noMessageParent'>
                                    <p>No messages found.</p>
                                </div>
                            }
                            
                            <div style={{ marginBottom: '50px', visibility: 'hidden' }}>bottom-spacing</div>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
