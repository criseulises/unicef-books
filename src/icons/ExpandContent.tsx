import * as React from "react"
import { SVGProps } from "react"

const ExpandContent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={41}
    height={41}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 36V23.143h4.143v8.571h8.286V36H6Zm24.857-17.143v-8.571h-8.286V6H35v12.857h-4.143Z"
      fill="#173FA3"
    />
  </svg>
)

export default ExpandContent