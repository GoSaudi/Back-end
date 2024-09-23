import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  Button,
  Stack,
  TextInput,
  Typography,
} from "@strapi/design-system";

export default function ModalForm({
  handleDeleteAction,
  closeModal,
  deleteId,
}) {
  const [approvalReason, setApprovalReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (deleteId) {
      handleDeleteAction(deleteId, "reject", approvalReason);
      closeModal();
    }
  };

  return (
    <ModalLayout is onClose={closeModal} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Are you sure you want to reject this activity?
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Stack size={2}>
          <Box>
            <Box paddingTop={4}>
              <Stack size={1}>
                <TextInput
                  placeholder={"Enter reason here..."}
                  label="Reason for rejection"
                  name="name"
                  // hint={"hint here"}
                  value={approvalReason}
                  onChange={(e) => {
                    setApprovalReason(e.target.value);
                  }}
                ></TextInput>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </ModalBody>
      <ModalFooter
        endActions={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={!approvalReason} onClick={handleSubmit}>
              Confirm
            </Button>
          </>
        }
      />
    </ModalLayout>
  );
}

ModalForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleDeleteAction: PropTypes.func.isRequired,
  deleteId: PropTypes.string.isRequired,
};
