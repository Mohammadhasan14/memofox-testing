import { ButtonGroup, Button } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';

export default function AMPMPressed({ schedule, setSchedule }) {
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(true);

  useEffect(() => {
    if (schedule.amORpm === 'AM') {
      setIsFirstButtonActive(true)
    } else {
      setIsFirstButtonActive(false)
    }
  }, [schedule])

  const handleFirstButtonClick = useCallback(() => {
    if (isFirstButtonActive) return;
    setSchedule((prev) => ({ ...prev, amORpm: 'AM' }))
    setIsFirstButtonActive(true);

  }, [isFirstButtonActive]);

  const handleSecondButtonClick = useCallback(() => {
    if (!isFirstButtonActive) return;
    setSchedule((prev) => ({ ...prev, amORpm: 'PM' }))
    setIsFirstButtonActive(false);

  }, [isFirstButtonActive]);

  return (
    <ButtonGroup variant="segmented">
      <Button pressed={isFirstButtonActive} onClick={handleFirstButtonClick}>
        AM
      </Button>
      <Button pressed={!isFirstButtonActive} onClick={handleSecondButtonClick}>
        PM
      </Button>
    </ButtonGroup>
  );
}