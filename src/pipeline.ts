import { Workspace } from './workspace';

export interface Pipeline {
  addWorkspace(workspace: Workspace): void;
  removeWorkspace(workspace: Workspace): void;
}

export interface StartablePipeline {
  start(): void;
}

export interface SchedulablePipeline {
  schedule(cron: string): void;
}

export class BasicPipeline
  implements Pipeline, StartablePipeline, SchedulablePipeline {
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
  start(): void {
    throw new Error('Method not implemented.');
  }
  schedule(cron: string): void {
    throw new Error('Method not implemented.');
  }
}
