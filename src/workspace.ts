import { Input, Node } from "./node";

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
    let inputs: Input[] = [];
    do {
      const outputs = this.currNode.run();
      inputs = [{ data: outputs[0].data }];
      this.currNode = outputs[0].nextNode;
    } while (this.currNode);
  }
  pause(): void {
    // instruct worker to stop subscribing to the message broker
  }
  resume(): void {
    this.currNode.run();
  }
  stop(): void {
    // clear queue
    // reset currNode
  }
}
