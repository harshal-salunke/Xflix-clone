import React, { useEffect, useCallback, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { useSnackbar } from "notistack";
import axios from "axios";
import moment from "moment";
import { config } from "../App";
import "./VideoDetails.css";

const VideoDetails = () => {
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { videos } = location.state;
  const {
    id,
    releaseDate,
    title,
    videoLink,
    genre,
    contentRating,
    viewCount,
    votes,
  } = videos;

  const [upVotes, setUpVotes] = useState(
  Math.max(0, Number(votes?.upVotes || 0))
  );
  const [downVotes, setDownVotes] = useState(
    Math.max(0, Math.abs(Number(votes?.downVotes || 0)))
  );

  const [views, setViews] = useState(Number(viewCount || 0));

  const updateViewHandler = useCallback(async () => {
  setViews((prev) => prev + 1);

  try {
    await axios.patch(`${config.endpoint}/videos/${id}/views`);
  } catch (err) {
    //API fail hui to rollback
    setViews((prev) => prev - 1);

    const { response } = err;
    enqueueSnackbar(
      response?.data?.message || "Failed to update views",
      { variant: "error" }
    );
    }
  }, [id, enqueueSnackbar]);
  

  useEffect(() => {
  const viewed = sessionStorage.getItem(`viewed_${id}`);

  if (!viewed) {
    sessionStorage.setItem(`viewed_${id}`, "true");
    updateViewHandler(); 
  }
}, [id, updateViewHandler]);



    const voteHandler = async (vote, change) => {
      if (vote === "upVote") {
        setUpVotes((prev) => prev + 1);
      }

      if (vote === "downVote") {
        setDownVotes((prev) => prev + 1);
      }

      try {
        await axios.patch(`${config.endpoint}/videos/${id}/votes`, {
          vote,
          change,
        });
      } catch (err) {
        if (vote === "upVote") {
          setUpVotes((prev) => prev - 1);
        }
        if (vote === "downVote") {
          setDownVotes((prev) => prev - 1);
        }

        enqueueSnackbar("Something went wrong!", { variant: "error" });
      }
  };


  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#222222",
          marginBottom: "20px",
          cursor: "pointer",
        }}
        onClick={() => history.push("/")}
      >
        <Typography>
          <span className="x-red">X</span>
          <span className="xflix">Flix</span>
        </Typography>
      </Box>
      <Container>
        <Card className="video-tile" id={id}>
          <iframe
            sandbox="allow-same-origin allow-forms allow-scripts"
            src={`https://www.${videoLink}`}
            width="100%"
            height="523px"
            title="video-player"
          />
          <CardContent className="video-content">
            <Typography className="video-title">{title}</Typography>
            <Box className="video-votes-section">
              <Box
                className="vote-item"
                onClick={() => voteHandler("upVote", "increase")}
              >
                <ThumbUpAltOutlinedIcon />
                <span>{upVotes}</span>
              </Box>

              <Box
                className="vote-item"
                onClick={() => voteHandler("downVote", "decrease")}
              >
                <ThumbDownAltOutlinedIcon />
                <span>{downVotes}</span>
              </Box>
            </Box>
            <Typography className="video-release-date">
              <Box>
                {contentRating} <span className="video-dot"></span>{" "}
                {moment(releaseDate).fromNow()}
              </Box>
            </Typography>
            <Typography className="video-view-section">
              <Box className="video-genre">{genre}</Box>
              <Box>
                <span className="video-count">{views}</span>
                <span className="video-view-icon">{<VisibilityIcon />}</span>
              </Box>
            </Typography>
          </CardContent>
        </Card>
        {/* <hr />
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", flexWrap: "wrap", marginTop: "30px" }}
        >
          {slicedVideoList && slicedVideoList.length ? (
            slicedVideoList.map((item) => {
              return (
                <Grid item xs={6} md={3} key={item.id}>
                  <VideoCard
                    videos={item}
                    videoList={videoList}
                    fromVideoDetails={false}
                  />
                </Grid>
              );
            })
          ) : (
            <></>
          )}
        </Grid> */}
      </Container>
    </>
  );
};

export default VideoDetails;
