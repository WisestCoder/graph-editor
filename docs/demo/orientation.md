---
title: Orientation
order: 5
# toc: menu
---

## Orientation

```tsx live
import React, { useState } from 'react';
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
    position: { x: 40, y: 200 },
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
    position: { x: 400, y: 40 },
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
    position: { x: 400, y: 300 },
    // connectable: false
  }],
  edges: [
    {
      source: '1',
      target: '2',
      label: 'I am label',
      // arrowType: 'arrowClosed'
    }
  ]
}

const Demo = () => {
  const [orientation, setOrientation] = useState('LR')
  const [elements, setEl] = useState(initElements)

  return (
    <div>
      <select value={orientation} onChange={(e) => { setOrientation(e.target.value) }}>
        <option value="LR">Left To Right</option>
        <option value="RL">Right To Left</option>
        <option value="TB">Top To Bottom</option>
        <option value="BT">Bottom To Top</option>
      </select>
      <button onClick={() => {
        setEl({
          nodes: elements.nodes.slice(0, 2),
          edges: elements.edges
        })
      }}>删除节点</button>

      <GraphEditor
        style={{ height: '800px' }}
        defaultElements={elements}
        orientation={orientation}
        onElementChange={(element) => {
          setEl(element)
        }}
        connectLine={{
          lineType: 'smooth', // smooth, bezier, straight
          arrowType: 'arrowClosed'
        }}
      >
        <Controls isLayout />
        <Background />
        <MiniMap draggable />
      </GraphEditor>
    </div>
  );
};

ReactDOM.render(<Demo />, mountNode);
```
