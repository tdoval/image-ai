import { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on("selection:create", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:updated", (e) => {
        setSelectedObjects(e.selected || []);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObjects([]);
      });
    }

    return () => {
      if (canvas) {
        canvas.off("selection:create");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [canvas, setSelectedObjects]);
};
