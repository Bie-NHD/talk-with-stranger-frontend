import React from "react";
import { List } from "@mui/material";
import ConservationItem from "./ConservationItem";
import { useSelector } from "react-redux";

const ConservationList = ({ sx, conservations, onItemClick }) => {
  const currentUserId = useSelector((state) => state.user.currentUser.id);

  return (
    <List sx={sx}>
      {conservations.map((c, i) => {
        if (c.type === "one_to_one") {
          const foundMember = c.members.find((m) => m.id !== currentUserId);

          const remoteData = {
            id: foundMember.id,
            avatar: foundMember.user_avatar,
            fullName: `${foundMember.user_first_name} ${foundMember.user_last_name}`,
            gender: foundMember.user_gender,
            dob: foundMember.user_dob,
            lastestMessage: foundMember.lastestMessage,
          };

          return (
            <ConservationItem
              onClick={onItemClick}
              userData={remoteData}
              conservation={c}
              key={i}
            />
          );
        }
        return <></>;
      })}
    </List>
  );
};

export default ConservationList;
