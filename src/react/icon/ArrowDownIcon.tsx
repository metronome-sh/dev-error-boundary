import { FunctionComponent, SVGProps } from "react";
import { cn } from "../cn";

export const ArrowDownIcon: FunctionComponent<SVGProps<SVGSVGElement>> = (
  props
) => {
  const { className, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("mt-w-4 mt-h-4", className)}
      {...rest}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  );
};
