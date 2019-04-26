import { TextReplacerFactory, TextReplacerMethod } from "./text-replacer";

export interface Node {
  id: number;
  title: string;
  relationships: NodeRelationship[];
  addRelationship(rel: NodeRelationship): void;
  removeRelationship(relationshipID: number): void;
  run(): Data[];
}

export class EtlNode implements Node {
  id: number;
  title: string;
  command: Command;
  inputs: Data[];
  relationships: NodeRelationship[];
  status: NodeStatus;

  constructor(id: number, title: string, command: Command, inputs?: Data[]) {
    this.id = id;
    this.command = command;
    this.title = title;
    this.inputs = inputs || [];
    this.relationships = [];
    this.status = NodeStatus.NOT_STARTED;
  }

  addRelationship(rel: NodeRelationship): void {
    this.relationships.push(rel);
  }

  removeRelationship(relationshipID: number): void {
    this.relationships = this.relationships.filter(
      rel => rel.node.id !== relationshipID
    );
  }

  run(): Data[] {
    this.status = NodeStatus.RUNNING;
    const result = this.command.execute(this.inputs);
    this.status = NodeStatus.FINISHED;
    return result;
  }
}

export interface Command {
  execute(inputs: Data[]): Data[];
}

abstract class Processor implements Command {
  attributes: ProcessorAttributes;
  inputs: Data[];
  parameter: Parameter;
  constructor(attr: ProcessorAttributes, parameter: Parameter) {
    this.attributes = attr;
    this.parameter = parameter;
  }
  abstract execute(inputs: Data[]): Data[];
}

abstract class AbstractTransformer extends Processor {
  execute(inputs: Data[]): Data[] {
    // loop all data & call _transform
    throw new Error("Method not implemented.");
  }
  abstract _transform(text: string): string;
}

abstract class AbstractReader extends Processor {
  constructor(parameter: ReaderParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 0,
      maxInputs: 0,
      minOutputs: 1,
      maxOutputs: 1
    };
    super(attr, parameter);
  }
}

export class FtpReader extends AbstractReader {
  constructor(parameter: FtpReaderParameter) {
    super(parameter);
  }
  execute(inputs: Data[]): Data[] {
    throw new Error("Not implemented");
  }
}

export interface ReaderParameter extends Parameter {
  host: string;
  username: string;
  password: string;
  port: number;
}

export interface FtpReaderParameter extends ReaderParameter {
  sourcePath: string;
  destPath: string;
}

export class UpperCaseTransformer extends AbstractTransformer {
  constructor(parameter: TransformerParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 1,
      maxOutputs: 1
    };
    super(attr, parameter);
  }
  _transform(text: string): string {
    return text.toUpperCase();
  }
}

export class HarmonizeTransformer extends AbstractTransformer {
  dict: Dictionary;
  constructor(parameter: DictionaryTransformerParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 1,
      maxOutputs: 1
    };
    super(attr, parameter);
  }
  _transform(text: string): string {
    this.dict.entries.forEach(e => {
      const replacer = TextReplacerFactory.create(e.method);
      if (text === e.key1) return replacer.replace(text, e.key1, e.key2);
    });
    return text;
  }
}

export interface ProcessorAttributes {
  maxInputs: number;
  minInputs: number;
  maxOutputs: number;
  minOutputs: number;
}

export interface NodeRelationship {
  node: Node;
  type: NodeRelationshipType;
  index: number;
}

export enum NodeRelationshipType {
  INPUT,
  OUTPUT
}

export interface Parameter {}

export interface TransformerParameter extends Parameter {
  sourceField: string;
  destField: string;
}

export interface LookupParameter extends TransformerParameter {
  lookupTable: string;
}

export interface DictionaryTransformerParameter extends TransformerParameter {
  dict: Dictionary;
}

export interface Dictionary {
  entries: DictionaryEntry[];
}

export interface DictionaryEntry {
  key1: string;
  key2: string;
  method: TextReplacerMethod;
}

export interface Data {
  base: any;
  meta: any;
}

export enum NodeStatus {
  NOT_STARTED,
  RUNNING,
  FINISHED,
  ERROR
}
