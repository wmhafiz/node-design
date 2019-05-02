import { BasicPipeline } from './pipeline';
import { ws } from './controller.test';

const pipeline = new BasicPipeline();

pipeline.addWorkspace(ws);
pipeline.schedule('	0 0 12 1/1 * ? *');

pipeline.start();
