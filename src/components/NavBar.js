import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  styled,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#800080",
  },
}));

const NavBar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const { user, notification, selectedConversation } = ChatState();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogOutUser = async () => {
    handleCloseUserMenu();
    localStorage.removeItem("userInfo");
    try {
      const config = { headers: { "Content-type": "application/json" } };

      const { data } = await axios.put(
        "/api/user/update",
        { isActive: false, userId: user._id },
        config
      );

      console.log(data);
      navigate("/");
    } catch (error) {}
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <img src="/images/AppFam-logo.png" alt="app logo" height="60px" />
            </Box>
            <Box>
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
              >
                <StyledBadge badgeContent={notification.length} color="info">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="" src={user.imageUrl} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: "45px",
                  "& .css-1hipjnm-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper":
                    {
                      borderRadius: "5px",
                    },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={{ "&:hover": { color: "white" } }}
                >
                  <Typography textAlign="center">My Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleCloseUserMenu}
                  sx={{ "&:hover": { color: "white" } }}
                >
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>
                <MenuItem
                  onClick={handleLogOutUser}
                  sx={{ "&:hover": { color: "white" } }}
                >
                  <Typography textAlign="center">Log out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
