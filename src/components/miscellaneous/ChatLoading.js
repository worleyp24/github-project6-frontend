import React from "react";
import { Stack, Skeleton } from "@mui/material";

const ChatLoading = () => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={45} />
      <Skeleton variant="rectangular" width={"100%"} height={35} />
    </Stack>
  );
};

export default ChatLoading;
