import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash.isempty";
import tmdbApi from "../../api/movieDbApi";
import noImageFound from "../../shared/image-not-found.svg";
import "./style/actor.scss";

const BASE_SRC = "https://image.tmdb.org/t/p/w300";
const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const fetchActorDetails = async (actorId) => {
  try {
    const response = await tmdbApi.get(
      `/person/${actorId}?api_key=${ENV_API_KEY}&language=en-US`
    );
    return response.data;
  } catch (err) {
    return console.log(err.message);
  }
};

function ActorDetails({ actorId, knownFor }) {
  const [actorDetails, setActorDetails] = useState({});

  useEffect(() => {
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
              {knownFor.length ? (
                knownFor.map((movie) => (
                  <li
                    className="details-list-element"
                    key={movie + Math.random()}
                  >
                    {movie}
                  </li>
                ))
              ) : (
                <div>There is no record of this data</div>
              )}
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
