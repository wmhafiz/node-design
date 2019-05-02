import { harmonizeNode, upperCaseNode, ftpReader } from './node.test';
import { EtlController } from './controller';

export const ws = new EtlController(1, 'DOSM Trade Job');
ws.addNode(ftpReader);
ws.addNode(upperCaseNode);
ws.addNode(harmonizeNode);

// operations
ws.start();
ws.pause();
ws.resume();
