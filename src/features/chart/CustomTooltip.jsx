import React, { useState } from "react";
import PropTypes from "prop-types";
import tmdbApi from "../../api/movieDbApi";
import isEmpty from "lodash.isempty";
import "./styles/custom-tooltip.scss";

const BASE_SRC = "https://image.tmdb.org/t/p/w300";
const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const fetchMovieDetails = (movieId) => {
  return tmdbApi
    .get(`/movie/${movieId}?api_key=${ENV_API_KEY}&language=en-US`)
    .then((response) => response.data)
    .catch((err) => console.log(err.message));
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
            src={`${BASE_SRC + movieDetails.posterPath}`}
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
