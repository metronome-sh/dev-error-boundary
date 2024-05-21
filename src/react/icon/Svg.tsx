import { FunctionComponent, SVGProps } from "react";
import { cn } from "../cn";

export const Svg: FunctionComponent<SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-4 h-4 inline-block", className)}
      {...rest}
    />
  );
};
