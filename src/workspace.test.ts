import { harmonizeNode, upperCaseNode, ftpReader } from "./node.test";
import { BasicWorkspaceManager, EtlWorkspace } from "./workspace";

const ws = new EtlWorkspace(1, "DOSM Trade Job");
ws.addNode(ftpReader);
ws.addNode(upperCaseNode);
ws.addNode(harmonizeNode);

// operations
ws.start();
ws.pause();
ws.resume();

const manager = new BasicWorkspaceManager();
manager.addWorkspace(ws);
