import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  InputAdornment,
  Typography,
  Snackbar,
  Alert,
  styled,
  IconButton,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";

const LinedText = styled(Typography)({
  display: "block",
  height: "10px",
  borderBottom: "solid 1px #000",
  textAlign: "center",
});

const StyledSpan = styled("span")({
  display: "inline-block",
  backgroundColor: "#fff",
  padding: "0 10px",
});

const LogIn = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState({ status: false, message: null });

  const navigate = useNavigate();

  const handleClose = () => {
    setError({ ...error, status: false });
  };

  const handleLogIn = async () => {
    if (!email || !password) {
      setError({ status: true, message: "Please enter all required fields." });
      return;
    }
    try {
      const config = { headers: { "Content-type": "application/json" } };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      await axios.put(
        "/api/user/update",
        { isActive: true, userId: data._id },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data);
      navigate("/chat");
    } catch (error) {
      setError({
        status: true,
        message: error.response.data.message,
      });
    }
  };

  return (
    <Stack
      width={"100%"}
      minWidth="280px"
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      spacing={2}
    >
      <h2>Hello, Welcome Back!</h2>
      <FormControl id="email">
        <TextField
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailIcon />
              </InputAdornment>
            ),
          }}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <TextField
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon />
              </InputAdornment>
            ),
          }}
          type={"password"}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button variant="contained" onClick={handleLogIn}>
        Log in
      </Button>
      <LinedText variant="body2" fontStyle={"italic"}>
        <StyledSpan>or</StyledSpan>
      </LinedText>
      <Typography variant="body2">Continue with social media</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <IconButton
          sx={{ bgcolor: "#39569c", "&:hover": { background: "#c51162" } }}
        >
          <FacebookRoundedIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton
          sx={{ bgcolor: "#DB4437", "&:hover": { background: "#c51162" } }}
        >
          <GoogleIcon sx={{ color: "white" }} />
        </IconButton>
        <IconButton
          sx={{ bgcolor: "#0A66C2", "&:hover": { background: "#c51162" } }}
        >
          <LinkedInIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
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
    </Stack>
  );
};

export default LogIn;
