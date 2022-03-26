### Getting Started

Before you can start to use Graph Editor you need to install `@ols-scripts/graph-editor`:

### Installation

**npm:**

```bash
npm install @ols-scripts/graph-editor
```

**yarn:**

```bash
yarn add @ols-scripts/graph-editor
```

### Usage

This is a very basic example of how to use Graph Editor. A flow consists of nodes and edges (or just nodes). Together we call them elements. You can pass a set of elements as a prop to the GraphEditor component. Hereby all elements need unique ids. A node needs a position and a label and an edge needs a source (node id) and a target (node id). This is the most basic for a flow. A simple flow could look like this:

```tsx
import React, { useState, useCallback } from 'react';
import GraphEditor, { Controls, Background } from '@ols-scripts/graph-editor';

const initElements = {
  nodes: [{
    id: '1',
    type: 'CustomNode',
    data: {
      label: (
        <>
          This is a Custom Node!
        </>
      ),
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

const CustomNode = () => {
  const [content, setContent] = useState('我我我我')
  const onInputChange = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  return (
    <>
      <textarea value={content} onChange={onInputChange} />
      <div>{content}</div>
    </>
  )
}

const Demo = () => {
  return (
    <GraphEditor
      style={{ height: '800px' }}
      elements={initElements}
    >
      <Controls />
      <Background />
    </GraphEditor>
  );
};

ReactDOM.render(<Demo />, mountNode);
```

### Style

Since we are rendering DOM nodes you can simply overwrite the styles with your own CSS rules. The Graph Editor wrapper has the className graph editor. If you want to change the graph background for example you can do:

```css
.graph-editor {
  background: red;
}
```

Graph Editor Class Names

```bash
.graph-editor # container
.graph-editor-zoom-wrapper # Zoom wrapper
.graph-editor-edge-renderer # Edges renderer
.graph-editor-node-renderer # Nodes renderer
.graph-editor-edge-wrapper # Edges wrapper
.graph-editor-node-wrapper # Nodes wrapper
.graph-editor-pointer-wrapper # Pointers wrapper
.graph-editor-controls # Controls
.graph-editor-background # Background
.graph-editor-minimap # Minimap
.graph-editor-edge-label # Edge label
.graph-editor-marker-definitions-container # Marker definitions
```

You could achieve the same effect by passing a style prop to the GraphEditor component:

```tsx
const style = {
  background: 'red',
  width: '100%',
  height: 300,
};

return <GraphEditor elements={elements} style={style} />;
```

### Prop Types

This is the list of prop types you can pass to the main GraphEditor component.

```ts
import GraphEditor from '@ols-scripts/graph-editor';
```

#### Basic Props

- `prefix`: style prefix
- `elements`: array of nodes and edges (required)
- `style`: css properties
- `className`: additional class name
- `children`: children nodes
- `theme`: style theme, enumerated value is `primary`/`normal`

#### Event Handlers

- `onNodeDragStart(event, node)`: node drag start
- `onNodeDrag(event, node)`: node drag
- `onNodeDragStop(event, node)`: node drag stop
- `onNodeMouseEnter(event, node)`: node mouse enter
- `onNodeMouseMove(event, node)`: node mouse move
- `onNodeMouseLeave(event, node)`: node mouse leave
- `onNodeClick(event, node)`: node click
- `onNodeDoubleClick(event, node)`: node double click
- `onConnect({ source, target })`: called when user connects two nodes
- `onConnectStart(event, { nodeId, handleType })`: called when user starts to drag connection line
- `onConnectStop(event)`: called when user stops to drag connection line
- `onConnectEnd(event)`: called after user stops or connects nodes
- `onEdgeMouseEnter(event, edge)`: edge mouse enter
- `onEdgeMouseMove(event, edge)`: edge mouse move
- `onEdgeMouseLeave(event, edge)`: edge mouse leave
- `onEdgeClick(event, edge)`: edge click,
- `onEdgeDoubleClick(event, edge)`: edge double click,
- `onZoom(event, transform)`: zoom change,

#### Interaction

- `draggable`: default = true; This applies to all nodes. You can also change the behavior of a specific node with the draggable node option. If this option is set to false and you have clickable elements inside your node, you need to set pointer-events:all explicitly for these elements
- `connectable`: default = true; This applies to all nodes. You can also change the behavior of a specific node with the connectable node option
- `selectable`: default: true; This applies to all elements. You can also change the behavior of a specific node with the selectable node option. If this option is set to false and you have clickable elements inside your node, you need to set pointer-events:all explicitly for these elements

#### Element Customization

- `nodeTypes`: object with node types
- `edgeTypes`: object with edge types

#### Connection Line Options

- `connectLine.lineType`: The lineType = `'bezier' | 'straight' | 'smooth'`
- `orientation`: The orientation of connection line = `'LR' | 'RL' | 'TB' | 'BT'`

**Typescript:** The interface of the GraphEditor Prop Types are exported as GraphEditorProps. You can use it in your code as follows:

```tsx
import { GraphEditorProps } from '@ols-scripts/graph-editor';
```

### Node Options

You create nodes by adding them to the elements array of the GraphEditor component.

#### Node example

```ts
{
  id: '1',
  type: 'input',
  data: { label: 'Node 1' },
  position: { x: 250, y: 5 }
}
```

#### Options

- `id`: string (required)
- `position`: { x: number, y: number } (required)
- `data`: {} (required if you are using a standard type, otherwise depends on your implementation)
- `type`: 'default' or a custom one you implemented
- `style`: css properties
- `className`: additional class name
- `orientation`: The orientation of connection line = `'LR' | 'RL' | 'TB' | 'BT'`
- `draggable`: boolean - if option is not set, the node is draggable (overwrites general nodesDraggable option)
- `connectable`: boolean - if option is not set, the node is connectable (overwrites general nodesConnectable option)
- `selectable`: boolean - if option is not set, the node is selectable (overwrites general elementsSelectable option)

### Edge Options

You create edges by adding them to your elements array of the GraphEditor component.

#### Edge example

```ts
{
  id: 'e1-2',
  type: 'straight',
  source: '1',
  target: '2',
  animated: true,
  label: 'edge label'
}
```

If you wanted to display this edge, you would need a node with `id` = 1 (source node) and another one with `id` = 2 (target node).

#### Options

- `id`: string
- `source`: string (an id of a node) (required)
- `target`: string (an id of a node) (required)
- `lineType`: 'default' (`bezier`), `straight`, `smooth` or a custom one depending on your implementation
- `style`: css properties for the edge line path
- `className`: additional class name
- `label`: string
- `arrowType`: `arrow` or `arrowClosed`
- `data`: `{}` you can use this to pass data to your custom edges.

### Background

Graph Editor comes with two background variants: dots and lines. You can use it by passing it as a children to the GraphEditor component

#### Usage

```tsx
import GraphEditor, { Background } from '@ols-scripts/graph-editor';

return (
  <GraphEditor elements={elements}>
    <Background
      variant="dots"
      gap={12}
      size={4}
    />
  </GraphEditor>
);
```

#### Prop Types

- variant: string - has to be 'dots' or 'lines' - default: dots
- gap: number - the gap between the dots or lines - default: 16
- size: number - the radius of the dots or the stroke width of the lines - default: 0.5
- color: string - the color of the dots or lines - default: #81818a for dots, #eee for lines
- style: css properties
- className: additional class name

**Typescript:** The interface of the Background Prop Types are exported as BackgroundProps.

### Mini Map

You can use the mini map plugin by passing it as a children to the GraphEditor component

#### Usage

```tsx
import GraphEditor, { MiniMap } from '@ols-scripts/graph-editor';

return (
  <GraphEditor elements={elements}>
    <MiniMap />
  </GraphEditor>
);
```

#### Prop Types

- `style`: css properties
- `className`: additional class name
- `draggable`: default = false

**Typescript:** The interface of the MiniMap Prop Types are exported as MiniMapProps

### Control

You can use control to change operation status easier

#### Usage

```tsx
import GraphEditor, { MiniMap } from '@ols-scripts/graph-editor';

return (
  <GraphEditor elements={elements}>
    <Control
      showZoom
      showFullscreen
      showFitView
      showInteractive
      isLayout
    />
  </GraphEditor>
)
```

#### Prop Types

- `style`: css properties
- `className`: additional class name
- `draggable`: default = false
- `showZoom`: show zoom button
- `showFullscreen`: show fullscreen button
- `showFitView`: show fitView button
- `showInteractive`: show interactive button
- `isLayout`: control graphlib layout

**Typescript:** The interface of the Control Prop Types are exported as ControlProps

### ZoomWrapper

```tsx
import GraphEditor, { ZoomWrapper } from '@ols-scripts/graph-editor';

<ZoomWrapper prefix={prefix}>
  {({ transform, transformStyle }) => (
    <div style={{ transform: transformStyle }}>
  )}
</ZoomWrapper>
```

### GlobalWrapper

```tsx
import GraphEditor, { GlobalWrapper } from '@ols-scripts/graph-editor';

<GlobalWrapper
  value={{
    nodes: [],
    edges: [],
    nodeTypes: {},
    edgeTypes: {},
    draggable: true,
    selectable: true,
    connectable: true,
  }}
>
  <div>container</div>
</GlobalWrapper>
```

### Helper

### Hooks

### Todo

- [ ] window resize listener
- [ ] on node support wheel
- [ ] drag performance optimization
- [x] node delete
- [x] showFitView
- [x] dynamic node [calc offset and update position online]
- [x] add edge label
- [x] horizontal edge
- [x] miniMap
- [x] full screen
- [x] connectline position bug
- [x] more event
- [x] node select
- [x] edge select
- [x] add arrow (arrowType)
