const {toId, tableId, componentId, onlyUnique} = require('../util');

function summToLayer(summ, fnName, dbName, id=0) {
  return {
    id: toId(`data_access_${dbName}_${fnName}_${id}`),
    label: `Access ${fnName} ${id}`,
    layer: 'data_access',
    source: componentId(fnName),
    targets: summ.tables.map(t => tableId(dbName, t)).filter(onlyUnique),
    attrs: {
      type: 'DatabaseAccess',
      database: dbName,
      extractor: 'dataAccessFromSQLStatements',
      querytype: summ.type,
      query: summ.query,
    }
  }
}

function extractor(statements, fnName='unknown', dbName='unknown') {
  const relationships = [];
  statements.forEach(statement=> {
    const summ = {
      type: 'OTHER',
      tables: [],
      query: statement,
    };

    function addTable(table) {
      table = table.replace(/[\'"]/, '');
      table = table.replace(/\(.*/, '');
      table = table.replace(/\).*/, '');
      table = table.replace(/\s.*/, '');
      table = table.replace(/.+\./, '');
      // console.log('TABLE ', table);
      if (table.match(/[\(A-Z]/)) {
        // skip
      } else if (table.match(/1/)) {
        // skip
      } else if (table.match(/^\s+$/)) {
        // skip
      } else {
        summ.tables.push(table);
      }
    }

    if (statement.match(/SELECT /i)) {
      summ.type = 'SELECT';
      const matches = statement.match(/FROM ([^\s\(]+)/ig);
      if (matches) {
        // console.log(matches);
        matches.forEach(match=> {
          addTable(match.replace(/FROM /i, ''));
        });
      }

      const joins = statement.match(/JOIN ([^\s\(]+)/ig);
      if (joins) {
        // console.log('JOINS ', joins);
        joins.forEach(match=> {
          addTable(match.replace(/JOIN /i, ''));
        });
      }
    }
    if (statement.match(/UPDATE /i)) {
      if (statement.match(/IN DUPLICATE KEY UPDATE /i)) {
        // skip
      } else {
        summ.type = 'UPDATE';
        let t = statement.replace(/.*UPDATE /i, '');
        addTable(t);
      }
    }

    if (statement.match(/INSERT (IGNORE )?INTO/i)) {
      summ.type = 'INSERT';
      let t = statement.replace(/.*INSERT (IGNORE )?INTO /i, '');
      t = t.replace(/\(.*/, '');
      t = t.replace(/\s.*/, '');
      addTable(t);
    }

    if (statement.match(/DELETE /i)) {
      summ.type = 'DELETE';
      const matches = statement.match(/FROM ([^\s\(]+)/i);
      if (matches) {
        // console.log(matches);
        matches.forEach(match=> {
          addTable(match.replace(/FROM /i, ''));
        });
      }
    }

    if (statement.match(/CREATE TEMPORARY TABLE /i)) {
      summ.type = 'CREATE';
      const matches = statement.match(/CREATE TEMPORARY TABLE ([^\s\(\"]+)/i);
      if (matches) {
        // console.log(matches);
        matches.forEach(match=> {
          let table = match.replace(/CREATE TEMPORARY TABLE /i, '');
          addTable(table);
        });
      }
    }

    if (summ.tables.length !== 0) {
      relationships.push(
        summToLayer(summ, fnName, dbName, relationships.length)
      );
    } else {
    }
  });
  return relationships;
}

module.exports = extractor;

