import React, { useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import socket from "../../socket";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CallModal from "../CallModal/CallModal";
import CallModalReceiver from "../CallModal/CallModalReceiver";

const NewCallModal = ({ callerInfo, open, onClose }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = (type) => {
    if (type === "Accept") {
      setOpenModal(true);
      onClose();
    } else if (type === "Reject") {
      socket.emit("call/reject", {
        callerId: callerInfo.id,
        receiver: currentUser,
      });

      onClose();
    }
  };

  return (
    <>
      <CallModalReceiver
        callerInfo={callerInfo}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
      <ConfirmDialog
        onActions={handleConfirm}
        open={open}
        onClose={onClose}
        dialogTitle="Incomming call..."
        dialogContent={`New call from ${callerInfo?.user_first_name} ${callerInfo?.user_last_name}`}
        actions={[
          {
            label: "Reject",
            type: "Reject",
          },
          {
            label: "Accept",
            type: "Accept",
          },
        ]}
      />
    </>
  );
};

export default NewCallModal;
