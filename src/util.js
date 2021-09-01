const glob = require('glob');

function toId(str) {
  return str
    .replace(/-/g, '_')
    .replace(/ /g, ' ');
}

function tableId(database, table) {
  return toId(`data_${database}_table_${table}`);
}

function componentId(str) {
  return toId(`component_${str}`);
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
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

function buildTableVariationsFromCamelCase(str) {
  const vars = [];

  let variation = str.toLowerCase();
  vars.push(variation);

  variation = str;
  vars.push(variation);

  variation = variation.replace(/([A-Z])/g, '_$1').replace(/^_/, '');
  vars.push(variation);

  variation = variation.replace(/^./, function(str){ return str.toUpperCase(); })
  vars.push(variation);

  variation = variation.toLowerCase();
  vars.push(variation);

  return vars;
}

async function extractAll(path, extension, fileExtractor) {
  return new Promise((resolve, reject)=> {
    const res = {};
    glob(`${path}/**/*.${extension}`, {}, function(err, files) {
      files.forEach(file=> {
        // console.log(file);
        try {
          res[file] = fileExtractor(file);
        } catch(e) {
          console.error(`Unable to process file ${file} : ${e}`);
        }
      });
      resolve(res);
    });
  });
}


module.exports = {
  toId,
  tableId,
  mergeElements,
  buildTableVariationsFromCamelCase,
  extractAll,
  onlyUnique,
  componentId,
}
