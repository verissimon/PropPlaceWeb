import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.API_URL,
});

export const IMAGE_API_URL = `${import.meta.env.API_URL}/images/`;
