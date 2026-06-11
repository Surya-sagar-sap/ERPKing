"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeDetailPanel from "./NodeDetailPanel";

interface NodeDetail {
  nodeId: string;
  title: string;
  description: string;
  tCode: string | null;
  tips: string | null;
}

interface Props {
  title: string;
  nodes: Node[];
  edges: Edge[];
  nodeDetails: NodeDetail[];
  moduleColor: string;
}

export default function FlowchartViewer({ title, nodes, edges, nodeDetails, moduleColor }: Props) {
  const [selectedDetail, setSelectedDetail] = useState<NodeDetail | null>(null);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const detail = nodeDetails.find((d) => d.nodeId === node.id);
      if (detail) {
        setSelectedDetail((prev) => (prev?.nodeId === detail.nodeId ? null : detail));
      }
    },
    [nodeDetails]
  );

  const onPaneClick = useCallback(() => setSelectedDetail(null), []);

  return (
    <div className="my-8 border rounded-2xl overflow-hidden bg-card">
      {/* Header */}
      <div className="px-5 py-3.5 border-b flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">
            Interactive Flowchart
          </div>
          <div className="font-semibold text-sm">{title}</div>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          Click any node to learn more
        </div>
      </div>

      {/* Flow + Panel layout */}
      <div className={`flex transition-all ${selectedDetail ? "flex-row" : ""}`}>
        {/* React Flow canvas */}
        <div
          className="flex-1"
          style={{ height: selectedDetail ? 420 : 480 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {/* Detail panel — slides in when a node is clicked */}
        {selectedDetail && (
          <NodeDetailPanel
            detail={selectedDetail}
            moduleColor={moduleColor}
            onClose={() => setSelectedDetail(null)}
          />
        )}
      </div>

      {/* Footer hint */}
      <div className="px-5 py-2.5 border-t bg-muted/30 text-xs text-muted-foreground">
        💡 {nodeDetails.length} clickable nodes · Zoom with scroll · Pan by dragging the background
      </div>
    </div>
  );
}
