import React, { useEffect, useState } from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import { Button } from 'beautiful-react-ui';
import './styles.css';

const initialSchema = createSchema({
  nodes: [],
  links: [],
});

const CustomRender = ({ id, content, data, inputs, outputs }) => (
  <div style={{ background: 'purple', width: '100px' }}>
    <div style={{ textAlign: 'right' }}>
      <Button id={id} icon="times" size="small" className="btn" />
    </div>
    <div role="button" style={{ padding: '15px' }}>
      {content}
    </div>
    <div
      style={{
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {inputs.map((port) =>
        React.cloneElement(port, {
          style: { width: '5px', height: '5px', background: '#1B263B' },
        })
      )}
    </div>
  </div>
);

export default function App() {
  const [tables, setTables] = useState([
    {
      title: 'T1',
      attr: ['A11', 'A12', 'A13'],
      visible: true,
    },
    {
      title: 'T2',
      attr: ['A21', 'A22', 'A23'],
      visible: true,
    },
    {
      title: 'T3',
      attr: ['A31', 'A32', 'A33'],
      visible: true,
    },
    {
      title: 'T4',
      attr: ['A41', 'A42', 'A43'],
      visible: true,
    },
  ]);

  const [schema, { onChange }] = useSchema(initialSchema);

  useEffect(() => {
    console.log('useEffect');
    let newlinks = schema.links;
    onChange({ ...schema, links: newlinks });
    console.log(schema);
  }, [schema.links, onChange]);

  const deleteNodeFromSchema = (id) => {
    if (id === undefined || id.length === 0) return;

    const nodeToRemove = schema.nodes.find((node) => node.id === id);
    if (nodeToRemove === undefined) return;

    const temp = tables.find((table) => table.title === nodeToRemove.content);

    if (temp.visible === true) return;

    let newTables = tables.map((table) => {
      if (table.title === nodeToRemove.content) {
        table.visible = true;
      }
      return table;
    });

    const arr = nodeToRemove.inputs.map((obj) => obj.id);
    let links = schema.links.filter(
      (obj) =>
        arr.includes(obj.input) === false && arr.includes(obj.output) === false
    );

    let nodes = schema.nodes.filter((node) => node.id !== id);

    onChange({ nodes, links });

    setTables(newTables);
  };

  const addNewNode = (title) => {
    const nextNode = {
      id: `Id:${title}`,
      content: `${title}`,
      coordinates: [0, 0],
      render: CustomRender,
      data: { onClick: deleteNodeFromSchema },
      inputs: [{ id: `${Math.random()}` }],
      // outputs: [{ id: `${Math.random()}` }],
    };
    let nodes = schema.nodes;
    nodes.push(nextNode);
    onChange({ ...schema, nodes });
  };

  let tableTitles = tables.map((table) => {
    if (table.visible === true)
      return (
        <div id={table.title} className="true">
          {table.title}
        </div>
      );
    return (
      <div id={table.title} className="false">
        {table.title}
      </div>
    );
  });
  const handleClick = (tableTitle) => {
    let newTable = tables.find((table) => tableTitle === table.title);
    if (!newTable || newTable.visible === false) return;

    const newTables = tables.map((table) => {
      if (table.title === tableTitle) {
        table.visible = false;
      }
      return table;
    });
    setTables(newTables);
    addNewNode(tableTitle);
  };

  return (
    <div className="App" onClick={(e) => deleteNodeFromSchema(e.target.id)}>
      <div
        className="tableTitles"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e.target.id);
        }}
      >
        <div style={{ backgroundColor: '#eefbfb', padding: '5px' }}>
          Table Tiles
        </div>
        <div>{tableTitles}</div>
      </div>
      <div className="diagram">
        <Diagram schema={schema} onChange={onChange} />
      </div>
    </div>
  );
}
