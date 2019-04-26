import { Node } from "./node";

export interface Workspace {
  id: number;
  title: string;
  nodes: Node[];
  addNode(node: Node): void;
  removeNode(node: Node): void;

  start(): void;
  pause(): void;
  resume(): void;
  stop(): void;
}

export interface NodeRelationship {
  id: number;
  title: string;
  sourceNode: Node;
  destNode: Node;
}

export class EtlWorkspace implements Workspace {
  id: number;
  title: string;
  nodes: Node[];
  relationships: NodeRelationship[];
  currNode: Node;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
    this.nodes = [];
    this.currNode = this.nodes[0];
  }
  addNode(node: Node): void {
    this.nodes.push(node);
  }
  removeNode(node: Node): void {
    this.nodes = this.nodes.filter(n => n.id !== node.id);
  }
  start(): void {
    while (this.currNode) {
      this.currNode.run();
      this.currNode = this.currNode.relationships[0].node;
      // TODO: repeat recursively for all relationships
    }
  }
  pause(): void {
    // instruct worker to stop subscribing to the message broker
    throw new Error("Method not implemented.");
  }
  resume(): void {
    // instruct worker to start subscribing again
    throw new Error("Method not implemented.");
  }
  stop(): void {
    // clear queue
    // reset currNode
    throw new Error("Method not implemented.");
  }
}

export interface WorkspaceManager {
  addWorkspace(workspace: Workspace): void;
  removeWorkspace(workspace: Workspace): void;
}

export class BasicWorkspaceManager implements WorkspaceManager {
  workspaces: Workspace[];
  constructor() {
    this.workspaces = [];
  }
  addWorkspace(workspace: Workspace): void {
    this.workspaces.push(workspace);
  }
  removeWorkspace(workspace: Workspace): void {
    this.workspaces = this.workspaces.filter(ws => ws.id !== workspace.id);
  }
}
