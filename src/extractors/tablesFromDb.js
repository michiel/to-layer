const knex = require('knex');
const schemaInspector = require('knex-schema-inspector').default;

const {toId, tableName} = require('../util');

/*
{
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'myapp_test',
    charset: 'utf8',
  },
}
*/

async function extractor(knexParams) {

  const database = knex(knexParams);
  const inspector = schemaInspector(database);

  const tables = await inspector.tables();
  const databaseName = knexParams.connection.database;

  return tables.map(table=> {
    return {
      id: tableName(databaseName, table),
      label: `Table ${table}`,
      layer: 'data',
      attrs: {
        database: databaseName,
      }
    }
  });
}

module.exports = extractor;
