---
title: Operation
order: 3
# toc: menu
---

## Operation

```tsx live
import React from 'react';
import GraphEditor, { Controls, Background, MiniMap } from '@ols-scripts/graph-editor';

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
    position: { x: 250, y: 0 },
    deletable: false
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
    position: { x: 100, y: 150 },
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
    position: { x: 200, y: 300 },
    connectable: false
  }],
  edges: [
    {
      source: '1',
      target: '2',
    }
  ]
}

const Demo = () => {
  return (
    <div>
      <GraphEditor
        style={{ height: '800px' }}
        elements={initElements}
        onNodeDelete={(e, node) => {
          console.log('node delete', e, node)
        }}
        onEdgeDelete={(e, node) => {
          console.log('edge delete', e, node)
        }}
      >
        <Controls />
        <Background />
        <MiniMap />
      </GraphEditor>
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
