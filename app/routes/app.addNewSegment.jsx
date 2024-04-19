import { Page, Card, Button, Grid, TextField, BlockStack, FormLayout, Divider, Select, Popover, ActionList, InlineError } from '@shopify/polaris';
import React, { useCallback, useEffect, useState } from 'react';
import Placeholder from '../components/Placeholder';
import { DeleteIcon, PlusIcon } from '@shopify/polaris-icons';
import { showToast } from '../components/Toast';
import { useNavigate } from '@remix-run/react';
import { useLocation } from "@remix-run/react";


export default function AddSegment({ isAddSegmentFromMessage, saveSegmentHit, setSaveSegmentHit, setAssignToMessageHit, assignToMessageHit, setSegmentId, toggleAddSegment }) {
    const [segmentName, setSegmentName] = useState('');
    const [filters, setFilters] = useState([{ attribute: '', operator: '', value: '', duration: '', addOperator: '' }]);
    const [popoverActive, setPopoverActive] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [isDraftLoading, setDraftLoading] = useState(false)

    const navigate = useNavigate();
    const location = useLocation();
    const receivedData = location.state?.data;

    // const [errorMessage, setErrorMessage] = useState({
    //     attribute: '',
    //     operator: '',
    //     value: '',
    //     duration: ''
    // })

    useEffect(() => {
        // console.log('hit outside if of useEffect  assignToMessageHit saveSegmentHit', assignToMessageHit, '    ', saveSegmentHit);

        if (saveSegmentHit || assignToMessageHit) {
            // console.log('hit inside if of useEffect  assignToMessageHit  saveSegmentHit', assignToMessageHit, '    ', saveSegmentHit);

            handleSave()
            setSaveSegmentHit(false)
            setAssignToMessageHit(false)
        }
    }, [saveSegmentHit, assignToMessageHit])

    useEffect(() => {
        if (receivedData && !isAddSegmentFromMessage) {
            // console.log('receivedData', receivedData);
            setSegmentName(receivedData[0]?.segmentDraft?.segmentName)
            setFilters(receivedData[0]?.segmentDraft?.segmentCriteria)
        }
    }, [receivedData])

    // const handleAddFilter = (dataOperator) => {
    //     console.log('filters', filters);
    //     if (filters === undefined) {
    //         setFilters([{ attribute: '', operator: '', value: '', duration: '', addOperator: '' }])
    //     }
    //     if (filters?.length === 10) {
    //         return showToast('You can have a maximum of 10 filters')
    //     }
    //     console.log('filters upup up', filters);
    //     setFilters([...filters, { attribute: '', operator: '', value: '', duration: '', addOperator: '' }]);
    //     setFilters(f => {
    //         const allFilters = [...f];
    //         allFilters[allFilters?.length - 1].addOperator = dataOperator;
    //         return allFilters;
    //     });
    //     togglePopoverActive()
    // };

    // const handleAddFilter = (dataOperator) => {
    //     console.log('filters', filters);
    //     if (filters === undefined) {
    //         setFilters([{ attribute: '', operator: '', value: '', duration: '', addOperator: dataOperator }])
    //     } else if (filters.length === 10) {
    //         showToast('You can have a maximum of 10 filters');
    //         return; 
    //     } else {
    //         setFilters(prevFilters => [
    //             ...prevFilters,
    //             { attribute: '', operator: '', value: '', duration: '', addOperator: dataOperator }
    //         ]);
    //     }
    //     togglePopoverActive();
    // };

    // useEffect(() => {
    //     console.log('filters..........', filters);
    // }, [filters])

    const handleAddFilter = (dataOperator) => {

        if (filters.length === 10) {
            return showToast('You can have a maximum of 10 filters')
        }
        setFilters(f => {
            const allFilters = [...f];
            allFilters[allFilters.length - 1].addOperator = dataOperator;
            return allFilters;
        });
        setFilters([...filters, { attribute: '', operator: '', value: '', duration: '', addOperator: '' }]);
        togglePopoverActive()
    };

    const handleChange = async (index, field, value, product_purchased) => {
        // console.log('handleChange    index, field, value', index, '   ', field, '    ', value)
        let newFilters = [...filters];

        // const selectedProductsids = (filters && filters.find(data => data.attribute === 'products_purchased(id)')) ?
        //     filters.find(data => data.attribute === 'products_purchased(id)').value ?
        //         filters.find(data => data.attribute === 'products_purchased(id)').value.map(d => d.product) : [] : [];
        // console.log('selectedProductsids..........', selectedProductsids);

        if (product_purchased === 'products_purchased(id)') {
            const selectedProductsids = newFilters[index].value ?
                newFilters[index].value.map(d => d.product) : [];
            // console.log('selectedProductsids..........', selectedProductsids);
            const products = await window.shopify.resourcePicker({
                type: "product",
                action: "select",
                multiple: true,
                selectionIds: selectedProductsids
            });
            // console.log("products ===", products);

            const namesAndIds = products?.map((data) => {
                return {
                    name: data.title,
                    product: {
                        id: data.id,
                        // Selecting product with variants ids 
                        // variants: [
                        //     ...(data.variants?.map(d => {
                        //         return {
                        //             id: d.id
                        //         }
                        //     }) ?? []) // Using nullish coalescing operator to handle 'variants' being undefined or null
                        // ]
                    }
                }
            });
            newFilters[index][field] = namesAndIds;
        }
        else {
            newFilters[index][field] = value;
            if (field === 'operator' || field === 'attribute') {
                newFilters[index]['value'] = '';
            }
        }
        setFilters(newFilters);

    };


    // const handleRemoveFilter = (ItemIndex) => {
    //     setFilters(prev => prev.map((filter, index) => {
    //         if (index === ItemIndex - 1) {
    //             return { ...filter, addOperator: '' };
    //         }
    //         return filter;
    //     }).filter((_, index) => index !== ItemIndex));
    // };

    const handleRemoveFilter = (ItemIndex) => {
        let newDataAfterRemove = filters.filter((_, index) => index !== ItemIndex);
        // console.log('newDataAfterRemove', newDataAfterRemove.length);
        if (newDataAfterRemove.length === 1) {
            // console.log('hit if ');
            return setFilters([{ ...newDataAfterRemove[0], addOperator: '' }])
        } else {
            // console.log('hit else ');

            return setFilters(newDataAfterRemove.map((data, index) => {
                if (newDataAfterRemove.length - 1 === index) {
                    return { ...data, addOperator: '' };
                }
                return data;
            }))
        }
    };

    const CollectionRuleTypes = [
        { label: 'Number of Orders', value: 'number_of_orders' },
        { label: 'Total Spent', value: 'amount_spent' },
        { label: 'Last Ordered', value: 'last_order_date' },
        { label: 'First Ordered', value: 'first_order_date' },
        { label: 'Customer Tags', value: 'customer_tags' },
        { label: 'Purchased Product Names', as: 'id', value: 'products_purchased(id)' },
        { label: 'Purchased Product Quantity', as: 'quantity', value: 'products_purchased(quantity)' },
        { label: 'Purchased Product Tags', as: 'tag', value: 'products_purchased(tag)' },
    ]

    const CollectionRuleConditions = [
        { label: 'Equal to', value: '=' },
        { label: 'Not equal to', value: '!=' },
        { label: 'Greater than', value: '>' },
        { label: 'Greater than or equal to', value: '>=' },
        { label: 'Less than', value: '<' },
        { label: 'Less than or equal to', value: '<=' },
        // { label: '', value: '' }
    ]

    const CustomerTagsOperators = [
        { label: 'Contains tag', value: 'CONTAINS' },
        { label: "Doesn't contain tag", value: 'NOT CONTAINS' },
        { label: 'Exits', value: 'IS NOT NULL' },
        { label: "Doesn't exist", value: 'IS NULL' }
    ]

    const CollectionRuleDuration = [
        { label: 'day', value: 'd' },
        { label: 'week', value: 'w' },
        { label: 'month', value: 'm' },
        { label: 'year', value: 'y' },
    ]

    const ProductRuleOperators = [
        { label: 'Includes', value: 'true' },
        { label: 'Not includes', value: 'false' },
    ]

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );
    const activator = (
        <Button icon={PlusIcon} onClick={togglePopoverActive}>Add Filter</Button>
    );

    const handleSaveToDraft = async () => {

        let isEmpty = false

        if (isValueInvalid(segmentName)) {
            isEmpty = true;
            showToast('Segment name can not be empty!');
        }

        if (isEmpty) {
            return;
        }

        setDraftLoading(true)

        const newData =
        {
            segmentName,
            segmentCriteria: filters
        }

        try {
            const response = await fetch(
                `/api/saveDraftSegment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: newData, segmentID: receivedData ? receivedData?.[0]?._id : null,
                    }),
                }
            );

            if (response.ok) {
                // console.log('response on saveDraftSegment ', response)
                showToast('Segment saved to draft successfully!')
            };
        } catch (error) {
            console.error('error on addNewSegment', error)
        } finally {
            setDraftLoading(false)
            navigate('/app/segments')
        }
    }

    const handleSave = async () => {
        // console.log('data on save and close filters before validation', filters);

        // form validation check
        let isEmpty = false

        if (isValueInvalid(segmentName)) {
            isEmpty = true;
            showToast('Segment name can not be empty!');
        }

        filters.forEach(data => {
            for (const [key, val] of Object.entries(data)) {
                if (
                    data.attribute === 'number_of_orders' ||
                    data.attribute === 'amount_spent' ||
                    data.attribute === 'customer_tags' ||
                    data.attribute === 'products_purchased(id)' ||
                    data.attribute === 'products_purchased(quantity)' ||
                    data.attribute === 'products_purchased(tag)'
                ) {
                    // console.log('hit inside if data.attribute, key', data.attribute, key);
                    if ((key !== 'duration' && key !== 'addOperator' && data.operator !== 'IS NOT NULL' && data.operator !== 'IS NULL') && isValueInvalid(val)) {
                        isEmpty = true;
                        showToast('Input field can not be empty!');
                    }

                    if (data.attribute === 'products_purchased(quantity)') {
                        if (key === 'value' && val < 1) {
                            isEmpty = true;
                            showToast('Purchased Product Quantity value must be at least 1!');
                        }
                    }
                } else if (data.attribute === 'last_order_date' || data.attribute === 'first_order_date') {
                    // console.log('hit inside else if data.attribute, key', data.attribute, key);

                    if (key !== 'addOperator' && isValueInvalid(val)) {
                        isEmpty = true;
                        showToast('Input field can not be empty!');
                    }
                } else {
                    isEmpty = true;
                    showToast('Input field can not be empty!');
                }
            }
        });

        if (isEmpty) {
            return;
        }
        setLoading(true)
        // console.log('data on save and close filters after validation', filters);
        const newData = [
            {
                segmentID: receivedData ? receivedData?.[0]?._id : null,
                segmentName,
                segmentCriteria: filters
            }
        ]

        try {
            const response = await fetch(
                `/api/addNewSegment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(...newData),
                }
            );

            if (response.ok) {
                // console.log('response on addNewwSegment ', response)
                const { segmentData } = await response.json();
                // console.log('segmentData', segmentData);
                if (assignToMessageHit || saveSegmentHit) {
                    setSegmentId({
                        label: segmentData?.name,
                        value: segmentData?.id,
                        type: saveSegmentHit ? 'save' : 'assign'
                    })
                }
                showToast('Segment saved successfully!')
            };
        } catch (error) {
            console.error('error on addNewSegment', error)
        } finally {
            setLoading(false)
            // console.log('mmmmmmmmnnbnbbnbnb from finally outside if saveSegmentHit assignToMessageHit', saveSegmentHit, '  ', assignToMessageHit);
            if (saveSegmentHit || assignToMessageHit) {
                // console.log('mmmmmmmmnnbnbbnbnb from finally inside if');
                setSaveSegmentHit(false)
                setAssignToMessageHit(false)
                toggleAddSegment()
            } else {
                navigate('/app/segments')

            }
        }
    }

    const goBack = () => navigate(-1)

    return (
        <Page
            fullWidth
            backAction={isAddSegmentFromMessage ? null : { content: 'Orders', onAction: goBack }}
            title={isAddSegmentFromMessage ? null : "Add New Segment"}
            secondaryActions={isAddSegmentFromMessage ? null : <Button loading={isDraftLoading} onClick={handleSaveToDraft}>Save as Draft</Button>}
            primaryAction={isAddSegmentFromMessage ? null : <Button variant="primary" loading={isLoading} onClick={handleSave}>Save & Close</Button>}
        >
            <Page fullWidth>
                {!isAddSegmentFromMessage ? <Grid columns={{ sm: 3 }}>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 7, xl: 7 }}>
                        <Card>
                            <Placeholder
                                component={
                                    <p style={{ fontWeight: '600', fontSize: '14.5px' }}>Segment Name</p>
                                }
                                marginTop='0'
                                padding='0'
                                height='auto'
                                width='auto'
                                marginBottom='16px'
                                itemsCentered={false}
                            />
                            <TextField
                                placeholder='Enter a segment name'
                                value={segmentName}
                                onChange={(value) => { setSegmentName(value) }}
                                autoComplete="off"
                            />
                        </Card>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 7, xl: 7 }}>
                        <Card>
                            <Placeholder
                                component={
                                    <p style={{ fontWeight: '600', fontSize: '14.5px' }}>Segment Criteria</p>
                                }
                                marginTop='0'
                                padding='0'
                                height='auto'
                                width='auto'
                                marginBottom='16px'
                                itemsCentered={false}
                            />
                            {filters?.map((filter, index) => {

                                return (
                                    <FormLayout key={index}>
                                        <BlockStack alignment="leading" spacing="loose">
                                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '28px' }}>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>

                                                        <Select
                                                            labelHidden
                                                            placeholder='Select attribute'
                                                            // error={errorMessage.attribute}
                                                            options={CollectionRuleTypes}
                                                            value={filter.attribute}
                                                            onChange={(value) => handleChange(index, 'attribute', value)}
                                                        />
                                                        {/* {filter.attribute === 'products_purchased(id)' && console.log('filter.attribute')} */}
                                                        <Select
                                                            labelHidden
                                                            placeholder='Select operator'
                                                            // error={errorMessage.operator}
                                                            options={
                                                                filter.attribute === 'customer_tags' ?
                                                                    CustomerTagsOperators :
                                                                    (
                                                                        (filter.attribute === 'products_purchased(id)' ||
                                                                            filter.attribute === 'products_purchased(quantity)' ||
                                                                            filter.attribute === 'products_purchased(tag)') ?
                                                                            ProductRuleOperators :
                                                                            CollectionRuleConditions
                                                                    )
                                                            }
                                                            value={filter.operator}
                                                            onChange={(value) => handleChange(index, 'operator', value)}
                                                        />

                                                        {(filter.attribute === 'products_purchased(id)') && <input style={{ visibility: 'hidden' }} />}

                                                        {(filter.attribute !== 'products_purchased(id)') &&
                                                            < TextField
                                                                disabled={(filter.operator === 'IS NOT NULL' || filter.operator === 'IS NULL') ? true : false}
                                                                labelHidden
                                                                // error={errorMessage.value}
                                                                placeholder='Enter a value'
                                                                value={filter.value}
                                                                type={(filter.attribute !== 'customer_tags' && filter.attribute !== 'products_purchased(tag)') ? 'number' : 'text'}
                                                                onChange={(value) => handleChange(index, 'value', value)}
                                                                autoComplete="off"
                                                            />
                                                        }

                                                        {(filter.attribute === 'last_order_date' || filter.attribute === 'first_order_date')
                                                            && <Select
                                                                labelHidden
                                                                placeholder='Select duration'
                                                                // error={errorMessage.duration}
                                                                options={CollectionRuleDuration}
                                                                value={filter.duration}
                                                                onChange={(value) => handleChange(index, 'duration', value)}
                                                            />
                                                        }
                                                    </FormLayout.Group>
                                                </FormLayout>
                                                {filters.length > 1 && <div style={{ marginLeft: '22px', ...(filters.length !== index + 1 ? { marginBottom: '35px' } : {}) }}>
                                                    <Button icon={DeleteIcon} onClick={() => handleRemoveFilter(index)} accessibilityLabel="Remove item" />

                                                </div>}

                                            </div>
                                            {(filter.attribute === 'products_purchased(id)')
                                                && <div style={{ marginBottom: '26px', ...(filters.length === index + 1 && { marginTop: '20px' }) }}>
                                                    <TextField
                                                        disabled={(filter.operator === 'IS NOT NULL' || filter.operator === 'IS NULL') ? true : false}
                                                        labelHidden
                                                        // error={errorMessage.value}
                                                        placeholder='Enter a value'
                                                        value={filter.value?.length > 0 ? filter.value.map(data => ` ${data.name}`) : filter.value}
                                                        onFocus={() => handleChange(index, 'value', '', filter.attribute)}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            }
                                            {filters.length !== index + 1 && <div style={{ position: 'relative' }}>
                                                <Divider />
                                                <div style={{ position: 'absolute', top: '-13px', left: '30px' }}>
                                                    <Button>{filter.addOperator}</Button>
                                                </div>
                                            </div>}
                                        </BlockStack>

                                    </FormLayout>
                                )
                            }


                            )}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '45px', marginBottom: '-10px' }}>
                                {/* <Button icon={PlusIcon} onClick={handleAddFilter}>Add Filter</Button> */}
                                <Popover
                                    active={popoverActive}
                                    activator={activator}
                                    autofocusTarget="first-node"
                                    onClose={togglePopoverActive}
                                >
                                    <ActionList
                                        actionRole="menuitem"
                                        items={[
                                            { content: 'OR', onAction: () => handleAddFilter('OR') },
                                            { content: 'AND', onAction: () => handleAddFilter('AND') },
                                        ]}
                                    />
                                </Popover>
                            </div>
                        </Card>
                    </Grid.Cell>

                </Grid>

                    :
                    <>
                        <Card>
                            <Placeholder
                                component={
                                    <p style={{ fontWeight: '600', fontSize: '14.5px' }}>Segment Name</p>
                                }
                                marginTop='0'
                                padding='0'
                                height='auto'
                                width='auto'
                                marginBottom='16px'
                                itemsCentered={false}
                            />
                            <TextField
                                placeholder='Enter a segment name'
                                value={segmentName}
                                onChange={(value) => { setSegmentName(value) }}
                                autoComplete="off"
                            />
                        </Card>
                        <div style={{ marginBottom: '5px' }}>

                        </div>
                        <Card>
                            <Placeholder
                                component={
                                    <p style={{ fontWeight: '600', fontSize: '14.5px' }}>Segment Criteria</p>
                                }
                                marginTop='0'
                                padding='0'
                                height='auto'
                                width='auto'
                                marginBottom='16px'
                                itemsCentered={false}
                            />
                            {filters?.map((filter, index) => {

                                return (
                                    <FormLayout key={index}>
                                        <BlockStack alignment="leading" spacing="loose">
                                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '28px' }}>
                                                <FormLayout>
                                                    <FormLayout.Group condensed>

                                                        <Select
                                                            labelHidden
                                                            placeholder='Select attribute'
                                                            // error={errorMessage.attribute}
                                                            options={CollectionRuleTypes}
                                                            value={filter.attribute}
                                                            onChange={(value) => handleChange(index, 'attribute', value)}
                                                        />
                                                        {/* {filter.attribute === 'products_purchased(id)' && console.log('filter.attribute')} */}
                                                        <Select
                                                            labelHidden
                                                            placeholder='Select operator'
                                                            // error={errorMessage.operator}
                                                            options={
                                                                filter.attribute === 'customer_tags' ?
                                                                    CustomerTagsOperators :
                                                                    (
                                                                        (filter.attribute === 'products_purchased(id)' ||
                                                                            filter.attribute === 'products_purchased(quantity)' ||
                                                                            filter.attribute === 'products_purchased(tag)') ?
                                                                            ProductRuleOperators :
                                                                            CollectionRuleConditions
                                                                    )
                                                            }
                                                            value={filter.operator}
                                                            onChange={(value) => handleChange(index, 'operator', value)}
                                                        />

                                                        {(filter.attribute === 'products_purchased(id)') && <input style={{ visibility: 'hidden' }} />}

                                                        {(filter.attribute !== 'products_purchased(id)') &&
                                                            < TextField
                                                                disabled={(filter.operator === 'IS NOT NULL' || filter.operator === 'IS NULL') ? true : false}
                                                                labelHidden
                                                                // error={errorMessage.value}
                                                                placeholder='Enter a value'
                                                                value={filter.value}
                                                                type={(filter.attribute !== 'customer_tags' && filter.attribute !== 'products_purchased(tag)') ? 'number' : 'text'}
                                                                onChange={(value) => handleChange(index, 'value', value)}
                                                                autoComplete="off"
                                                            />
                                                        }

                                                        {(filter.attribute === 'last_order_date' || filter.attribute === 'first_order_date')
                                                            && <Select
                                                                labelHidden
                                                                placeholder='Select duration'
                                                                // error={errorMessage.duration}
                                                                options={CollectionRuleDuration}
                                                                value={filter.duration}
                                                                onChange={(value) => handleChange(index, 'duration', value)}
                                                            />
                                                        }
                                                    </FormLayout.Group>
                                                </FormLayout>
                                                {filters.length > 1 && (
                                                    <div style={{ marginLeft: '22px', ...(filters.length !== index + 1 ? (filter.attribute === 'last_order_date' || filter.attribute === 'first_order_date') ? { marginBottom: '75px' } : { marginBottom: '35px' } : {}) }}>
                                                        <Button icon={DeleteIcon} onClick={() => handleRemoveFilter(index)} accessibilityLabel="Remove item" />
                                                    </div>
                                                )}

                                            </div>
                                            {(filter.attribute === 'products_purchased(id)')
                                                && <div style={{ marginBottom: '26px', ...(filters.length === index + 1 && { marginTop: '20px' }) }}>
                                                    <TextField
                                                        disabled={(filter.operator === 'IS NOT NULL' || filter.operator === 'IS NULL') ? true : false}
                                                        labelHidden
                                                        // error={errorMessage.value}
                                                        placeholder='Enter a value'
                                                        value={filter.value?.length > 0 ? filter.value.map(data => ` ${data.name}`) : filter.value}
                                                        onFocus={() => handleChange(index, 'value', '', filter.attribute)}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            }
                                            {filters.length !== index + 1 && <div style={{ position: 'relative' }}>
                                                <Divider />
                                                <div style={{ position: 'absolute', top: '-13px', left: '30px' }}>
                                                    <Button>{filter.addOperator}</Button>
                                                </div>
                                            </div>}
                                        </BlockStack>

                                    </FormLayout>
                                )
                            }


                            )}
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '45px', marginBottom: '-10px' }}>
                                {/* <Button icon={PlusIcon} onClick={handleAddFilter}>Add Filter</Button> */}
                                <Popover
                                    active={popoverActive}
                                    activator={activator}
                                    autofocusTarget="first-node"
                                    onClose={togglePopoverActive}
                                >
                                    <ActionList
                                        actionRole="menuitem"
                                        items={[
                                            { content: 'OR', onAction: () => handleAddFilter('OR') },
                                            { content: 'AND', onAction: () => handleAddFilter('AND') },
                                        ]}
                                    />
                                </Popover>
                            </div>
                        </Card>
                    </>}

            </Page>
        </Page>
    );

    function isValueInvalid(content) {
        if (!content) {
            return true;
        }

        return content.length < 1;
    }

}