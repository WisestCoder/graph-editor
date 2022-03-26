---
title: theme
order: 7
# toc: menu
---

## Theme

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
      width: '200px'
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
      <h3>Primary</h3>
      <GraphEditor
        style={{ height: '800px' }}
        defaultElements={initElements}
        nodeTypes={{ CustomNode }}
        theme="normal"
      />
      <h3>Normal</h3>
      <GraphEditor
        style={{ height: '800px' }}
        defaultElements={initElements}
        nodeTypes={{ CustomNode }}
        theme="primary"
      />
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
