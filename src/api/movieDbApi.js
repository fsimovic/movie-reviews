import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

export default setupCache(
  axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {},
  }),
  { ttl: 1000 * 60 * 2 }
);
