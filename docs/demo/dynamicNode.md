---
title: Dynamic Node
order: 4
# toc: menu
---

## Operation

```tsx live
import React, { useState, useCallback } from 'react';
import GraphEditor, { Controls, Background, MiniMap } from '@ols-scripts/graph-editor';

const initElements = {
  nodes: [{
    id: '1',
    type: 'CustomNode',
    data: {
      content: 'This is a Custom Node!'
    },
    cancel: ['textarea'],
    style: {
      width: '400px'
    },
    position: { x: 250, y: 20 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a default node
        </>
      ),
    },
    position: { x: 200, y: 400 },
  }],
  edges: [
    {
      source: '1',
      target: '2',
    }
  ]
}

const CustomNode = ({ data, onChange }) => {
  const onInputChange = useCallback((e) => {
    onChange({
      content: e.target.value
    })
  }, [])

  return (
    <div>
      <textarea style={{ color: '#333' }} value={data.content || ''} onChange={onInputChange} />
      <div>{data.content || ''}</div>
    </div>
  )
}

const Demo = () => {
  return (
    <div>
      <GraphEditor
        style={{ height: '800px' }}
        defaultElements={initElements}
        nodeTypes={{ CustomNode }}
      >
        <Controls />
        <Background />
        <MiniMap draggable />
      </GraphEditor>
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
