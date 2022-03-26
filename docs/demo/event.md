---
title: Event
order: 2
# toc: menu
---

## Event

```tsx live
import React from 'react';
import GraphEditor, { Controls, Background } from '@ols-scripts/graph-editor';

const initElements = {
  nodes: [{
    id: '1',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 100 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 240 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 200, y: 400 },
  }],
  edges: [
    {
      source: '1',
      target: '2',
      lineType: 'smooth',
      arrowType: 'arrow'
    }
  ]
}

const Demo = () => {
  return (
    <div>
      <GraphEditor
        style={{ height: '800px' }}
        elements={initElements}
        onNodeClick={(e, node) => {
          console.log('node click', e, node)
        }}
        onNodeDoubleClick={(e, node) => {
          console.log('node double click', e, node)
        }}
        onNodeMouseEnter={(e, node) => {
          console.log('node mouse enter', e, node)
        }}
        onNodeMouseMove={(e, node) => {
          console.log('node mouse move', e, node)
        }}
        onNodeMouseLeave={(e, node) => {
          console.log('node mouse leave', e, node)
        }}
        onEdgeClick={(e, edge) => {
          console.log('edge click', e, edge)
        }}
        onEdgeDoubleClick={(e, edge) => {
          console.log('edge double click', e, edge)
        }}
        onEdgeMouseEnter={(e, node) => {
          console.log('edge mouse enter', e, node)
        }}
        onEdgeMouseMove={(e, node) => {
          console.log('edge mouse move', e, node)
        }}
        onEdgeMouseLeave={(e, node) => {
          console.log('edge mouse leave', e, node)
        }}
        onNodeDelete={(e, node) => {
          console.log('node delete', e, node)
        }}
      >
        <Controls isLayout />
        <Background />
      </GraphEditor>
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
