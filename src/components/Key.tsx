import "./style.css";



interface DragState {
  isDragging: boolean;
  draggedKey: string | null;
  offset: { x: number; y: number };
}

export default function Key(props: PropsTypes) {
  return (
    <div className="key" draggable="true">
      <span className="key-character">{props.label}</span>
    </div>
  );
}
