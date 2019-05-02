import { Controller } from './controller';

export interface Pipeline {
  addWorkspace(controller: Controller): void;
  removeWorkspace(controller: Controller): void;
}

export interface StartablePipeline {
  start(): void;
}

export interface SchedulablePipeline {
  schedule(cron: string): void;
}

export class BasicPipeline
  implements Pipeline, StartablePipeline, SchedulablePipeline {
  controllers: Controller[];
  constructor() {
    this.controllers = [];
  }
  addWorkspace(controller: Controller): void {
    this.controllers.push(controller);
  }
  removeWorkspace(controller: Controller): void {
    this.controllers = this.controllers.filter(ws => ws.id !== controller.id);
  }
  start(): void {
    throw new Error('Method not implemented.');
  }
  schedule(cron: string): void {
    throw new Error('Method not implemented.');
  }
}
