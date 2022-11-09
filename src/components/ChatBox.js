import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
  InputAdornment,
  Drawer,
} from "@mui/material";
import { getSender } from "./config/ConversationLogics";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ConversationMessages from "./miscellaneous/ConversationMessages";

import io from "socket.io-client";
const ENDPOINT = "https://app-fam-backend.herokuapp.com/";
let socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState({ status: false, message: null });
  const [drawer, setDrawer] = useState(false);
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);

  const {
    user,
    selectedConverstation,
    setSelectedConversation,
    notification,
    setNotification,
  } = ChatState();

  const handleClose = () => {
    setError({ ...error, status: false });
  };

  const fetchMessages = async () => {
    if (!selectedConverstation) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedConverstation._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedConverstation._id);
    } catch (error) {
      setError({ status: true, message: "Failed to Load the Messages." });
      return;
    }
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" && newMessage) || image) {
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      setImage();
      const { data } = await axios.post(
        "/api/message",
        {
          messageBody: image ? image : newMessage,
          messageType: image ? "image" : "text",
          conversationId: selectedConverstation._id,
        },
        config
      );

      socket.emit("new message", data);
      setMessages([...messages, data]);
    } catch (error) {
      setError({ status: true, message: "Failed to Send the Message." });
      return;
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  const postDetails = (images) => {
    setUploading(true);
    if (images === undefined) {
      setError({ status: true, message: "Please select an image." });
      return;
    }
    if (images.type === "image/jpeg" || images.type === "image/png") {
      const data = new FormData();
      data.append("file", images);
      data.append("upload_preset", "app-fam");
      data.append("cloud_name", "dlhs2vmi0");

      fetch("https://api.cloudinary.com/v1_1/dlhs2vmi0/image/upload", {
        method: "post",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          setImage(data.url.toString());
          setUploading(false);
        })
        .catch((error) => {
          setUploading(false);
        });
    } else {
      setError({ status: true, message: "Please select an image." });
      setUploading(false);
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedConverstation;
    // eslint-disable-next-line
  }, [selectedConverstation]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.conversation._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  console.log();

  return (
    <Box sx={{ width: "78%", padding: "10px" }}>
      {selectedConverstation ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
          }}
        >
          <Typography
            display="flex"
            sx={{
              paddingBottom: "10px",
              flexDirection: "row",
              alignItems: "center",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 20px 20px -20px",
            }}
          >
            <Button onClick={() => setSelectedConversation("")}>
              <ArrowBackIcon />
            </Button>
            {!selectedConverstation.isGroupChat ? (
              <Box
                display="flex"
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={getSender(user, selectedConverstation.users).imageUrl}
                  onClick={() => setDrawer(true)}
                />
                <Box
                  display="flex"
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: "15px",
                  }}
                >
                  <Typography variant="h5">
                    {getSender(user, selectedConverstation.users).username}
                  </Typography>
                  <Typography variant="caption">
                    {getSender(user, selectedConverstation.users).isActive
                      ? "Active Now"
                      : "Offline"}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Typography>

          <ConversationMessages messages={messages} />

          <Box
            display="flex"
            sx={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => postDetails(e.target.files[0])}
              />
              <ImageRoundedIcon />
            </IconButton>

            <TextField
              fullWidth
              // multiline
              autoComplete="off"
              type="text"
              size={image ? "normal" : "small"}
              sx={{
                "& .MuiInputBase-multiline": {
                  padding: "5px 20px 5px 20px",
                },
              }}
              placeholder="Aa"
              value={newMessage}
              onChange={handleTyping}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {image ? (
                      <img src={image} alt="attachment" height="30px" />
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={sendMessage}>
              <SendRoundedIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <img src="/images/Image1.jpg" alt="Select user" height="500px" />
          <Typography variant="h4">Select a user to start chatting</Typography>
          <Typography variant="subtitle2">
            or you may search for user
          </Typography>
        </Box>
      )}
      <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
        <Box
          sx={{
            padding: 2,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={
              !selectedConverstation
                ? ""
                : getSender(user, selectedConverstation.users).imageUrl
            }
            alt="display"
            sx={{ width: "250px", height: "250px" }}
          />
          <Box>
            <Typography variant="h6">Email : </Typography>
            <Typography>
              {!selectedConverstation
                ? ""
                : getSender(user, selectedConverstation.users).email}
            </Typography>
          </Box>
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

export default ChatBox;
