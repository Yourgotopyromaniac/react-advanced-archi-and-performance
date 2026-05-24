import type { AxiosRequestConfig } from "axios";
import { api } from "@/lib/axios";

export const getRequest = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const response = await api.get<TResponse>(url, config);
  return response.data;
};

export const postRequest = async <TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
) => {
  const response = await api.post<TResponse>(url, body, config);
  return response.data;
};

export const putRequest = async <TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
) => {
  const response = await api.put<TResponse>(url, body, config);
  return response.data;
};

export const patchRequest = async <TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
) => {
  const response = await api.patch<TResponse>(url, body, config);
  return response.data;
};

export const deleteRequest = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const response = await api.delete<TResponse>(url, config);
  return response.data;
};
