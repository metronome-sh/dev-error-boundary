import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { cn } from "./cn";

export interface TabProps {
  icon: JSX.Element;
  label: string;
  selected?: boolean;
  onSelect?: () => void;
}

import * as TabsPrimitive from "@radix-ui/react-tabs";

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 pt-1 border-b border-gray-200 dark:border-gray-600 px-4 w-full gap-1",
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
        "h-full group border border-transparent relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-t-md pl-3 pr-4 pt-2 pb-1 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
        "ring-offset-bg-white focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-gray-200",
        "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-gray-800 data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-600 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-200",
      ],
      className
    )}
    {...props}
  >
    <div className="absolute border-b -inset-x-0.5 group-data-[state=active]:inset-x-0 bottom-[-1px] border-gray-200 dark:border-gray-600 group-data-[state=active]:border-white dark:group-data-[state=active]:border-gray-800 group-data-[state=active]:bottom-[-1px]" />
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
