import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
