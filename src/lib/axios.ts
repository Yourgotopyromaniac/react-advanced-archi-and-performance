import axios from "axios";
import { env } from "./env";
import { toApiError } from "./api-error";

export const api = axios.create({
  baseURL: env.tmdbBaseUrl,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${env.tmdbToken}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);
