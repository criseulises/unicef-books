import * as React from "react";
import { SVGProps } from "react";

const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
   <svg width={45} height={46} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m24.622 33.104-9.318-8.865a.917.917 0 0 1-.234-.343A1.111 1.111 0 0 1 15 23.5c0-.14.023-.273.07-.396a.917.917 0 0 1 .234-.343l9.318-8.892c.258-.246.58-.369.968-.369.387 0 .719.132.995.396.277.264.415.571.415.923 0 .352-.138.66-.415.924L18.456 23.5l8.13 7.757c.257.246.386.55.386.91 0 .361-.138.673-.414.937-.277.264-.6.396-.968.396-.369 0-.691-.132-.968-.396Z" fill="currentColor" />
   </svg>
);

export default ArrowLeft;
