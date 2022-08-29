import React, { useState } from "react";
import PropTypes from "prop-types";
import tmdbApi from "../../api/movieDbApi";
import isEmpty from "lodash.isempty";
import "./styles/custom-tooltip.scss";

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(
      `/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    return response.data;
  } catch (err) {
    return console.log(err.message);
  }
};

function CustomTooltip({ payload, active }) {
  const [movieDetails, setMovieDetails] = useState({});

  let movieId = active ? payload[0].payload.movieId : "";

  if (active)
    fetchMovieDetails(movieId)
      .then((response) =>
        setMovieDetails({
          title: response.title,
          rating: response.vote_average,
          posterPath: response.poster_path || "",
        })
      )
      .catch(() => setMovieDetails({}));

  return active && !isEmpty(movieDetails) ? (
    <div className="custom-tooltip">
      {movieDetails.posterPath ? (
        <div className="tooltip-image-wraper">
          <img
            className="tooltip-image"
            src={`${
              process.env.REACT_APP_BASE_IMAGE_SCR + movieDetails.posterPath
            }`}
          />
        </div>
      ) : (
        <div className="tooltip-text">{movieDetails.title}</div>
      )}
      <div className="tooltip-text">
        Rating: <strong>{movieDetails.rating}</strong> / 10
      </div>
    </div>
  ) : null;
}

CustomTooltip.propTypes = {
  payload: PropTypes.array,
  active: PropTypes.bool,
};

export default CustomTooltip;
