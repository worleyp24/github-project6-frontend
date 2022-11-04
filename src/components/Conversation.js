import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Stack,
  Typography,
  Button,
  Drawer,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Fab,
  CircularProgress,
} from "@mui/material";
import { getSender } from "./config/ConversationLogics";
import SearchIcon from "@mui/icons-material/Search";
import ChatLoading from "./miscellaneous/ChatLoading";
import UserListItem from "./miscellaneous/UserListItem";
import GroupsIcon from "@mui/icons-material/Groups";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";

const Conversation = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState({ status: false, message: null });
  const [drawer, setDrawer] = useState(false);

  const {
    user,
    selectedConverstation,
    setSelectedConversation,
    notification,
    setNotification,
    conversations,
    setConversations,
  } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setConversations(data);
    } catch (error) {}
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const handleClose = () => {
    setError({ ...error, status: false });
  };

  const handleSearch = async (e) => {
    if (!search) {
      setSearchResult([]);
      setError({ status: true, message: "Failed to Load the Search Results." });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setError({ status: true, message: "Failed to Load the Search Results." });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!conversations.find((c) => c._id === data._id))
        setConversations([data, ...conversations]);
      setSelectedConversation(data);

      // Reset state
      setSearch();
      setSearchResult([]);
      setLoadingChat(false);
      setDrawer(false);
    } catch (error) {
      setError({ status: true, message: "Error fetching the chat." });
      return;
    }
  };

  const handleSelectedConversation = (chat) => {
    setSelectedConversation(chat);

    const filteredNotif = notification.filter(
      (notif) => notif.fromUserId._id !== getSender(loggedUser, chat.users)._id
    );
    setNotification(filteredNotif);
  };

  return (
    <Box
      display={{ xs: selectedConverstation ? "flex" : "none", sm: "flex" }}
      sx={{
        flexDirection: "column",
        minWidth: "320px",
        padding: "10px",
      }}
    >
      <Stack direction="row" sx={{ margin: "0 10px 10px 0" }}>
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            flex: 1,
            paddingLeft: "5px",
            fontWeight: "500",
          }}
        >
          Messages
        </Typography>
        <Fab
          size="small"
          color="primary"
          onClick={() => setDrawer(true)}
          sx={{
            marginRight: "5px",
          }}
        >
          <SearchIcon />
        </Fab>
        <Fab size="small" color="primary">
          <GroupsIcon />
        </Fab>
      </Stack>
      <Box
        sx={{
          width: "100%",
          textAlign: "left",
        }}
      >
        {conversations.length === 0
          ? ""
          : conversations.map((chat) => (
              <Box
                elevation={0}
                key={chat._id}
                onClick={() => handleSelectedConversation(chat)}
                bgcolor={
                  selectedConverstation === chat
                    ? "rgba(197, 17, 98, 0.2)"
                    : "white"
                }
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "5px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  height: "60px",
                  "&:hover": {
                    background: "rgba(128, 0, 128, 0.2)",
                    transition: ".2s ease-in",
                  },
                }}
              >
                <Avatar src={getSender(loggedUser, chat.users).imageUrl} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <Typography>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users).username
                      : chat.conversationName}
                    {notification.find(
                      (item) =>
                        item.fromUserId._id ===
                        getSender(loggedUser, chat.users)?._id
                    ) ? (
                      <FiberNewOutlinedIcon sx={{ color: "#D81B60" }} />
                    ) : (
                      ""
                    )}
                  </Typography>
                  {chat.latestMessage && (
                    <Typography variant="caption" sx={{ color: "#777" }}>
                      <b>
                        {getSender(loggedUser, chat.users).username ===
                        chat.latestMessage.fromUserId.username
                          ? chat.latestMessage.fromUserId.username.split(" ")[0]
                          : "You"}
                        :{" "}
                      </b>
                      {chat.latestMessage.messageBody.length > 20
                        ? chat.latestMessage.messageBody.substring(0, 21) +
                          "..."
                        : chat.latestMessage.messageBody}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
      </Box>
      <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
        <Box sx={{ padding: 2 }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            type={"text"}
            value={search}
            placeholder="Search User"
            width="50%"
            sx={{
              "& .MuiInputBase-input": { padding: "5px 20px 5px 0" },
            }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Go</Button>
          <Divider sx={{ margin: "10px 0" }} />
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <CircularProgress ml="auto" d="flex" />}
        </Box>
      </Drawer>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={error.status}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Conversation;
