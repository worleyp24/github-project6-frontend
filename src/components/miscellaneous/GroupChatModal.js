import { useState } from "react";
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
  CircularProgress,
} from "@mui/material";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, conversations, setConversations } = ChatState();

  return <div>GroupChatModal</div>;
};

export default GroupChatModal;
