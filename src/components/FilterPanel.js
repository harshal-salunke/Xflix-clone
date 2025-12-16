import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { ReleaseDate, AllGenreParameter } from "../constants/constants";
import "./FilterPanel.css";

/**
 * Future proof order – easy to extend later
 */
const CONTENT_RATING_ORDER = ["7+", "12+", "16+", "18+"];

const FilterPanel = ({
  videoLists,
  genreFilterHandler,
  handleSorting,
  ageGroupFilterHandler,
}) => {
  const [sortParameter, setSortParameter] = useState(ReleaseDate);
  const [selectedGenre, setSelectedGenre] = useState(AllGenreParameter);
  const [selectedRating, setSelectedRating] = useState("Anyone");

  /**
   * Genres – derived from videos
   */
  const genreList = useMemo(() => {
    return [...new Set(videoLists.map((v) => v.genre))];
  }, [videoLists]);

  /**
   * Content ratings – sorted properly (ascending)
   */
  const ratingList = useMemo(() => {
    return [...new Set(videoLists.map((v) => v.contentRating))]
      .filter((r) => r !== "Anyone")
      .sort(
        (a, b) =>
          CONTENT_RATING_ORDER.indexOf(a) -
          CONTENT_RATING_ORDER.indexOf(b)
      );
  }, [videoLists]);

  /**
   * Genre handlers
   */
  const handleAllGenreClick = () => {
    setSelectedGenre(AllGenreParameter);
    genreFilterHandler(AllGenreParameter);
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    genreFilterHandler(genre);
  };

  /**
   * Rating handlers
   */
  const handleAnyAgeGroup = () => {
    setSelectedRating("Anyone");
    ageGroupFilterHandler("Anyone");
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    ageGroupFilterHandler(rating);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#222222",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      {/* ================= GENRE + SORT ================= */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          width: {
            xs: "100%",
            sm: "90%",
            md: "55%",
          },
          marginTop: "10px",
        }}
      >

        {/* All Genre */}
        <button
          className={
            selectedGenre === AllGenreParameter
              ? "genre-btn-selected"
              : "genre-btn"
          }
          onClick={handleAllGenreClick}
        >
          All Genre
        </button>

        {/* Genre buttons */}
        {genreList.map((genre) => (
          <button
            key={genre}
            className={
              selectedGenre === genre
                ? "genre-btn-selected"
                : "genre-btn"
            }
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}

        {/* Sort */}
        <select
          value={sortParameter}
          onChange={(e) => {
            setSortParameter(e.target.value);
            handleSorting(e.target.value);
          }}
          className="sort-select"
        >
          <option value="releaseDate">Release Date</option>
          <option value="viewCount">View Count</option>
        </select>
      </Box>

      {/* ================= CONTENT RATING ================= */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          width: {
            xs: "100%",
            sm: "90%",
            md: "50%",
          },
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >

        {/* Any Age Group */}
        <button
          className={
            selectedRating === "Anyone"
              ? "content-rating-btn-selected"
              : "content-rating-btn"
          }
          onClick={handleAnyAgeGroup}
        >
          Any age group
        </button>

        {/* Rating buttons */}
        {ratingList.map((rating) => (
          <button
            key={rating}
            className={
              selectedRating === rating
                ? "content-rating-btn-selected"
                : "content-rating-btn"
            }
            onClick={() => handleRatingClick(rating)}
          >
            {rating}
          </button>
        ))}
      </Box>
    </Box>
  );
};

export default FilterPanel;
