import { Button, Modal, Frame } from '@shopify/polaris';
import { useState, useCallback } from 'react';

export default function DeleteModal({ isDeleting, toggleDeleteModal, handleDelete }) {


  return (
    <Modal
      open={isDeleting}
      onClose={toggleDeleteModal}
      title="Confirmation"
      primaryAction={{
        destructive: true,
        content: 'Delete',
        onAction: handleDelete,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: toggleDeleteModal,
        },
      ]}
    >
      <Modal.Section>
        Are you sure you want to delete.
      </Modal.Section>
    </Modal>
  );
}