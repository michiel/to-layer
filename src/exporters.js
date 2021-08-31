
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
            default:
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
            default:
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
