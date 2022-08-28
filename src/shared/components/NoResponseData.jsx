import React from "react";
import PropTypes from "prop-types";
import sadFaceSvg from "../sad-face.svg";
import "../styles/shared.scss";

function NoResponseData({ content }) {
  return (
    <div className="error-container">
      <img className="sad-face-image" src={sadFaceSvg} />
      <h3 className="error-message">{content}</h3>
    </div>
  );
}

NoResponseData.propTypes = {
  content: PropTypes.string,
};

export default NoResponseData;
