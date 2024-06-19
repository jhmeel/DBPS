import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface AxiosInstanceConfig extends AxiosRequestConfig {
  baseURL: string;
  headers: Record<string, string>;
}

const axiosInstance = (token?: string | null): AxiosInstance => {
  const config: AxiosInstanceConfig = {
    baseURL: "http://localhost:2000",
    headers: { "Content-Type": "application/json" },
  };

  if (token) {
    config.headers["Authorization"] = `Bearer:${token}`;
  }

  return axios.create(config);
};

export { axiosInstance };

export const errorParser = (error: any): string => {
  const errMsg =
    error?.response?.data?.message ||
    error?.response?.statusText ||
    error?.message;
  if (
    errMsg?.includes("timeout") ||
    errMsg?.includes("Network Error") ||
    errMsg?.includes("timed out")
  ) {
    return "Request timeout. Please Check your network status and try again.";
  } else {
    return errMsg || "An error occurred.";
  }
};
