import "../App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Tab, Grid } from "@mui/material";
import LogIn from "../components/authentication/LogIn";
import SignUp from "../components/authentication/SignUp";
import Carousel from "react-material-ui-carousel";

const HomePage = () => {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chat");
  }, [navigate]);

  const images = [
    {
      imgPath: "/images/SuccessStrories_1.png",
    },
    {
      imgPath: "/images/SuccessStrories_2.jpg",
    },
    {
      imgPath: "/images/SuccessStrories_3.jpg",
    },
  ];

  return (
    <Container
      maxWidth="md"
      sx={{
        marginBottom: "80px",
      }}
    >
      <Box>
        <img src="/images/Welcome-Banner.png" alt="" height="200px" />
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} sm={6} md={7} lg={7}>
          <Carousel autoPlay>
            {images.map((img, i) => (
              <img
                key={i}
                src={img.imgPath}
                alt=""
                height={"500px"}
                width={"80%"}
                className="img-homepage"
              />
            ))}
          </Carousel>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          lg={5}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box sx={{ width: "80%", minWidth: "300px" }}>
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <TabList onChange={handleChange}>
                  <Tab label="Log in" value="1" sx={{ width: "50%" }} />
                  <Tab label="Sign up" value="2" sx={{ width: "50%" }} />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ p: 0 }}>
                <LogIn />
              </TabPanel>
              <TabPanel value="2" sx={{ p: 0 }}>
                <SignUp />
              </TabPanel>
            </TabContext>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
