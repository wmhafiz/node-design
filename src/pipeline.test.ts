import { BasicPipeline } from './pipeline';
import { controller } from './controller.test';

const pipeline = new BasicPipeline();

pipeline.addWorkspace(controller);
pipeline.schedule('	0 0 12 1/1 * ? *');

pipeline.start();
