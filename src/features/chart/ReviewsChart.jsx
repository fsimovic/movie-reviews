import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import tmdbApi from "../../api/movieDbApi";
import CustomTooltip from "./CustomTooltip";
import {
  Brush,
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles/reviews-chart.scss";

const ENV_API_KEY = "0b91ae7b96315dc0da25c9f9cfb5ba39";

const fetchActorCasts = async (actorId) => {
  try {
    const response = await tmdbApi.get(
      `/person/${actorId}/movie_credits?api_key=${ENV_API_KEY}&language=en-US`
    );
    return response.data;
  } catch (err) {
    return console.log(err.message);
  }
};

const findRangeMin = (array, propName) => {
  let min = array[0][propName];
  array.forEach((element) => {
    if (element[propName] < min) min = element[propName];
  });
  return Math.floor(min);
};

const findRangeMax = (array, propName) => {
  let max = array[0][propName];
  array.forEach((element) => {
    if (element[propName] > max) max = element[propName];
  });
  return Math.ceil(max);
};

function ReviewsChart({ actorId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchActorCasts(actorId)
      .then((response) =>
        setData(
          response.cast
            .map((movie) => {
              if (movie.vote_count)
                return {
                  releaseYear: new Date(movie.release_date).getFullYear(),
                  voteAverage: movie.vote_average,
                  movieId: movie.id,
                };
            })
            .filter((movie) => movie)
        )
      )
      .catch(() => setData([]));
  }, [actorId]);

  return (
    !!data.length && (
      <div className="chart-container">
        <ScatterChart
          width={500}
          height={400}
          margin={{
            top: 20,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="releaseYear"
            name="Movie release year"
            domain={[
              findRangeMin(data, "releaseYear") - 10,
              findRangeMax(data, "releaseYear") + 10,
            ]}
          />
          <YAxis
            type="number"
            dataKey="voteAverage"
            name="Average vote"
            domain={[
              findRangeMin(data, "voteAverage") - 1,
              findRangeMax(data, "voteAverage") + 1,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Movie reviews" data={data} fill="#8884d8" />
          <Brush dataKey="releaseYear" width={10} stroke="#8884d8" />
        </ScatterChart>
      </div>
    )
  );
}

ReviewsChart.propTypes = {
  actorId: PropTypes.string,
};

export default ReviewsChart;
