import { CSSProperties, ReactNode, MouseEvent, RefObject, ComponentType } from 'react'
import dagre from 'dagre'

export type ElementId = string

export type Elements<T = any> = {
  nodes?: Array<Node<T>>
  edges?: Array<Edge<T>>
}

export type NodeTypes = Record<string, ComponentType<Node>>
export type EdgeTypes = Record<string, ComponentType<Edge & { source: XYPosition; target: XYPosition }>>

export type NodeEventHandler = (event: MouseEvent, node?: Node) => void
export type ElementsEventHandler = (element?: Elements) => void
export type EdgeEventHandler = (event: MouseEvent, edge?: Edge) => void
export type ConnectEventHandler = (event: MouseEvent, connection?: Connection) => void

export type noop = () => void

export interface XYPosition {
  x?: number
  y?: number
}

export interface ZoomTransform {
  x: number
  y: number
  k: number
}

export interface ZoomOptions {
  minZoom?: number
  maxZoom?: number
  trigger: RefObject<HTMLElement>
  effect?: RefObject<HTMLElement>
}

export interface ZoomHelper {
  zoomIn: noop
  zoomOut: noop
  zoomTo: (zoomLevel: number) => void
  transform: (transform: ZoomTransform) => void
  fitView: (isLayout: boolean) => void
  getGraph: () => dagre.graphlib.Graph
}

export type NodeExtra = {
  width: number
  height: number
}

export type NodeRect = {
  id: string
} & NodeExtra

export interface Node<T = any> {
  id: ElementId
  position: XYPosition
  type?: string
  data?: T
  style?: CSSProperties
  className?: string
  visible?: boolean
  draggable?: boolean
  selectable?: boolean
  connectable?: boolean
  deletable?: boolean
  cancel?: string[]
  __extra?: NodeExtra
}

export enum ArrowType {
  arrow = 'arrow',
  arrowClosed = 'arrowclosed',
}

export interface Edge<T = any> {
  id?: ElementId // edge need id?? or id === source_target
  type?: string
  source: ElementId
  target: ElementId
  label?: string | ReactNode
  style?: CSSProperties
  visible?: boolean
  data?: T
  className?: string
  lineType?: ConnectionLineType
  arrowType?: ArrowType
  selectable?: boolean
  deletable?: boolean
}

export enum PointerType {
  Input = 'input',
  Output = 'output',
}

export enum PointerPosition {
  Top = 'top',
  Left = 'left',
  Right = 'right',
  Bottom = 'bottom',
}

export enum ConnectionLineType {
  Bezier = 'bezier',
  Straight = 'straight',
  Smooth = 'smooth',
}

export interface Connection {
  source?: ElementId | null
  target?: ElementId | null
}

export type Dimensions = {
  width: number
  height: number
}

export type ConnectLine = {
  lineType?: ConnectionLineType
  arrowType?: ArrowType
}

export enum Orientation {
  LeftToRight = 'LR',
  RightToLeft = 'RL',
  TopToBottom = 'TB',
  BottomToTop = 'BT',
}

export type Rect = {
  width?: number
  height?: number
  left?: number
  top?: number
}

export enum Theme {
  Normal = 'normal',
  Primary = 'primary',
}
