import { harmonizeNode, upperCaseNode, ftpReader } from './node.test';
import { EtlWorkspace } from './workspace';

export const ws = new EtlWorkspace(1, 'DOSM Trade Job');
ws.addNode(ftpReader);
ws.addNode(upperCaseNode);
ws.addNode(harmonizeNode);

// operations
ws.start();
ws.pause();
ws.resume();
