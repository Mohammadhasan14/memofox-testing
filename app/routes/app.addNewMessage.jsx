import {
    Page, Card, Button, Layout, TextField, Tag,
    Checkbox, Select, LegacyStack, BlockStack, ButtonGroup, FormLayout, Form
} from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import Placeholder from '../components/Placeholder';
import { DeleteIcon, PlusIcon } from '@shopify/polaris-icons';
import { showToast } from '../components/Toast';
import { useNavigate } from '@remix-run/react';
import { useLocation } from "@remix-run/react";
import '../components/messageComponents/css/addNewMessage.css'
import messageImage from '../utils/Images/chat-bubble.png'
import userImage from '../utils/Images/user.png'
import calendarImage from '../utils/Images/calendar.png'
import MultiselectTagCombobox from '../components/messageComponents/MultiselectTagCombobox';
import MultiCombobox from '../components/messageComponents/MultiCombobox';
import SheduleTime from '../components/messageComponents/SheduleTime';
import WUSUWYG from '../components/messageComponents/WUSUWYG';
import { useSubmit } from "@remix-run/react";
import PopupAddNewSegments from '../components/messageComponents/PopupAddNewSegments';

export default function AddMessage() {
    const [isLoading, setLoading] = useState(false)
    const [isDraftLoading, setDraftLoading] = useState(false)
    const [isSheduleLoading, setSheduleLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [campaignName, setCampaignName] = useState('');
    const [previewSubject, setPreviewSubject] = useState('');
    const [selectedTags, setSelectedTags] = useState([])
    const [previewText, setPreviewText] = useState(``);
    const [ctaType, setCtaType] = useState('');
    const [ctaLabel, setCtaLabel] = useState('');
    const [externalURL, setExternalURL] = useState('');
    const [assignedTags, setAssignedTags] = useState([]);
    const [scheduleStart, setScheduleStart] = useState({
        date: '',
        time: '',
        amORpm: 'AM'
    })

    const [scheduleEnd, setScheduleEnd] = useState({
        date: '',
        time: '',
        amORpm: 'AM'
    })

    const [isScheduleEndDateCheck, setScheduleEndDateCheck] = useState(false);
    const [isSheduleChecked, setSheduleChecked] = useState(false)
    // const [sheduleOpen, setSheduledOpen] = useState(true)
    const navigate = useNavigate();
    const location = useLocation();
    const receivedData = location.state?.data;
    const [isAddNewSegment, setAddNewSegment] = useState(false)
    const [segmentID, setSegmentId] = useState({
        label: null,
        value: null,
        type: ''
    })


    // handle upload image functionalities
    const handleImageChange = (event) => {
        // console.log('hit handleImageChange');
        const file = event.target.files[0];
        setSelectedImage(file);
        // console.log(selectedImage);
    };

    useEffect(() => {
        if (receivedData) {
            // console.log('receivedData', receivedData);
            setSelectedImage(receivedData[0]?.selectedImage)
            setCampaignName(receivedData[0]?.campaignName)
            setPreviewSubject(receivedData[0]?.previewSubject)
            setSelectedTags(receivedData[0]?.selectedTags)
            setPreviewText(receivedData[0]?.previewText)
            setCtaType(receivedData[0]?.ctaType)
            setCtaLabel(receivedData[0]?.ctaLabel)
            setExternalURL(receivedData[0]?.externalURL)
            if (receivedData[0]?.startDate || receivedData[0]?.startTime) {
                // setSheduledOpen(true)
                setSheduleChecked(true)
                setScheduleStart({
                    date: receivedData[0]?.startDate ? new Date(receivedData[0]?.startDate).toISOString().split('T')[0] : '',
                    time: receivedData[0]?.startTime,
                    amORpm: receivedData[0]?.startAMorPM
                })
            }
            if (receivedData[0]?.endDate || receivedData[0]?.endTime) {
                setScheduleEndDateCheck(true)
                setScheduleEnd({
                    date: receivedData[0]?.endDate ? new Date(receivedData[0]?.endDate).toISOString().split('T')[0] : '',
                    time: receivedData[0]?.endTime,
                    amORpm: receivedData[0]?.endAMorPM
                })
            }

        }
    }, [receivedData])


    // ............... end ................

    // const handleShedule = async () => {
    //     setSheduledOpen(true)
    //     setSheduleChecked(true)
    // }

    const handleShedule = async () => {
        // console.log('hita asdfasdf asdf asf');
        if (isValueInvalid(scheduleStart.date) || isValueInvalid(scheduleStart.time)
            // || isValueInvalid(scheduleStart.amORpm)
        ) {
            return showToast('Please fill all the fields to shedule!');
        }

        if (isScheduleEndDateCheck) {
            if (isValueInvalid(scheduleEnd.date) || isValueInvalid(scheduleEnd.time)
                // ||isValueInvalid(scheduleEnd.amORpm)
            ) {
                return showToast('Please fill all the fields to shedule!');
            }
        }

        handleSave(false)
    }

    const handleSaveToDraft = async () => {
        let isEmpty = false

        if (isValueInvalid(campaignName) || isValueInvalid(previewSubject)) {
            isEmpty = true;
            showToast('Message name and subject can not be empty!');
        }

        if (isEmpty) {
            return;
        }
        // console.log('selectedImage', selectedImage);
        // console.log('selectedImage type', typeof selectedImage);
        setDraftLoading(true)

        let selectedIMG;
        try {

            const formData = new FormData();
            formData.append('file', selectedImage);

            const responseUpload = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (responseUpload.ok) {
                const { imageName } = await responseUpload.json();
                selectedIMG = imageName;
                // console.log('response on upload ', imageName);
            }

            const newData =
            {
                selectedImage: selectedIMG,
                campaignName,
                previewSubject,
                selectedTags,
                previewText,
                ctaType,
                ctaLabel,
                externalURL,
                assignedSegments: assignedTags,
                startDate: scheduleStart.date,
                startTime: scheduleStart.time,
                startAMorPM: scheduleStart.amORpm,
                endDate: scheduleEnd.date,
                endTime: scheduleEnd.time,
                endAMorPM: scheduleEnd.amORpm
            }

            const response = await fetch(
                `/api/saveDraftMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...newData, messageID: receivedData ? receivedData?.[0]?._id : null,
                    }),
                }
            );

            if (response.ok) {
                // console.log('response on saveDraftMessage ', response)
                showToast('Message saved to draft successfully!')
            };
        } catch (error) {
            console.error('error on saveDraftMessage', error)
        } finally {
            setDraftLoading(false)
            navigate('/app/messages')
        }
    }

    const handleSave = async (isPostNow) => {
        // console.log('data on save and close before validation', `
        // selectedImage ${selectedImage}
        // campaignName ${campaignName}
        // previewSubject ${previewSubject}
        // selectedTags ${selectedTags}
        // previewText ${previewText}
        // ctaType ${ctaType}
        // ctaLabel ${ctaLabel}
        // externalURL ${externalURL}
        // assignedTags ${assignedTags}
        // scheduleStartv => date ${scheduleStart.date} time ${scheduleStart.time} amORpm ${scheduleStart.amORpm}
        // isScheduleEndDateCheck ${isScheduleEndDateCheck}
        // scheduleEnd => date ${scheduleEnd.date} time ${scheduleEnd.time} amORpm ${scheduleEnd.amORpm}

        // `);

        let isEmpty = false

        if (isValueInvalid(selectedImage) || isValueInvalid(campaignName) ||
            isValueInvalid(previewSubject) || isValueInvalid(selectedTags) ||
            isValueInvalid(previewText) || isValueInvalid(ctaType) ||
            isValueInvalid(ctaLabel) || isValueInvalid(externalURL) ||
            isValueInvalid(assignedTags)) {
            isEmpty = true;
            showToast('Please fill all the fields!');
        }

        if (isEmpty) {
            return;
        }

        isPostNow ? setLoading(true) : setSheduleLoading(true)

        const formData = new FormData();
        formData.append('file', selectedImage);

        // for (var key of formData.entries()) {
        //     console.log('formData key', key[0] + ', ' + key[1]);
        // }

        let selectedIMG;
        try {

            if (!receivedData?.[0]?.selectedImage) {
                const responseUpload = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (responseUpload.ok) {
                    const { imageName } = await responseUpload.json();
                    selectedIMG = imageName;
                    // console.log('response on upload ', imageName);
                }
            }


            const newData =
            {
                selectedImage: receivedData?.[0]?.selectedImage ? selectedImage : selectedIMG,
                campaignName,
                previewSubject,
                selectedTags,
                previewText,
                ctaType,
                ctaLabel,
                externalURL,
                assignedSegments: assignedTags,
                startDate: isPostNow ? '' : scheduleStart.date,
                startTime: isPostNow ? '' : scheduleStart.time,
                startAMorPM: scheduleStart.amORpm,
                endDate: isPostNow ? '' : scheduleEnd.date,
                endTime: isPostNow ? '' : scheduleEnd.time,
                endAMorPM: scheduleEnd.amORpm
            }

            const response = await fetch(
                `/api/addNewMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...newData,
                        ...(receivedData ? { messageID: receivedData[0]?._id } : {})
                    })
                }
            );

            if (response.ok) {
                // console.log('response on addNewMessage ', response)
                showToast('Segment saved successfully!')
            };
        } catch (error) {
            console.error('error on addNewMessage', error)
        } finally {
            isPostNow ? setLoading(false) : setSheduleLoading(false)
            setTimeout(() => {
                navigate('/app/messages')

            }, 2000)
        }
    }

    const handlescheduleEndDateChange = useCallback(
        (newChecked) => {
            setScheduleEnd({
                date: '',
                time: '',
                amORpm: 'AM'
            })
            setScheduleEndDateCheck(newChecked)
        },
        [],
    );

    const handleSheduleToggle = () => {
        setScheduleStart({
            date: '',
            time: '',
            amORpm: 'AM'
        })
        setSheduleChecked(!isSheduleChecked)
    }

    useEffect(() => {
        const childDivs = document.querySelectorAll('.Polaris-LegacyStack--spacingExtraTight .Polaris-LegacyStack__Item');

        childDivs.forEach(child => {
            const tagTextElement = child.querySelector('.Polaris-Tag__TagText');
            if (tagTextElement) {
                const tagText = tagTextElement.innerText;
                const removableTag = child.querySelector('.Polaris-Tag--removable')
                // console.log('tagText', tagText);
                if (tagText === 'Discount') {
                    removableTag.style.backgroundColor = '#FEDAD9';
                    removableTag.style.color = '#A64737';
                    child.querySelector('.Polaris-Tag--removable .Polaris-Tag__Button').style.color = '#A64737';

                } else if (tagText === 'Launch') {
                    removableTag.style.backgroundColor = '#E0F0FF';
                    removableTag.style.color = '#00527C';
                    child.querySelector('.Polaris-Tag--removable .Polaris-Tag__Button').style.color = '#00527C';

                } else {
                    removableTag.style.backgroundColor = '#CDFEE1';
                    removableTag.style.color = '#0C5132';
                    child.querySelector('.Polaris-Tag--removable .Polaris-Tag__Button').style.color = '#0C5132';

                }
            }
        });

    }, [selectedTags]);

    const toggleAddSegment = () => {
        // console.log('toggleAddSegment');
        setAddNewSegment(false)
    }
    const handleSaveSegment = () => {
        // console.log('handleSaveSegment');

    }
    const handleAssignToMessage = () => {
        // console.log('handleAssignToMessage');

    }

    const goBack = () => navigate(-1)


    return (
        <Page
            fullWidth
            backAction={{ content: 'Orders', onAction: goBack }}
            title="Add New Message"
            secondaryActions={
                <ButtonGroup>
                    <Button loading={isDraftLoading} onClick={handleSaveToDraft}>Save as Draft</Button>
                    <Button loading={isSheduleLoading} variant='primary' tone='success' onClick={handleShedule}>Schedule</Button>
                </ButtonGroup>

            }
            primaryAction={<Button variant="primary" tone='critical' loading={isLoading} onClick={() => handleSave(true)}>Post Now</Button>}
        >
            <Page fullWidth>
                <Layout>
                    <Layout.Section>
                        <Card title="Order details" sectioned>
                            <div style={{ marginBottom: '20px' }}>
                                <Placeholder
                                    component={
                                        <div className='messageIcon-div'>
                                            <img className='messageIcon' src={messageImage} alt="Message Image" />
                                            <p style={{ fontWeight: '600', fontSize: '14.8px', }}>Message</p>
                                        </div>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='10px'
                                    itemsCentered={false}
                                />

                                <div className={selectedImage ? 'message-image-container' : 'message-image-container-no-image'} >
                                    {(!selectedImage && !receivedData?.[0]?.selectedImage) && <Button onClick={() => document.getElementById('fileInput').click()} icon={PlusIcon}>Upload image</Button>}

                                    {(selectedImage || receivedData?.[0]?.selectedImage) && <img
                                        className='message-image'
                                        src={receivedData?.[0]?.selectedImage ? `/uploads/${receivedData?.[0].storeURL}/${selectedImage}` : URL.createObjectURL(selectedImage)}
                                        alt="Message Image"
                                    />
                                    }

                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                </div>

                            </div>
                            <div style={{ marginBottom: '18px' }}>
                                <Placeholder
                                    component={
                                        <p className='inputLabel'>Campaign Name</p>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='5px'
                                    itemsCentered={false}
                                />
                                <TextField
                                    placeholder='Enter a campaign name'
                                    value={campaignName}
                                    onChange={(value) => setCampaignName(value)}
                                    autoComplete="off"
                                />
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <Placeholder
                                    component={
                                        <p className='inputLabel'>Preview Subject</p>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='5px'
                                    itemsCentered={false}
                                />
                                <TextField
                                    placeholder='Enter a subject'
                                    value={previewSubject}
                                    onChange={(value) => setPreviewSubject(value)}
                                    autoComplete="off"
                                />
                            </div>

                            <div style={{ marginBottom: '18px' }}>

                                <Placeholder
                                    component={
                                        <p className='inputLabel'>Tags</p>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='5px'
                                    itemsCentered={false}
                                />

                                <MultiselectTagCombobox
                                    selectedTags={selectedTags}
                                    setSelectedTags={setSelectedTags}
                                />
                            </div>

                            <div style={{ marginBottom: '18px' }}>

                                <Placeholder
                                    component={
                                        <p className='inputLabel'>Preview Text</p>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='5px'
                                    itemsCentered={false}
                                />
                                <WUSUWYG
                                    value={previewText}
                                    setValue={setPreviewText}
                                    placeholder={'Write something here...'}
                                />
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <BlockStack alignment="leading" spacing="loose">
                                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '28px' }}>
                                        <FormLayout>
                                            <FormLayout.Group condensed >
                                                <Select
                                                    label='CTA Type'
                                                    placeholder='Select cta type'
                                                    // error={errorMessage.attribute}
                                                    options={['External link']}
                                                    value={ctaType}
                                                    onChange={(value) => setCtaType(value)}
                                                />

                                                < TextField
                                                    label='CTA Label'
                                                    // error={errorMessage.value}
                                                    placeholder='Enter a label'
                                                    value={ctaLabel}
                                                    type={'text'}
                                                    onChange={(value) => setCtaLabel(value)}
                                                    autoComplete="off"
                                                />

                                                < TextField
                                                    label='External URL'
                                                    // error={errorMessage.value}
                                                    placeholder='Enter an external url'
                                                    value={externalURL}
                                                    type={'text'}
                                                    onChange={(value) => setExternalURL(value)}
                                                    autoComplete="off"
                                                />
                                            </FormLayout.Group>
                                        </FormLayout>
                                    </div>
                                </BlockStack>
                            </div>
                        </Card>
                    </Layout.Section>
                    <Layout.Section variant='oneHalf'>
                        <Card title="Tags" sectioned>
                            <div style={{ marginBottom: '20px' }}>
                                <Placeholder
                                    component={
                                        <div className='messageIcon-div'>
                                            <img className='messageIcon' src={userImage} alt="Message Image" />
                                            <p style={{ fontWeight: '600', fontSize: '14.8px', }}>Assign Segments</p>
                                        </div>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='10px'
                                    itemsCentered={false}
                                />

                            </div>
                            <div style={{ marginBottom: '18px' }}>

                                <MultiCombobox
                                    selected={assignedTags}
                                    setSelected={setAssignedTags}
                                    draftAssignedTags={receivedData ? receivedData[0]?.assignedSegments : null}
                                    setAddNewSegment={setAddNewSegment}
                                    segmentID={segmentID}
                                />
                            </div>
                        </Card>
                        <div style={{ margin: '20px auto 20px auto' }}></div>
                        <Card title="Tags" sectioned>
                            <div className='durationsParent'>
                                <Placeholder
                                    component={
                                        <div className='messageIcon-div'>
                                            <img className='messageIcon' src={calendarImage} alt="Message Image" />
                                            <p style={{ fontWeight: '600', fontSize: '14.8px', }}>Schedule Post</p>
                                        </div>
                                    }
                                    marginTop='0'
                                    padding='0'
                                    height='auto'
                                    width='auto'
                                    marginBottom='10px'
                                    itemsCentered={false}
                                />
                                <div className='switchButtonContainer'>
                                    <input type="checkbox" checked={isSheduleChecked} onChange={handleSheduleToggle} hidden="hidden" id="shedule"></input>
                                    <label className="switch" htmlFor="shedule"></label>
                                </div>
                            </div>
                            {isSheduleChecked && <>
                                <div className='scheduleStartTime'>
                                    <SheduleTime
                                        schedule={scheduleStart}
                                        setSchedule={setScheduleStart}
                                        dateLabel={'Start Date'}
                                    />
                                </div>
                                <div>
                                    <Checkbox
                                        label="Shedule End Date"
                                        checked={isScheduleEndDateCheck}
                                        onChange={handlescheduleEndDateChange}
                                    />
                                </div>
                                {isScheduleEndDateCheck &&
                                    <div className='scheduleEndTime'>
                                        <SheduleTime
                                            schedule={scheduleEnd}
                                            setSchedule={setScheduleEnd}
                                            dateLabel={'End Date'}

                                        />
                                    </div>
                                }
                            </>}
                        </Card>
                    </Layout.Section>
                </Layout>
            </Page>
            <PopupAddNewSegments
                isAddNewSegment={isAddNewSegment}
                toggleAddSegment={toggleAddSegment}
                handleSaveSegment={handleSaveSegment}
                handleAssignToMessage={handleAssignToMessage}
                setSegmentId={setSegmentId}
            />
        </Page>
    );

    function isValueInvalid(content) {
        if (!content) {
            return true;
        }

        return content.length < 1;
    }

}