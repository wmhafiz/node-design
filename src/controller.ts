import { Node } from './node';

export interface Controller {
  id: number;
  title: string;
  nodes: Node[];
  relationships: NodeRelationship[];
  addNode(node: Node): void;
  removeNode(node: Node): void;
  addRelationship(rel: NodeRelationship): void;
  removeRelationship(relationshipID: number): void;

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

export class EtlController implements Controller {
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
  addRelationship(rel: NodeRelationship): void {
    throw new Error('Method not implemented.');
  }
  removeRelationship(relationshipID: number): void {
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
  resume(): void {
    // instruct worker to start subscribing again
    throw new Error('Method not implemented.');
  }
  stop(): void {
    // clear queue
    // reset currNode
    throw new Error('Method not implemented.');
  }
}
