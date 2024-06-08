import { FunctionComponent } from "react";
import { useTheme } from "./useTheme";
import { MoonIcon } from "./icon/MoonIcon";
import { SunIcon } from "./icon/SunIcon";
import { ComputerIcon } from "./icon/ComputerIcon";

export const ThemeSelector: FunctionComponent = () => {
  const { userSelectedTheme, rotateTheme } = useTheme();

  if (!userSelectedTheme) return null;

  const icon = {
    light: <SunIcon className="h-5 w-5" />,
    dark: <MoonIcon />,
    system: <ComputerIcon />,
  };

  return (
    <button
      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 rounded-lg h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center mb-1"
      onClick={rotateTheme}
    >
      {icon[userSelectedTheme]}
    </button>
  );
};
