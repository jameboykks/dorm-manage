import { Umzug, SequelizeStorage } from 'umzug';
import sequelize from './database.js';
import path from 'path';

const umzug = new Umzug({
  migrations: {
    glob: ['../migrations/*.ts', { cwd: __dirname }],
  },
  storage: new SequelizeStorage({ sequelize }),
  context: sequelize.getQueryInterface(),
  logger: console,
});

export default umzug; 