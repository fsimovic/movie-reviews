import React, { useState } from "react";
import SearchBar from "./features/search-bar/SearchBar";
import ActorDetails from "./features/actor-details/ActorDetails";
import ReviewsChart from "./features/chart/ReviewsChart";
import NoResponseData from "./shared/components/NoResponseData";
import tmdbApi from "./api/movieDbApi";
import "./app.scss";

const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const EVENT = {
  selected: "select-option",
  cleared: "clear",
};

const fetchActors = async (query) => {
  try {
    const result = await tmdbApi.get(
      `/search/person?api_key=${ENV_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1`
    );
    return result.data;
  } catch (err) {
    return console.log(err.message);
  }
};

function App() {
  const [options, setOptions] = useState([]);
  const [knownFor, setKnownFor] = useState([]);
  const [actorId, setActorId] = useState("");
  const [initialState, setInitialState] = useState(true);

  function handleLoad(selectedOption, action) {
    if (action === EVENT.selected) {
      setKnownFor(selectedOption.knownFor.map((movie) => movie.original_title));
      setActorId(selectedOption.value);
      setInitialState(false);
    }
    if (action === EVENT.cleared) setInitialState(true);
  }

  function handleInputChange(query) {
    if (query) {
      fetchActors(query)
        .then((response) => {
          const actorsAsOptions = response.results.map((actor) => {
            return {
              value: String(actor.id),
              label: actor.name,
              knownFor: actor.known_for,
            };
          });
          setOptions([...actorsAsOptions]);
        })
        .catch(() => setOptions([]));
    } else setOptions([]);
  }

  function detailsComponent() {
    const content =
      "Unfortunately, there is no information about the requested choice, try another choice.";
    return knownFor.length ? (
      <ActorDetails actorId={String(actorId)} knownFor={knownFor} />
    ) : (
      knownFor != null && <NoResponseData content={content} />
    );
  }

  function chartComponent() {
    const content =
      "Unfortunately, there is no information in the database about movies related to the selected choice, try another choice.";
    return actorId ? (
      <ReviewsChart actorId={actorId} />
    ) : (
      !!knownFor.length && <NoResponseData content={content} />
    );
  }

  return (
    <div className="app">
      <SearchBar
        options={options}
        loadOptions={handleLoad}
        handleInputChange={handleInputChange}
      />
      {!initialState && detailsComponent()}
      {!initialState && chartComponent()}
    </div>
  );
}

export default App;
