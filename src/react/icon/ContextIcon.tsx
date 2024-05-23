import { FunctionComponent, SVGProps } from "react";
import { Svg } from "./Svg";

export const ContextIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <Svg {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
      />
    </Svg>
  );
};
