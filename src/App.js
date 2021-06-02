import React, { useState } from 'react';
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import { Button } from 'beautiful-react-ui';
import css from './styles.module.css';

const initialSchema = createSchema({
  nodes: [],
  links: [],
});

const CustomRender = ({ id, content, data, inputs, outputs }) => (
  <div style={{ background: 'purple', width: '100px' }}>
    <div style={{ textAlign: 'right' }}>
      <Button
        id={id}
        icon="times"
        size="small"
        className={css.btn}
        onClick={(e) => console.log(e.target)}
      />
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
          style: { width: '25px', height: '25px', background: '#1B263B' },
        })
      )}
      {outputs.map((port, index) =>
        React.cloneElement(port, {
          style: { width: '25px', height: '25px', background: '#1B263B' },
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

  const deleteNodeFromSchema = (id) => {
    console.log(id);
    if (id === undefined || id.length === 0) return;

    const nodeToRemove = schema.nodes.find((node) => node.id === id);
    if (nodeToRemove === undefined) return;

    const arr = [...nodeToRemove.inputs, ...nodeToRemove.outputs].map(
      (obj) => obj.id
    );
    let links = schema.links.filter(
      (obj) =>
        arr.includes(obj.input) === false && arr.includes(obj.output) === false
    );

    let nodes = schema.nodes.filter((node) => node.id !== id);

    // console.log(nodes, links);

    onChange({ nodes, links });
  };
  const addNewNode = (title) => {
    const nextNode = {
      id: `Id:${title}`,
      content: `${title}`,
      coordinates: [0, 0],
      render: CustomRender,
      data: { onClick: deleteNodeFromSchema },
      inputs: [{ id: `${Math.random()}` }],
      outputs: [{ id: `${Math.random()}` }],
    };
    let nodes = schema.nodes;
    nodes.push(nextNode);
    onChange({ ...schema, nodes });
  };

  let tableTitles = tables.map((table) => {
    if (table.visible === true)
      return (
        <div id={table.title} className={css.true}>
          {table.title}
        </div>
      );
    return (
      <div id={table.title} className={css.false}>
        {table.title}
      </div>
    );
  });
  const handleClick = (tableTitle) => {
    console.log(tableTitle);
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
    <div className={css.App} onClick={(e) => deleteNodeFromSchema(e.target.id)}>
      {/* <Button color="primary" icon="plus" onClick={addNewNode}>
        Add new node
      </Button> */}
      <div
        className={css.tableTitles}
        onClick={(e) => {
          e.stopPropagation();
          console.log(e.target.classList);
          handleClick(e.target.id);
        }}
      >
        <div style={{ backgroundColor: '#eefbfb', padding: '5px' }}>
          Table Tiles
        </div>
        <div>{tableTitles}</div>
      </div>
      <div className={css.diagram}>
        <Diagram schema={schema} onChange={onChange} />
      </div>
    </div>
  );
}
