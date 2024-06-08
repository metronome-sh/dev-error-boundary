import { FunctionComponent, SVGProps } from "react";
import { Svg } from "./Svg";

export const ArrowDownIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (
  props
) => {
  return (
    <Svg {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </Svg>
  );
};
