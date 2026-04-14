import { apiCall } from "./utils";

export type ApiRequestOptions = RequestInit;

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}) {
  return apiCall<T>(endpoint, options);
}

export { apiCall };
