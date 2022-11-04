import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import NavBar from "../components/NavBar";
import Conversation from "../components/Conversation";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <Container maxWidth="xl" disableGutters sx={{ marginBottom: "30px" }}>
      {user && <NavBar />}
      <Box
        sx={{
          display: "flex",
          direction: "row",
          height: "91.5vh",
        }}
      >
        {user && <Conversation fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Container>
  );
};

export default ChatPage;
