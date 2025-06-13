import * as React from "react"
import { SVGProps } from "react"

const AccessibilityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={36}
    height={36}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={18} cy={18} r={16.5} stroke="currentColor" strokeWidth={3} />
    <path
      d="M29.184 12.238a1.253 1.253 0 0 0-1.498-.938c-2.876.662-6.078.95-9.075.95-2.997 0-6.199-.287-9.075-.95-.664-.15-1.329.25-1.498.938-.17.7.242 1.412.906 1.575a44.69 44.69 0 0 0 6.042.937v15c0 .688.544 1.25 1.208 1.25.665 0 1.209-.563 1.209-1.25V23.5h2.416v6.25c0 .688.544 1.25 1.209 1.25.664 0 1.208-.563 1.208-1.25v-15c1.994-.175 4.096-.488 6.03-.938.676-.162 1.087-.874.918-1.574ZM18.61 11c1.33 0 2.417-1.125 2.417-2.5S19.94 6 18.61 6c-1.33 0-2.417 1.125-2.417 2.5s1.088 2.5 2.417 2.5Z"
      fill="currentColor"
    />
  </svg>
)

export default AccessibilityIcon
