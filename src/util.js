function toId(str) {
  return str
    .replace(/-/g, '_')
    .replace(/ /g, ' ');
}

function tableName(database, table) {
  return toId(`data_db_${database}_table_${table}`);
}

module.exports = {
  toId,
  tableName,
}
