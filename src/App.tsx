import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";
import "./App.css";
interface KeyData {
  id: string;
  label: string;
  width: number;
  height: number;
  x: number;
  y: number;
  type: "letter" | "special";
}
interface DragState {
  isDragging: boolean;
  draggedKey: string | null;
  offset: { x: number; y: number };
}

function App() {
  const [keys, setKeys] = useState<KeyData[]>([
    {
      id: nanoid(),
      label: "A",
      width: 40,
      height: 40,
      x: 50,
      y: 50,
      type: "letter",
    },
  ]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedKey: null,
    offset: { x: 0, y: 0 },
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getKeyStyle = (key: KeyData, isDragged: boolean) => {
    const baseStyle = {
      position: "absolute" as const,
      left: key.x,
      top: key.y,
      width: key.width,
      height: key.height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      border: "2px solid",
      fontSize: key.width > 60 ? "12px" : "14px",
      fontWeight: "bold",
      cursor: "move",
      userSelect: "none" as const,
      transition: isDragged ? "none" : "all 0.2s ease",
      zIndex: isDragged ? 1000 : selectedKey === key.id ? 100 : 1,
    };
    const typeStyles = {
      letter: {
        backgroundColor: "#f8fafc",
        borderColor: selectedKey === key.id ? "#3b82f6" : "#e2e8f0",
        color: "#1e293b",
      },
      modifier: {
        backgroundColor: "#fef3c7",
        borderColor: selectedKey === key.id ? "#f59e0b" : "#fbbf24",
        color: "#92400e",
      },
      space: {
        backgroundColor: "#ecfdf5",
        borderColor: selectedKey === key.id ? "#10b981" : "#6ee7b7",
        color: "#047857",
      },
      enter: {
        backgroundColor: "#fce7f3",
        borderColor: selectedKey === key.id ? "#ec4899" : "#f9a8d4",
        color: "#be185d",
      },
      special: {
        backgroundColor: "#e0e7ff",
        borderColor: selectedKey === key.id ? "#6366f1" : "#a5b4fc",
        color: "#4338ca",
      },
    };

    return { ...baseStyle, ...typeStyles[key.type] };
  };
  const keysElements = keys.map((key) => {
    return (
      <div
        key={key.id}
        style={getKeyStyle(key, dragState.draggedKey === key.id)}
        onMouseDown={(e) => handleMouseDown(e, key.id)}
        onClick={() => setSelectedKey(key.id)}
      >
        {key.label}{" "}
      </div>
    );
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, keyId: string) => {
      e.preventDefault();
      const key = keys.find((k) => k.id === keyId);
      if (!key) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setSelectedKey(keyId);
      setDragState({
        isDragging: true,
        draggedKey: keyId,
        offset: {
          x: e.clientX - containerRect.left - key.x,
          y: e.clientY - containerRect.top - key.y,
        },
      });
    },
    [keys]
  );

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedKey: null,
      offset: { x: 0, y: 0 },
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedKey) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const newX = e.clientX - containerRect.left - dragState.offset.x;
      const newY = e.clientY - containerRect.top - dragState.offset.y;

      setKeys((prevKeys) =>
        prevKeys.map((key) =>
          key.id === dragState.draggedKey
            ? { ...key, x: Math.max(0, newX), y: Math.max(0, newY) }
            : key
        )
      );
    },
    [dragState]
  );

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* Zone principale du clavier */}
      <div className="flex-1 p-4">
        <div
          ref={containerRef}
          className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          style={{ width: "100%", height: "500px" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {keysElements}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>• Cliquez et glissez pour déplacer les touches</p>
          <p>
            • Sélectionnez une touche pour la modifier dans le panneau de droite
          </p>
          <p>
            • Utilisez le panneau de droite pour ajuster les propriétés des
            touches
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
