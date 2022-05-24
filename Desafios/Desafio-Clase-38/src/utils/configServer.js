const os = require('os');

module.exports = {
  numeroCPUs: os.cpus().length,
  PORT: parseInt(process.argv[2]) || 8080,
  modoCluster: process.argv[3] == 'CLUSTER',
};
