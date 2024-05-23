import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { cn } from "./cn";

export interface TabProps {
  icon: JSX.Element;
  label: string;
  selected?: boolean;
  onSelect?: () => void;
}

// export const Tabs: FunctionComponent<PropsWithChildren> & {
//   Tab: typeof Tab;
// } = ({ children }) => {
//   return (
//     <div className="z-10 border-b border-gray-200 flex gap-1 text-sm px-4 pt-1">
//       {children}
//     </div>
//   );
// };

// const Tab: FunctionComponent<TabProps> = ({
//   icon,
//   label,
//   selected,
//   onSelect,
// }) => {
//   return (
//     <button
//       onClick={onSelect}
//       className={cn(
//         "overflow-visible relative border pb-1 pt-2 pr-5 pl-4 rounded-t-md flex items-center gap-2",
//         {
//           "bg-white": selected,
//           "text-gray-500 bg-gray-50": !selected,
//           "": !selected,
//         }
//       )}
//     >
//       <div
//         className={cn("absolute border-b-2 inset-x-0", {
//           "bottom-[-2px] border-white": selected,
//           "bottom-[-1px] border-gray-50": !selected,
//         })}
//       />
//       <span>{icon}</span>
//       <span>{label}</span>
//     </button>
//   );
// };

// Tabs.Tab = Tab;

import * as TabsPrimitive from "@radix-ui/react-tabs";

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex h-9 pt-1 border-b px-4 w-full gap-1", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { icon: JSX.Element }
>(({ className, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "group border border-transparent relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-t-md pl-3 pr-4 pt-2 pb-1 text-sm text-gray-500 bg-gray-50 hover:text-gray-600 hover:bg-gray-100",
        "ring-offset-bg-white focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-gray-200",
        "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-gray-800 data-[state=active]:border-gray-200 data-[state=active]:bg-white data-[state=active]:text-foreground",
      ],
      className
    )}
    {...props}
  >
    <div className="absolute border-b-2 inset-x-0 bottom-[-1px] border-gray-50 group-hover:border-gray-100 group-data-[state=active]:border-white group-data-[state=active]:bottom-[-2px]" />
    <span>{icon}</span>
    <span>{children}</span>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn(className)} {...props} />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export const Tabs: typeof TabsPrimitive.Root & {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
} = Object.assign(TabsPrimitive.Root, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
