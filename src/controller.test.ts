import { harmonizeNode, upperCaseNode, ftpReader } from './node.test';
import { EtlController } from './controller';

export const controller = new EtlController(1, 'Simple ETL Job');
controller.addNode(ftpReader);
controller.addNode(upperCaseNode);
controller.addNode(harmonizeNode);

controller.addRelationship({
  id: 1,
  title: 'Ftp Output',
  sourceNode: ftpReader,
  destNode: upperCaseNode,
});

controller.addRelationship({
  id: 2,
  title: 'Uppercase Output',
  sourceNode: upperCaseNode,
  destNode: harmonizeNode,
});

// operations
controller.start();
controller.pause();
controller.resume();
