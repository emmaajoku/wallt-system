import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

export function getAxiosClient(
  url: string,
  api_token?: string,
  otherHeaders?: AxiosRequestHeaders,
): AxiosInstance {
  const token: string = api_token || '';
  const header = {
    Authorization: !token ? '' : `Bearer ${token}`,
    ...otherHeaders,
  };
  return axios.create({
    headers: header,
    baseURL: url || '',
  });
}

export function getAxiosClientWithAuthType(
  url: string,
  api_token?: string,
  auth_type = 'Bearer',
  otherHeaders?: AxiosRequestHeaders,
): AxiosInstance {
  const token: string = api_token || '';
  const header = {
    Authorization: !token ? '' : `${auth_type} ${token}`,
    ...otherHeaders,
  };
  return axios.create({
    headers: header,
    baseURL: url || '',
  });
}
