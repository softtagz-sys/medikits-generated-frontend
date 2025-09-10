export interface FlowchartNode {
  id: string;
  type: 'step' | 'decision' | 'end' | 'reference';
  title: string;
  instruction: string;
  instructionFirstResponder?: string;
  image?: string;
  position?: { x: number; y: number };
  
  // For decision nodes
  choices?: {
    text: string;
    nextNodeId: string;
    condition?: string;
  }[];
  
  // For reference nodes (reusable steps)
  referenceId?: string;
  
  // For end nodes
  endType?: 'success' | 'continue' | 'emergency';
  endMessage?: string;
  
  // Visual properties
  color?: string;
  icon?: string;
}

export interface Flowchart {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  startNodeId: string;
  nodes: FlowchartNode[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface ReusableStep {
  id: string;
  name: string;
  title: string;
  instruction: string;
  instructionFirstResponder?: string;
  image?: string;
  type: 'common' | 'emergency' | 'assessment';
  tags: string[];
  usageCount: number;
}

export interface FlowchartTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Omit<FlowchartNode, 'id'>[];
  connections: { from: string; to: string; label?: string }[];
}