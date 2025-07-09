import axios from "axios";

const debug = process.env.VUE_APP_NODE_ENV !== "production";

const baseURL = debug
  ? "http://localhost:5000/api/v1/"
  : "http://localhost:5000/api/v1/"; // production/deployed api url

let api = axios.create({ baseURL });

export function setCommonAuthHeader(token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function deleteCommonAuthHeader() {
  delete api.defaults.headers.common["Authorization"];
}

export default api;