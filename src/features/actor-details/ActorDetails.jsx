import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash.isempty";
import tmdbApi from "../../api/movieDbApi";
import noImageFound from "../../image-not-found.svg";
import "./style/actor.scss";

const BASE_SRC = "https://image.tmdb.org/t/p/w300";
const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// const fetchActorCasts = (actorId) => {
//   return tmdbApi
//     .get(
//       `/person/${actorId}/movie_credits?api_key=${ENV_API_KEY}&language=en-US`
//     )
//     .then((response) => response.data)
//     .catch((err) => console.log(err.message));
// };

const fetchActorDetails = (actorId) => {
  return tmdbApi
    .get(`/person/${actorId}?api_key=${ENV_API_KEY}&language=en-US`)
    .then((response) => response.data)
    .catch((err) => console.log(err.message));
};

function ActorDetails({ actorId, knownFor }) {
  // const [actorCasts, setActorCasts] = useState([]);
  const [actorDetails, setActorDetails] = useState({});

  useEffect(() => {
    // fetchActorCasts(actorId)
    //   .then((response) =>
    //     setActorCasts([...response.cast.map((cast) => cast.title)])
    //   )
    //   .catch((err) => console.log(err));
    fetchActorDetails(actorId).then((response) =>
      setActorDetails({
        name: response.name || "Unknown",
        birthday: response.birthday
          ? new Date(response.birthday).toLocaleDateString("en-US", dateOptions)
          : "Unknown",
        placeOfBirth: response.place_of_birth || "Unknown",
        popularity: response.popularity || "Unknown",
        profilePath: response.profile_path || "",
      })
    );
  }, [actorId]);

  return (
    <div className="details-container">
      <div className="image-wrap">
        <img
          className="actor-image"
          src={`${
            actorDetails?.profilePath
              ? BASE_SRC + actorDetails.profilePath
              : noImageFound
          }`}
          alt={actorDetails?.name}
        />
      </div>
      {!isEmpty(actorDetails) && (
        <div className="details-text">
          <div className="details-row">
            Name: {<strong>{actorDetails.name}</strong>}
          </div>
          <div className="details-row">
            Date of birth: {actorDetails.birthday}
          </div>
          <div className="details-row">
            Place of birth: {actorDetails.placeOfBirth}
          </div>
          <div className="details-row">
            Popularity: {<strong>{actorDetails.popularity}</strong>}
          </div>
          <div className="details-row">
            Known for:
            <ul className="details-list">
              {!!knownFor.length &&
                knownFor.map((movie) => (
                  <li className="details-list-element" key={movie}>
                    {movie}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

ActorDetails.propTypes = {
  actorId: PropTypes.string,
  knownFor: PropTypes.arrayOf(PropTypes.string),
};

export default ActorDetails;
