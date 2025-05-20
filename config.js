// config.js
const config = {
  api: {
    ip: '223.194.155.13',
    port: 3000,
  }
};

config.api.base_url = `http://${config.api.ip}:${config.api.port}`;
  
export default config;