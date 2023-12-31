const db_config = require('../../config/databases/mysqldb.js');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(db_config.DB, db_config.USER, db_config.PASSWORD, {
  host: db_config.HOST,
  dialect: db_config.dialect,
  operatorsAliases: false,

  pool: {
    max: db_config.pool.max,
    min: db_config.pool.min,
    acquire: db_config.pool.acquire,
    idle: db_config.pool.idle,
  }
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', { context: error });
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./userModel.js')(sequelize, DataTypes);
db.user_notes = require('./userNotesModel.js')(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log('DB synced successfully.');
});

module.exports = db;