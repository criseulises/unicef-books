import * as React from "react"
import { SVGProps } from "react"

const FullScreenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={31}
    height={23}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={1}
      y={1.5}
      width={29}
      height={20}
      rx={3}
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
)

export default FullScreenIcon
