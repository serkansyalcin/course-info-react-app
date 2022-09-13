import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Box, Card, Typography } from "@mui/material";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useParams } from "react-router-dom";
import api from "../helper/api";
import moment from "moment";
const CourseDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const getUserDetails = useCallback(async () => {
    const details = await api("GET", `/single-user/${id}`, {});
    setUser(details.data);
  }, [id]);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const getSports = (sportsData = []) => {
    const sports = Array.from(sportsData)
      .filter((ele) => ele !== "[" && ele !== "]" && ele !== '"')
      .join("")
      .split(",");
    return sports;
  };
  return (
    <Box
      sx={{
        height: "100vh",
      }}
      display="flex"
      justifyContent={"center"}
      alignItems="center"
    >
      <Card
        sx={{
          width: 500,
          paddingX: 2,
          paddingY: 2,
        }}
      >
        <Typography variant="h5" sx={{ px: 5 }} textAlign={"center"}>
          <Link to={"/dashboard/user"} style={{ color: "blue" }}>
            Go Back
          </Link>
        </Typography>
        <Box
          display="flex"
          marginBottom={2}
          alignItems={"center"}
          flexDirection="column"
        >
          <Avatar src={user?.profile_image} sx={{ width: 100, height: 100 }} />
          <Typography sx={{ textTransform: "capitalize", fontSize: 18 }}>
            {user?.name}
          </Typography>
          <Typography sx={{ fontSize: 12 }}>{user?.team}</Typography>
        </Box>
        <Box marginY={1}>
          <Typography fontSize={18} fontWeight={700}>
            About:
          </Typography>
          <Typography>{user?.about}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" marginY={1}>
          <Box display="flex">
            <Typography fontWeight={600}>Gender:</Typography>
            {user?.gender?.toUpperCase() === "M" ? (
              <Typography>
                <ManIcon /> Male
              </Typography>
            ) : (
              <Typography>
                <WomanIcon /> Female
              </Typography>
            )}
          </Box>
          <Box display="flex">
            <Typography fontWeight={600}>Location:</Typography>
            <Typography>
              {" "}
              <LocationOnIcon /> {user?.location}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" marginY={1}>
          <Box display="flex">
            <Typography fontWeight={600}>Date of birth:</Typography>
            <Typography>
              <CalendarMonthIcon /> {moment(user?.dob).format("MMM Do YYYY")}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography fontWeight={600}>Sports:</Typography>
            <Typography>
              <SportsSoccerIcon />{" "}
              {getSports(user?.sports[0]).map((sport) => `${sport} |`)}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default CourseDetails;
