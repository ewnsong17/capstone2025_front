// config.js
const config = {
  api: {
    ip: '223.194.128.97',
    port: 3000,
  }
};

config.api.base_url = `http://${config.api.ip}:${config.api.port}`;
  
export default config;