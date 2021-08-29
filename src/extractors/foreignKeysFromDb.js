const knex = require('knex');
const schemaInspector = require('knex-schema-inspector');

const {toId, tableName} = require('../utils');

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

  const foreignKeys = await inspector.foreignKeys();
  const databaseName = knexParams.database;

  return foreignKeys.map(fk=> {
    return {
      id: toId(`data_rel_${fk.constraint_name}`),
      label: `Foreign Key ${fk.constraint_name}`,
      layer: 'data_relationship',
      nodes: [
        tableName(databaseName, f.table),
        tableName(databaseName, f.foreign_key_table),
      ],
      attrs: {
        type: 'Foreign key',
        database: databaseName,
      }
    }
  });
}

module.exports = extractor;
