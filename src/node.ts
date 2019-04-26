import { TextReplacerFactory, TextReplacerMethod } from "./text-replacer";

export interface Node {
  id: number;
  title: string;
  relationships: NodeRelationship[];
  addRelationship(rel: NodeRelationship): void;
  removeRelationship(relationshipID: number): void;
  run(): Output[];
}

export interface CommandAttributes {
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

export class EtlNode implements Node {
  id: number;
  title: string;
  command: Command;
  relationships: NodeRelationship[];

  constructor(id: number, title: string, command: Command) {
    this.id = id;
    this.command = command;
    this.title = title;
    this.relationships = [];
  }

  addRelationship(rel: NodeRelationship): void {
    this.relationships.push(rel);
  }

  removeRelationship(relationshipID: number): void {
    this.relationships = this.relationships.filter(
      rel => rel.id !== relationshipID
    );
  }

  run(): Output[] {
    return this.command.execute();
  }
}

export interface Command {
  execute(): Output[];
}

abstract class Processor {
  attributes: CommandAttributes;
  inputs: Input[];
  parameter: Parameter;
  constructor(inputs: Input[], attr: CommandAttributes, parameter: Parameter) {
    this.inputs = inputs;
    this.attributes = attr;
    this.parameter = parameter;
  }
  abstract execute(): Output[];
}

abstract class AbstractTransformer extends Processor {
  execute(): Output[] {
    // loop all data & call _transform
    throw new Error("Method not implemented.");
  }
  abstract _transform(text: string): string;
}

abstract class AbstractReader extends Processor {
  constructor(parameter: ReaderParameter) {
    const attr: CommandAttributes = {
      minInputs: 0,
      maxInputs: 0,
      minOutputs: 1,
      maxOutputs: 1
    };
    super([], attr, parameter);
  }
}

export class FtpReader extends AbstractReader {
  constructor(parameter: FtpReaderParameter) {
    super(parameter);
  }
  execute(): Output[] {
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
  constructor(inputs: Input[], parameter: TransformerParameter) {
    const attr: CommandAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 1,
      maxOutputs: 1
    };
    super(inputs, attr, parameter);
  }
  _transform(text: string): string {
    return text.toUpperCase();
  }
}

export class HarmonizeTransformer extends AbstractTransformer {
  dict: Dictionary;
  constructor(inputs: Input[], parameter: DictionaryTransformerParameter) {
    const attr: CommandAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 1,
      maxOutputs: 1
    };
    super(inputs, attr, parameter);
  }
  _transform(text: string): string {
    this.dict.entries.forEach(e => {
      const replacer = TextReplacerFactory.create(e.method);
      if (text === e.key1) return replacer.replace(text, e.key1, e.key2);
    });
    return text;
  }
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

export interface Input {
  data: Data[];
}

export interface Output {
  data: Data[];
  nextNode?: Node;
}

export interface Data {
  base: any;
  meta: any;
}
