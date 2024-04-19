import { Button, Modal, Frame } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import AddSegment from '../../routes/app.addNewSegment';

export default function PopupAddNewSegments({ isAddNewSegment, toggleAddSegment, setSegmentId }) {

  const [saveSegmentHit, setSaveSegmentHit] = useState(false)
  const [assignToMessageHit, setAssignToMessageHit] = useState(false)

  const handleSaveSegment = () => {
    setSaveSegmentHit(true)
  }

  const handleAssignToMessage = () => {
    setAssignToMessageHit(true)
  }

  return (
    <Modal
      open={isAddNewSegment}
      onClose={toggleAddSegment}
      title="Add New Segment"
      secondaryActions={{
        content: 'Save as segments',
        onAction: handleSaveSegment,
      }}
      primaryAction={[
        {
          content: 'Assign to message',
          onAction: handleAssignToMessage,
        },
      ]}
    >
      <Modal.Section>
        <AddSegment
          isAddSegmentFromMessage={true}
          saveSegmentHit={saveSegmentHit}
          setSaveSegmentHit={setSaveSegmentHit}
          setAssignToMessageHit={setAssignToMessageHit}
          assignToMessageHit={assignToMessageHit}
          setSegmentId={setSegmentId}
          toggleAddSegment={toggleAddSegment}
        />
      </Modal.Section>
    </Modal>
  );
}