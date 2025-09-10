import React, { useEffect, useRef, useState } from 'react';
import { Flowchart, FlowchartNode } from '../types/flowchart';

interface Props {
  flowchart: Flowchart;
  interactive?: boolean;
  onNodeClick?: (node: FlowchartNode) => void;
}

interface VisualNode extends FlowchartNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Connection {
  from: VisualNode;
  to: VisualNode;
  label?: string;
  fromChoice?: number;
}

const FlowchartVisualizer: React.FC<Props> = ({ flowchart, interactive = false, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [visualNodes, setVisualNodes] = useState<VisualNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    layoutNodes();
  }, [flowchart]);

  const layoutNodes = () => {
    const nodes = flowchart.nodes;
    if (nodes.length === 0) return;

    // Simple hierarchical layout
    const levels: { [key: number]: FlowchartNode[] } = {};
    const nodeDepths: { [key: string]: number } = {};
    
    // Find start node
    const startNode = nodes.find(n => n.id === flowchart.startNodeId) || nodes[0];
    
    // Calculate depths using BFS
    const queue = [{ node: startNode, depth: 0 }];
    const visited = new Set<string>();
    
    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;
      
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      
      nodeDepths[node.id] = depth;
      if (!levels[depth]) levels[depth] = [];
      levels[depth].push(node);
      
      // Add connected nodes to queue
      if (node.type === 'decision' && node.choices) {
        node.choices.forEach(choice => {
          const nextNode = nodes.find(n => n.id === choice.nextNodeId);
          if (nextNode && !visited.has(nextNode.id)) {
            queue.push({ node: nextNode, depth: depth + 1 });
          }
        });
      }
    }
    
    // Add unvisited nodes
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const maxDepth = Math.max(...Object.values(nodeDepths), -1);
        nodeDepths[node.id] = maxDepth + 1;
        if (!levels[maxDepth + 1]) levels[maxDepth + 1] = [];
        levels[maxDepth + 1].push(node);
      }
    });

    // Position nodes
    const nodeWidth = 200;
    const nodeHeight = 80;
    const levelHeight = 150;
    const nodeSpacing = 50;
    
    const positioned: VisualNode[] = [];
    
    Object.entries(levels).forEach(([levelStr, levelNodes]) => {
      const level = parseInt(levelStr);
      const y = 50 + level * levelHeight;
      const totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * nodeSpacing;
      const startX = Math.max(50, (800 - totalWidth) / 2);
      
      levelNodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + nodeSpacing);
        positioned.push({
          ...node,
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
        });
      });
    });

    // Calculate connections
    const newConnections: Connection[] = [];
    positioned.forEach(node => {
      if (node.type === 'decision' && node.choices) {
        node.choices.forEach((choice, choiceIndex) => {
          const targetNode = positioned.find(n => n.id === choice.nextNodeId);
          if (targetNode) {
            newConnections.push({
              from: node,
              to: targetNode,
              label: choice.text,
              fromChoice: choiceIndex,
            });
          }
        });
      }
    });

    // Update SVG dimensions
    const maxX = Math.max(...positioned.map(n => n.x + n.width), 800);
    const maxY = Math.max(...positioned.map(n => n.y + n.height), 600);
    
    setVisualNodes(positioned);
    setConnections(newConnections);
    setSvgDimensions({ width: maxX + 50, height: maxY + 50 });
  };

  const getNodeColor = (node: FlowchartNode) => {
    switch (node.type) {
      case 'step': return '#3B82F6'; // Blue
      case 'decision': return '#F59E0B'; // Yellow
      case 'end': return '#10B981'; // Green
      case 'reference': return '#8B5CF6'; // Purple
      default: return '#6B7280'; // Gray
    }
  };

  const getNodeIcon = (node: FlowchartNode) => {
    switch (node.type) {
      case 'step': return '📋';
      case 'decision': return '❓';
      case 'end': return '✅';
      case 'reference': return '🔄';
      default: return '⚪';
    }
  };

  const handleNodeClick = (node: VisualNode) => {
    if (interactive && onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-auto">
      <svg
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="w-full h-full"
        style={{ minWidth: '800px', minHeight: '600px' }}
      >
        {/* Connections */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6B7280"
            />
          </marker>
        </defs>
        
        {connections.map((connection, index) => {
          const fromX = connection.from.x + connection.from.width / 2;
          const fromY = connection.from.y + connection.from.height;
          const toX = connection.to.x + connection.to.width / 2;
          const toY = connection.to.y;
          
          // Offset for multiple choices
          const choiceOffset = (connection.fromChoice || 0) * 20 - 10;
          const adjustedFromX = fromX + choiceOffset;
          
          const midY = fromY + (toY - fromY) / 2;
          
          return (
            <g key={index}>
              {/* Connection line */}
              <path
                d={`M ${adjustedFromX} ${fromY} Q ${adjustedFromX} ${midY} ${toX} ${toY}`}
                stroke="#6B7280"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Label */}
              {connection.label && (
                <g>
                  <rect
                    x={adjustedFromX - connection.label.length * 3}
                    y={midY - 10}
                    width={connection.label.length * 6}
                    height={20}
                    fill="white"
                    stroke="#6B7280"
                    strokeWidth="1"
                    rx="3"
                  />
                  <text
                    x={adjustedFromX}
                    y={midY + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#374151"
                  >
                    {connection.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {visualNodes.map((node) => (
          <g key={node.id}>
            {/* Node background */}
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="white"
              stroke={getNodeColor(node)}
              strokeWidth="2"
              rx="8"
              className={interactive ? 'cursor-pointer hover:opacity-80' : ''}
              onClick={() => handleNodeClick(node)}
            />
            
            {/* Node type indicator */}
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height="24"
              fill={getNodeColor(node)}
              rx="8"
            />
            <rect
              x={node.x}
              y={node.y + 16}
              width={node.width}
              height="8"
              fill={getNodeColor(node)}
            />
            
            {/* Node icon and type */}
            <text
              x={node.x + 12}
              y={node.y + 17}
              fontSize="14"
              fill="white"
            >
              {getNodeIcon(node)}
            </text>
            <text
              x={node.x + 32}
              y={node.y + 17}
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              {node.type === 'reference' ? 'HERBRUIKBAAR' : node.type.toUpperCase()}
            </text>
            
            {/* Node title */}
            <text
              x={node.x + node.width / 2}
              y={node.y + 42}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#1F2937"
            >
              {node.title.length > 25 ? `${node.title.substring(0, 25)}...` : node.title}
            </text>
            
            {/* Node instruction preview */}
            <text
              x={node.x + node.width / 2}
              y={node.y + 60}
              textAnchor="middle"
              fontSize="11"
              fill="#6B7280"
            >
              {node.instruction.length > 30 ? `${node.instruction.substring(0, 30)}...` : node.instruction}
            </text>
            
            {/* Start node indicator */}
            {node.id === flowchart.startNodeId && (
              <circle
                cx={node.x - 10}
                cy={node.y + node.height / 2}
                r="8"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
              />
            )}
          </g>
        ))}
        
        {/* Legend */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="160" height="120" fill="white" stroke="#E5E7EB" strokeWidth="1" rx="4" />
          <text x="8" y="16" fontSize="12" fontWeight="bold" fill="#1F2937">Legenda</text>
          
          <circle cx="16" cy="32" r="6" fill="#3B82F6" />
          <text x="28" y="36" fontSize="11" fill="#374151">Stap</text>
          
          <circle cx="16" cy="48" r="6" fill="#F59E0B" />
          <text x="28" y="52" fontSize="11" fill="#374151">Beslissing</text>
          
          <circle cx="16" cy="64" r="6" fill="#10B981" />
          <text x="28" y="68" fontSize="11" fill="#374151">Einde</text>
          
          <circle cx="16" cy="80" r="6" fill="#8B5CF6" />
          <text x="28" y="84" fontSize="11" fill="#374151">Herbruikbaar</text>
          
          <circle cx="16" cy="96" r="6" fill="#10B981" stroke="white" strokeWidth="2" />
          <text x="28" y="100" fontSize="11" fill="#374151">Start</text>
        </g>
      </svg>
    </div>
  );
};

export default FlowchartVisualizer;