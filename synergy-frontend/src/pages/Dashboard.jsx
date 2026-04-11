import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import "./Dashboard.css";

const createConnectionId = () => Date.now();

// Helper to find intersection of line from center in direction with rectangle edge
const getIntersection = (rect, centerX, centerY, dirX, dirY) => {
  let tMin = Infinity;

  // Right edge
  if (dirX > 0) {
    const t = (rect.right - centerX) / dirX;
    if (t > 0 && t < tMin) tMin = t;
  }

  // Left edge
  if (dirX < 0) {
    const t = (rect.left - centerX) / dirX;
    if (t > 0 && t < tMin) tMin = t;
  }

  // Bottom edge
  if (dirY > 0) {
    const t = (rect.bottom - centerY) / dirY;
    if (t > 0 && t < tMin) tMin = t;
  }

  // Top edge
  if (dirY < 0) {
    const t = (rect.top - centerY) / dirY;
    if (t > 0 && t < tMin) tMin = t;
  }

  if (tMin === Infinity) return { x: centerX, y: centerY };
  return { x: centerX + tMin * dirX, y: centerY + tMin * dirY };
};

export default function Dashboard() {
  const { id } = useParams();
  const username = localStorage.getItem("username") || "Guest";

  const [tasks, setTasks] = useState([]);
  const [connections, setConnections] = useState([]);

  const [input, setInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [connectionType, setConnectionType] = useState("solid");
  const [nodeColor, setNodeColor] = useState("white");
  const [selectedNode, setSelectedNode] = useState(null);
  const [connectMode, setConnectMode] = useState(false);

  // JOIN SESSION
  useEffect(() => {
    socket.emit("join-session", id);
  }, [id]);

  // RECEIVE DATA
  useEffect(() => {
    socket.on("tasks-updated", setTasks);
    socket.on("connections-updated", setConnections);

    return () => {
      socket.off("tasks-updated");
      socket.off("connections-updated");
    };
  }, []);

  // ADD NODE
  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input,
      user: username,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      color: nodeColor,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    setInput("");

    socket.emit("update-tasks", {
      sessionId: id,
      tasks: updated,
    });
  };

  // DELETE NODE
  const deleteTask = (nodeId) => {
    const updatedTasks = tasks.filter((t) => t.id !== nodeId);

    const updatedConnections = connections.filter(
      (c) => c.from !== nodeId && c.to !== nodeId
    );

    setTasks(updatedTasks);
    setConnections(updatedConnections);

    socket.emit("update-tasks", {
      sessionId: id,
      tasks: updatedTasks,
    });

    socket.emit("update-connections", {
      sessionId: id,
      connections: updatedConnections,
    });
  };

  // DRAG NODE
  const handleDrag = (e, nodeId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const canvas = e.currentTarget.parentElement;
    const canvasRect = canvas.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const move = (moveEvent) => {
      const newX = moveEvent.clientX - canvasRect.left - offsetX;
      const newY = moveEvent.clientY - canvasRect.top - offsetY;

      // Clamp to canvas bounds
      const clampedX = Math.max(0, Math.min(newX, canvasRect.width - 140));
      const clampedY = Math.max(0, Math.min(newY, canvasRect.height - 70));

      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === nodeId ? { ...t, x: clampedX, y: clampedY } : t
        );

        socket.emit("update-tasks", {
          sessionId: id,
          tasks: updated,
        });

        return updated;
      });
    };

    const stop = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
  };

  // CONNECT NODES
  const handleNodeClick = (nodeId) => {
    if (!connectMode) return;

    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else {
      if (selectedNode !== nodeId) {
        const newConnection = {
          id: createConnectionId(),
          from: selectedNode,
          to: nodeId,
          label: labelInput || "",
          type: connectionType,
        };

        const updated = [...connections, newConnection];

        setConnections(updated);

        socket.emit("update-connections", {
          sessionId: id,
          connections: updated,
        });

        setLabelInput("");
      }

      setSelectedNode(null);
      setConnectMode(false);
    }
  };

  // DELETE CONNECTION
  const deleteConnection = (connId) => {
    const updated = connections.filter((c) => c.id !== connId);

    setConnections(updated);

    socket.emit("update-connections", {
      sessionId: id,
      connections: updated,
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">

        <h2>📚 Synergy Planner</h2>

        <p>👤 {username}</p>
        <p>Session ID: {id}</p>

        {/* NODE INPUT */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter node..."
        />

        <div className="node-controls">
          <label htmlFor="node-color">Priority color:</label>
          <select
            id="node-color"
            value={nodeColor}
            onChange={(e) => setNodeColor(e.target.value)}
            className="node-color-select"
          >
            <option value="white">Default</option>
            <option value="#ff6b6b">High (Red)</option>
            <option value="#ffa726">Medium-High (Orange)</option>
            <option value="#ffeb3b">Medium (Yellow)</option>
            <option value="#4caf50">Low (Green)</option>
            <option value="#2196f3">Info (Blue)</option>
          </select>
        </div>

        <button onClick={addTask}>Add Node</button>

        {/* LABEL INPUT */}
        <input
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          placeholder="Enter connection label..."
        />

        <div className="connection-controls">
          <label htmlFor="connection-type">Arrow style:</label>
          <select
            id="connection-type"
            value={connectionType}
            onChange={(e) => setConnectionType(e.target.value)}
            className="connection-type-select"
          >
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
            <option value="arrow">Pointed</option>
            <option value="double">Double-pointed</option>
          </select>
        </div>

        <button
          onClick={() => {
            setConnectMode(!connectMode);
            setSelectedNode(null);
          }}
        >
          {connectMode ? "Cancel" : "Connect"}
        </button>

        {/* CANVAS */}
        <div className="canvas">

          <svg className="connections">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L10,3.5 L0,7 Z" fill="black" />
              </marker>
              <marker
                id="arrowhead-start"
                markerWidth="10"
                markerHeight="7"
                refX="0"
                refY="3.5"
                orient="auto"
              >
                <path d="M10,0 L0,3.5 L10,7 Z" fill="black" />
              </marker>
            </defs>

            {connections.map((conn) => {
              const fromNode = tasks.find((t) => t.id === conn.from);
              const toNode = tasks.find((t) => t.id === conn.to);

              if (!fromNode || !toNode) return null;

              const fromCenterX = fromNode.x + 70;
              const fromCenterY = fromNode.y + 35;
              const toCenterX = toNode.x + 70;
              const toCenterY = toNode.y + 35;

              const dx = toCenterX - fromCenterX;
              const dy = toCenterY - fromCenterY;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist === 0) return null;

              const dirX = dx / dist;
              const dirY = dy / dist;

              const fromRect = {
                left: fromNode.x,
                top: fromNode.y,
                right: fromNode.x + 140,
                bottom: fromNode.y + 70,
              };
              const toRect = {
                left: toNode.x,
                top: toNode.y,
                right: toNode.x + 140,
                bottom: toNode.y + 70,
              };

              const start = getIntersection(fromRect, fromCenterX, fromCenterY, dirX, dirY);
              const end = getIntersection(toRect, toCenterX, toCenterY, -dirX, -dirY);

              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              const strokeDasharray =
                conn.type === "dotted"
                  ? "4 6"
                  : conn.type === "dashed"
                  ? "8 6"
                  : "0";

              const markerEnd =
                conn.type === "arrow" || conn.type === "double"
                  ? "url(#arrowhead)"
                  : undefined;
              const markerStart = conn.type === "double" ? "url(#arrowhead-start)" : undefined;

              return (
                <g key={conn.id}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray={strokeDasharray}
                    markerEnd={markerEnd}
                    markerStart={markerStart}
                  />

                  {conn.label && (
                    <text
                      x={midX}
                      y={midY - 10}
                      textAnchor="middle"
                      fontSize="14"
                      fill="#333"
                      fontWeight="bold"
                    >
                      {conn.label}
                    </text>
                  )}

                  <circle
                    cx={midX}
                    cy={midY}
                    r="7"
                    fill="red"
                    onClick={() => deleteConnection(conn.id)}
                    style={{ cursor: "pointer" }}
                  />
                </g>
              );
            })}
          </svg>

          {tasks.map((task) => (
            <div
              key={task.id}
              className="node"
              onMouseDown={(e) => handleDrag(e, task.id)}
              onClick={() => handleNodeClick(task.id)}
              style={{
                position: "absolute",
                top: task.y,
                left: task.x,
                border:
                  selectedNode === task.id
                    ? "2px solid #6c63ff"
                    : "none",
                backgroundColor: task.color,
              }}
            >
              <strong>{task.text}</strong>
              <p className="node-user">by {task.user}</p>

              <button
                className="delete-btn-fixed"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => deleteTask(task.id)}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}