"use client";

import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { Workflow } from "@/lib/generated/prisma";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import React, { useCallback, useEffect } from "react";
import { AppNode } from "@/types/appNodes";

const nodeTypes = {
    FlowScrapeNode: NodeComponent
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = {padding: 2}

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(()=>{
    try {
      const flow = JSON.parse(workflow.definition)
      console.log(flow.nodes)
      if (!flow) return
      setNodes(flow.nodes || [])
      setEdges(flow.edges || [])
      if (!flow.viewport) return
      const { x = 0, y = 0, zoom = 1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch (error) {}
  }, [workflow.definition, setNodes, setEdges])

  const onDragOver = useCallback((e : React.DragEvent) =>{
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  },[])

  const onDrop = useCallback((e: React.DragEvent)=>{
    e.preventDefault()
    const taskType = e.dataTransfer.getData('application/reactflow')
    if (typeof taskType === undefined || !taskType) return
    
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    })

    const newNode = CreateFlowNode(taskType as TaskType, position)
    setNodes(nodes => nodes.concat(newNode))
  },[])

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1.3} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
