import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ConversationLogics";
import { Avatar, Box, Tooltip } from "@mui/material";
import { ChatState } from "../../context/ChatProvider";

const ConversationMessages = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      <Box sx={{ margin: "5px 20px" }}>
        {messages &&
          messages.map((m, i) => (
            <Box sx={{ display: "flex", alignItems: "flex-end" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  title={m.fromUserId.username}
                  placement="bottom-start"
                  arrow
                >
                  <Avatar
                    src={m.fromUserId.imageUrl}
                    sx={{ width: 24, height: 24 }}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.fromUserId._id === user._id
                      ? "rgba(216,27,96,0.6)"
                      : "#d3d3d3"
                  }`,
                  color: `${m.fromUserId._id === user._id ? "white" : "black"}`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                  textAlign: "left",
                }}
              >
                {m.messageType === "image" ? (
                  <img
                    src={m.messageBody}
                    alt={m.messageBody}
                    height="300px"
                    style={{ padding: "10px" }}
                  />
                ) : (
                  m.messageBody
                )}
              </span>
            </Box>
          ))}
      </Box>
    </ScrollableFeed>
  );
};

export default ConversationMessages;
