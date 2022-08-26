import React, { useState } from "react";
import SearchBar from "./features/search-bar/SearchBar";
import tmdbApi from "./api/movieDbApi";
import "./app.scss";

const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const EVENT = {
  selected: "select-option",
  cleared: "clear",
};

const fetchActors = (query) => {
  return tmdbApi
    .get(
      `/search/person?api_key=${ENV_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=1`
    )
    .then((result) => result.data)
    .catch((err) => console.log(err.message));
};

function App() {
  const [options, setOptions] = useState([]);

  function handleLoad(query, action) {}

  function handleInputChange(query) {
    if (query) {
      fetchActors(query)
        .then((response) => {
          const actorsAsOptions = response.results.map((actor) => {
            return {
              value: String(actor.id),
              label: actor.name,
            };
          });
          setOptions([...actorsAsOptions]);
        })
        .catch((err) => setOptions([]));
    } else setOptions([]);
  }

  return (
    <div className="app">
      <SearchBar
        options={options}
        loadOptions={handleLoad}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}

export default App;
