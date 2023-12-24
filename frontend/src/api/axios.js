import axios from 'axios';

const baseURL = process.env.REACT_APP_BASEURL || 'https://itra4-back.onrender.com';
export default axios.create({
  baseURL
});
export const axiosPrivate = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
