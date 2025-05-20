const mongoose = require('mongoose');
const { mongoDB } = require('../../config');

const Sequelize = require('sequelize');
const path = require('path');
const fs = require('fs');
const basename = path.basename(__filename);

const { mysql } = require('../../config');

const sequelizeInstances = {};

mongoose.connect(
  `mongodb://${ mongoDB.hostname }:${ mongoDB.port }/${ mongoDB.database }`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(error => {
    console.log('Cannot Connect To Mongo Database!', error);
  });

const db = {};

sequelizeInstances['default'] = new Sequelize(mysql.default.database, mysql.default.username, mysql.default.password, {
  host: mysql.default.host,
  port: mysql.default.port,
  dialect: mysql.default.dialect,
  logging: false,
  timezone: mysql.default.timezone,
  dialectOptions: { dateStrings: true },
  pool: {
    ...mysql.default.pool,
    acquire: 30000,
    idle: 10000,
    evict: 10000
  }
});

sequelizeInstances['dwh'] = new Sequelize(mysql.dwh.database, mysql.dwh.username, mysql.dwh.password, {
  host: mysql.dwh.host,
  port: mysql.dwh.port,
  dialect: mysql.dwh.dialect,
  logging: false,
  timezone: mysql.dwh.timezone,
  dialectOptions: { dateStrings: true },
  pool: {
    ...mysql.dwh.pool,
    acquire: 30000,
    idle: 10000,
    evict: 10000
  }
})


const loadModels = (sequelize, dir) => {
  const db = {};

  fs.readdirSync(dir)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
      const model = require(path.join(dir, file))(sequelize, Sequelize);
      db[model.name] = model;
    });

  db.sequelize = sequelize;
  return db;
};


const dbConnections = {
  default: loadModels(sequelizeInstances.default, path.join(__dirname, 'SQL/default')),
  dwh: loadModels(sequelizeInstances.dwh, path.join(__dirname, 'SQL/DWH'))
};


const AgentJournal = require('./Mongo/agent-journal');
const Interactions = require('./Mongo/interactions');
const Messages = require('./Mongo/messages');
const PresenceJournal = require('./Mongo/presence-journal');
const BiAttributes = require('./Mongo/BiAttributes');
const BiDashboards = require('./Mongo/biDashboards')
const BiSections = require('./Mongo/biSections')

module.exports = {
  dbConnections,
  sequelizeInstances,
  AgentJournal,
  Messages,
  Interactions,
  PresenceJournal,
  db,
  BiAttributes,
  BiDashboards,
  BiSections
}