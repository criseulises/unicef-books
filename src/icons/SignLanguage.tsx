import * as React from "react"
import { SVGProps } from "react"

const SignLanguage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={45}
    height={44}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <path fill="url(#a)" d="M0 .75h45v42.5H0z" />
    <defs>
      <pattern
        id="a"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#b" transform="matrix(.01 0 0 .01059 0 -.059)" />
      </pattern>
      <image
        id="b"
        width={100}
        height={100}
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
)

export default SignLanguage