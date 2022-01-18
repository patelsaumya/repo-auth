const dbConfig = require('../config/db.config');

module.exports = {
  currentDatabase: dbConfig.authAppMySql,
  webApiPort: 9092
}
