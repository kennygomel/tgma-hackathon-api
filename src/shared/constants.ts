import { AxiosRequestConfig } from "axios";

export const NONAME_CARDS_API_URL = "https://sandbox.noname.rest/api";

export const NONAME_CARDS_AXIOS_CONFIG: AxiosRequestConfig = {
  headers: {
    accept: "application/json",
    "x-api-key": process.env.NONAME_CARDS_API_KEY,
  },
};
