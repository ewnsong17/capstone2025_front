// config.js
const config = {
  api: {
    ip: '192.168.200.165',
    port: 3000,
  }
};

config.api.base_url = `http://${config.api.ip}:${config.api.port}`;
  
export default config;