import { ColumnResizeDirection, ColumnResizeMode } from "@tanstack/solid-table";
import { JSX } from "solid-js";

export interface ColumnResizerProps {
  mode?: ColumnResizeMode;
  isResizing: boolean;
  direction?: ColumnResizeDirection;
  deltaOffset: number | null;
  onResetSize: () => void;
  onResize: () => (e: unknown) => void;
}

export const ColumnResizer = (props: ColumnResizerProps) => {
  const handleResetSize = () => props.onResetSize();
  const handleResize: JSX.EventHandlerUnion<
    HTMLDivElement,
    TouchEvent | MouseEvent
  > = (e) => props.onResize()?.(e);
  return (
    <div
      class={`w-1 h-6 bg-gray-300 rounded-xl z-50 ${props.isResizing ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        transform:
          props.mode === "onEnd" && props.isResizing
            ? `translateX(${
                (props.direction === "rtl" ? -1 : 1) * (props.deltaOffset ?? 0)
              }px)`
            : "",
      }}
      onDblClick={handleResetSize}
      onMouseDown={handleResize}
      onTouchStart={handleResize}
    />
  );
};
