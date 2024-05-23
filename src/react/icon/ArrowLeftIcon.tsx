import { FunctionComponent, SVGProps } from "react";
import { Svg } from "./Svg";

export const ArrowLeftIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <Svg {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
      />
    </Svg>
  );
};
