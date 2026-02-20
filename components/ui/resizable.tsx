"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePanels from "react-resizable-panels"

import { cn } from "@/lib/utils"

const PanelGroup: any =
  (ResizablePanels as any).PanelGroup ??
  (ResizablePanels as any).default ??
  ResizablePanels

const Panel: any = (ResizablePanels as any).Panel
const PanelResizeHandle: any = (ResizablePanels as any).PanelResizeHandle

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div"> & { direction?: "horizontal" | "vertical" }
>(({ className, ...props }, ref) => (
  <PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = Panel

const ResizableHandle = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div"> & { withHandle?: boolean }
>(({ className, withHandle, ...props }, ref) => (
  <PanelResizeHandle
    ref={ref}
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className
    )}
    {...props}
  >
    {withHandle ? (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVerticalIcon className="h-2.5 w-2.5" />
      </div>
    ) : null}
  </PanelResizeHandle>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }