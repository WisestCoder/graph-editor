import React from 'react'

/**
 * element line type
 * @param size
 * @param strokeWidth
 * @param stroke
 * @returns React.ReactElement
 */
export const createGridLinesPath = (
  size: number,
  strokeWidth: number,
  stroke: string,
): React.ReactElement => {
  return (
    <path
      stroke={stroke}
      strokeWidth={strokeWidth}
      d={`M${size / 2} 0 V${size} M0 ${size / 2} H${size}`}
    />
  )
}

/**
 * element dot type
 * @param size
 * @param fill
 * @returns React.ReactElement
 */
export const createGridDotsPath = (size: number, fill: string): React.ReactElement => {
  return <circle cx={size} cy={size} r={size} fill={fill} />
}
