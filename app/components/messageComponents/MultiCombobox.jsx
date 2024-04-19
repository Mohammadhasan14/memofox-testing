import {
  Tag,
  Listbox,
  Combobox,
  Icon,
  TextContainer,
  LegacyStack,
  AutoSelection, Divider, Button
} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { PlusIcon } from '@shopify/polaris-icons';
import './css/Multicombobox.css'
import { useNavigate } from "@remix-run/react";


export default function MultiCombobox({ selected, setSelected, draftAssignedTags, setAddNewSegment, segmentID }) {
  const [inputValue, setInputValue] = useState('');
  const [deselectedOptions, setDeselectedOptions] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log('inputValue..........', inputValue);
  //   console.log('selectedOptions..........', selectedOptions);
  //   console.log('deselectedOptions..........', deselectedOptions);
  //   console.log('options..........', options);

  // }, [inputValue, deselectedOptions, selectedOptions, options])

  useEffect(() => {
    const getDiscountData = async () => {
      try {
        const response = await fetch(`/api/getSegments/${'all'}/${'null'}/${'null'}`, {
          method: "GET",
        });

        if (response.ok) {
          const jsonData = await response.json();
          const { segmentData } = jsonData;
          // console.log('jsonData from segmentData from multiconbobox', segmentData);

          const Options = segmentData.map(d => (
            {
              value: d.id,
              label: d.name
            }
          ))

          // console.log('Options', Options);
          setDeselectedOptions(Options)
          setOptions(Options)

          if (draftAssignedTags) {
            setSelected(draftAssignedTags)
            // console.log('draftAssignedTags......', draftAssignedTags);
            // console.log('Options..........', Options);
            let newDraftTags = []
            draftAssignedTags?.map((d) => {
              // console.log('d', d);
              const optionsData = Options.filter(o => o.value === d)
              // console.log('optionsData', optionsData);
              newDraftTags.push(optionsData[0]?.label)
            })
            // console.log('newDraftTags', newDraftTags);
            setSelectedOptions(newDraftTags);
          }

        }
      } catch (error) {
        console.error('Error in getSegments:', error);
      }
    };

    getDiscountData();
  }, []);

  useEffect(() => {
    // console.log('segmentID before', segmentID);

    if (segmentID.value) {
      if (segmentID.type === 'save') {
        // console.log('segmentID save', segmentID);

        setOptions(prevOptions => [...prevOptions,
        { label: segmentID.label, value: segmentID.value }]);
        setDeselectedOptions(prevDeselectedOptions => [...prevDeselectedOptions,
        { label: segmentID.label, value: segmentID.value }]);

      } else {
        // console.log('segmentID assign', segmentID);

        setSelected(prevSelected => [...prevSelected, segmentID.value]);
        setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, segmentID.label]);
        setOptions(prevOptions => [...prevOptions,
        { label: segmentID.label, value: segmentID.value }]);
        setDeselectedOptions(prevDeselectedOptions => [...prevDeselectedOptions,
        { label: segmentID.label, value: segmentID.value }]);
      }
    }
  }, [segmentID]);


  const escapeSpecialRegExCharacters = useCallback(
    (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selectedItem) => {
      // console.log('selected.......', selected);
      const filteredData = deselectedOptions.filter(d => d.label === selectedItem)[0].value
      // console.log('filteredData.......', filteredData);
      if (selectedOptions.includes(selectedItem)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selectedItem),
        );
        setSelected(selected.filter((d) => d !== filteredData))
      } else {
        setSelectedOptions([...selectedOptions, selectedItem]);
        setSelected([...selected, filteredData])
      }

      updateText('');
    },
    [selectedOptions, updateText],
  );

  const removeTag = useCallback(
    (tag) => () => {
      // console.log('tag', tag);
      // console.log('deselectedOptions.filter(d => d.label === tag)', deselectedOptions.filter(d => d.label === tag));
      const filteredTag = deselectedOptions.filter(d => d.label === tag)?.[0].value

      const options = [...selectedOptions];
      const Options2 = [...selected]
      options.splice(options.indexOf(tag), 1);
      Options2.splice(Options2.indexOf(filteredTag), 1);
      setSelectedOptions(options);
      setSelected(Options2)
    },
    [selectedOptions],
  );

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag key={`option-${option}`} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
        const { label, value } = option;

        return (
          <Listbox.Option
            key={`${label}`}
            value={label}
            selected={selectedOptions.includes(label)}
            accessibilityLabel={label}
          >
            {label}
          </Listbox.Option>
        );
      })
      : null;

  return (
    <div>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search tags"
            autoComplete="off"

          />
        }
      >
        {optionsMarkup ? (
          <Listbox
            autoSelection={AutoSelection.None}
            onSelect={updateSelection}
          >
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
      <div className='selectInstructionParent'><p>You can select multiple segments</p></div>
      <div className='spaceAboveTags'></div>
      <TextContainer>
        <LegacyStack>
          {tagsMarkup}
        </LegacyStack>
      </TextContainer>
      <div style={{ margin: '15px auto' }}>
        <Divider borderColor="border" />
      </div>

      <div style={{ marginBottom: '-21px' }}>
        <Button variant="plain" tone='critical' onClick={() => setAddNewSegment(true)} icon={PlusIcon}>Add new segment</Button>
      </div>
    </div>
  );
}