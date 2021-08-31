function toId(str) {
  return str
    .replace(/-/g, '_')
    .replace(/ /g, ' ');
}

function tableId(database, table) {
  return toId(`data_${database}_table_${table}`);
}

function mergeElements(arr) {
  const allIds = arr.map(el=> el.id);
  const uniqueIds = new Set(allIds);
  const duplicates = new Set(allIds.filter(el => {
    if (uniqueIds.has(el.id)) {
      uniqueIds.delete(el.id);
      return false;
    } else {
      return true;
    }
  }));

  const res = [];

  const completed = new Set();
  arr.forEach(el=> {
    if (!duplicates.has(el.id)) {
      res.push(el);
    } else if (!completed.has(el.id)) {
      const dups = arr.filter(e => e.id === el.id);
      const merged = dups.reduce((acc, curr)=> {
        return {
          ...acc,
          ...curr,
          attrs: {
            ...acc.attrs,
            ...curr.attrs
          },
        };
      }, { attrs: {}});
      res.push(merged);
    }
    completed.add(el.id);
  });

  return res;

}

module.exports = {
  toId,
  tableId,
  mergeElements,
}
