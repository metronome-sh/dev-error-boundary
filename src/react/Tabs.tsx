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
//     <div className="mt-z-10 mt-border-b mt-border-gray-200 mt-flex mt-gap-1 mt-text-sm mt-px-4 mt-pt-1">
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
//         "mt-overflow-visible mt-relative mt-border mt-pb-1 mt-pt-2 mt-pr-5 mt-pl-4 mt-rounded-t-md mt-flex mt-items-center mt-gap-2",
//         {
//           "mt-bg-white": selected,
//           "mt-text-gray-500 mt-bg-gray-50": !selected,
//           "": !selected,
//         }
//       )}
//     >
//       <div
//         className={cn("mt-absolute mt-border-b-2 mt-inset-x-0", {
//           "mt-bottom-[-2px] mt-border-white": selected,
//           "mt-bottom-[-1px] mt-border-gray-50": !selected,
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
    className={cn(
      "mt-inline-flex mt-h-9 mt-pt-1 mt-border-b mt-px-4 mt-w-full mt-gap-1",
      className
    )}
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
        "mt-group mt-border mt-border-transparent mt-relative mt-inline-flex mt-items-center mt-justify-center mt-gap-2 mt-whitespace-nowrap mt-rounded-t-md mt-pl-3 mt-pr-4 mt-pt-2 mt-pb-1 mt-text-sm mt-text-gray-500 mt-bg-gray-50 hover:mt-text-gray-600 hover:mt-bg-gray-100",
        "mt-ring-offset-bg-white mt-transition-all focus-visible:!outline-none focus-visible:ring-2 focus-visible:mt-ring-gray-200",
        "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:mt-text-gray-800 data-[state=active]:mt-border-gray-200 data-[state=active]:mt-bg-white data-[state=active]:mt-text-foreground",
      ],
      className
    )}
    {...props}
  >
    <div className="mt-absolute mt-border-b-2 mt-inset-x-0 mt-bottom-[-1px] mt-border-gray-50 group-data-[state=active]:mt-border-white group-data-[state=active]:mt-bottom-[-2px]" />
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
