import { Box, Typography, Avatar } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        bgcolor: "#E8E8E8",
        padding: "5px 10px",
        borderRadius: "10px",
        marginBottom: 1,
        cursor: "pointer",
        "&:hover": { background: "#c51162", color: "white" },
      }}
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.imageUrl}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          marginLeft: "5px",
        }}
      >
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: "500",
            textTransform: "uppercase",
          }}
        >
          {user.username}
        </Typography>
        <Typography variant="caption">
          <b>Email : </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
