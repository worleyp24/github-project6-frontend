import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FormControl,
  Stack,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Input,
  Avatar,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { LoadingButton } from "@mui/lab";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState({ status: false, message: null });

  const navigate = useNavigate();

  const handleClose = () => {
    setError({ ...error, status: false });
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

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      setError({ status: true, message: "Please enter all required fields." });
      return;
    }

    const EMAIL_REGEX =
      /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/;
    // const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    // const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const validateEmail = EMAIL_REGEX.test(email);
    // const validatePassword = PWD_REGEX.test(password);

    if (!validateEmail) {
      setError({ status: true, message: "Email format is not valid." });
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(
        "/api/user",
        { username, email, password, image },
        config
      );

      // Check if user already exist
      if (!data.status) {
        setError({ status: true, message: "Email already exisit." });
        return;
      }

      // Check if password match
      if (password !== confirmPassword) {
        setError({ status: true, message: "Passwords does not match." });
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUploading(false);
      navigate("/chat");
    } catch (error) {
      console.log(error);
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
      <h2>Create an account now!</h2>
      <div id="avatar" style={{ display: "flex", justifyContent: "center" }}>
        <Input
          style={{ display: "none" }}
          id="contained-button-file"
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
        <label htmlFor="contained-button-file">
          <Avatar
            src={image}
            sx={{ width: 100, height: 100, cursor: "pointer" }}
          ></Avatar>
        </label>
      </div>
      <FormControl id="name">
        <TextField
          size="small"
          placeholder="Please enter your name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="email">
        <TextField
          type={"email"}
          size="small"
          placeholder="Please enter your email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AlternateEmailIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <TextField
          size="small"
          type={"password"}
          placeholder="Please enter your password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="confirm-password">
        <TextField
          size="small"
          type={"password"}
          placeholder="Confirm your password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockRoundedIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <LoadingButton
        variant="contained"
        onClick={handleSignUp}
        loading={uploading}
      >
        Sign up
      </LoadingButton>

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

export default SignUp;
