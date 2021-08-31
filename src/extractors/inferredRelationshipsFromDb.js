const knex = require('knex');
const schemaInspector = require('knex-schema-inspector').default;

const {toId, tableId} = require('../util');

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
  const columns = await inspector.columns();
  const databaseName = knexParams.connection.database;

  let res = [];
  const regex = /._?id$/i;
  const regexReplace = /_?id$/i;

  function matchTable(str) {
    let variation = str.toLowerCase();
    if (tables.indexOf(variation) > -1) {
      return variation;
    }
    variation = str;
    if (tables.indexOf(variation) > -1) {
      return variation;
    }
    variation = variation.replace(/([A-Z])/g, '_$1');
    if (tables.indexOf(variation) > -1) {
      return variation;
    }
    variation = variation.replace(/^./, function(str){ return str.toUpperCase(); })
    if (tables.indexOf(variation) > -1) {
      return variation;
    }
    variation = variation.toLowerCase();
    if (tables.indexOf(variation) > -1) {
      return variation;
    }

  }

  columns.forEach(el=> {
    if (el.column.match(regex)) {
      let table = el.column.replace(regexReplace, '');
      let tableMatch = matchTable(table);
      if (tableMatch) {
        res.push({
          id: toId(`data_link_${databaseName}_${el.column}`),
          label: `${el.column}`,
          layer: 'data_link',
          nodes: [
            tableId(databaseName, tableMatch),
            tableId(databaseName, el.table),
          ],
          attrs: {
            type: 'DatabaseRelationship',
            database: databaseName,
            extractor: 'inferredRelationshipsFromDb',
          }
        });
      } else {
        res.push({
          id: toId(`data_link_${databaseName}_${el.column}`),
          label: `${el.column}`,
          layer: 'data_link',
          nodes: [
            tableId(databaseName, table),
            toId('unknown-relationship'),
          ],
          attrs: {
            type: 'DatabaseRelationship',
            database: databaseName,
            extractor: 'inferredRelationshipsFromDb',
          }
        });
      }
    }

  });

  return res;
}

module.exports = extractor;

