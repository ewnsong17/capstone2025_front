// api.js
import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.api.base_url,
  withCredentials: true,  // 💡 이게 핵심입니다. 모든 요청에 쿠키 포함
});

export default api;
