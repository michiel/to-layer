
function toGML(arr) {
  let output = [];
  output.push(`
graph [
    id 0
    label "Graph"
    `);

  arr.forEach(el=> {
    let str = '';
    switch(el.layer) {
      case 'data':
      case 'compute':
        str = `
    node [
        id ${el.id}
        label "${el.label}"
    `;
        str += `
        layer ${el.layer}
`;

        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `        ${k} ${v}`;
        });
        str += `
    ]`;
        output.push(str);

        break;



      case 'data_link':
        str = `
    edge [
        id ${el.id}
        label "${el.label}"
        source ${el.nodes[0]}
        target ${el.nodes[1]}
`;
        str += `
        layer ${el.layer}`;

        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `        ${k} ${v}`;
        });
        str += `
    ]`;
        output.push(str);



      case 'data_access':
        el.targets.forEach((target, idx) => {
          str = `
    edge [
        id ${el.id}_${idx}
        label "${el.label}"
        source ${el.source}
        target ${target}
`;
          str += `
        layer ${el.layer}`;

          Object.entries(el.attrs).forEach(([k, v])=> {
            str += `        ${k} ${v}`;
          });
          str += `
    ]`;
          output.push(str);

        });


      default:
        throw new Error('Unhandled case ' + el.layer);
        break;
    }
  });
  output.push(`
]
`);
  return output.join('\n');
}

function toGMLExpanded(arr) {
  let output = [];
  output.push(`
graph [
    id 0
    label "Graph"
    `);

  arr.forEach(el=> {
    let str = '';
    switch(el.layer) {
      case 'data':
      case 'compute':
        str = `
    node [
        id ${el.id}
        label "${el.label}"
    `;
        str += `
        layer ${el.layer}
`;

        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);

        break;


      case 'data_link':
        str = `
    node [
        id ${el.id}
        label "${el.label}"
    `;
        str += `
        layer ${el.layer}
`;

        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);
        str = `
    edge [
        id ${el.id}_1
        source ${el.nodes[0]}
        target ${el.id}
        `;
        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);
        str = `
    edge [
        id ${el.id}_2
        source ${el.id}
        target ${el.nodes[1]}
        `;
        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);

        break;



      case 'data_access':
        str = `
    node [
        id ${el.id}
        label "${el.label}"
    `;
        str += `
        layer ${el.layer}
`;

        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);

        str = `
    edge [
        id ${el.id}_${el.source}
        source ${el.source}
        target ${el.id}
        `;
        Object.entries(el.attrs).forEach(([k, v])=> {
          str += `
        ${k} "${v}"`;
        });
        str += `
    ]`;
        output.push(str);

        el.targets.forEach((target, idx)=> {
          str = `
    edge [
        id ${el.id}_${target}
        source ${el.id}
        target ${target}
        `;
          Object.entries(el.attrs).forEach(([k, v])=> {
            str += `
        ${k} "${v}"`;
          });
          str += `
    ]`;
          output.push(str);
        });

        break;

      default:
        throw new Error('Unhandled case ' + el.layer);
        break;
    }
  });
  output.push(`
]
`);
  return output.join('\n');
}

module.exports = {
  toGML,
  toGMLExpanded,
};
