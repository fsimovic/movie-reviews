import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "./style/searchBar.scss";

function SearchBar({ options, loadOptions, handleInputChange }) {
  return (
    <Select
      isClearable
      placeholder="Type your actor..."
      options={options}
      className="search-bar"
      onChange={(newValue, event) => loadOptions(newValue, event.action)}
      onInputChange={(newValue) => handleInputChange(newValue)}
    />
  );
}

SearchBar.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      data: PropTypes.object,
    })
  ),
  loadOptions: PropTypes.func,
  handleInputChange: PropTypes.func,
};

export default SearchBar;
