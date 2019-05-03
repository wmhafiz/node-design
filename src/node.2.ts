import { FtpParameter } from './node';

export interface Node {
  id: number;
  title: string;
  run(): Data[];
}

export class EtlNode implements Node {
  id: number;
  title: string;
  command: Command;
  inputs: Data[];

  constructor(id: number, title: string, command: Command, inputs?: Data[]) {
    this.id = id;
    this.command = command;
    this.title = title;
  }

  run(): Data[] {
    const result = this.command.execute(this.inputs);
    return result;
  }
}

abstract class Command {
  inputs: Data[];
  constructor(parameter: Parameter) {
    this.parameter = parameter;
  }
  abstract execute(inputs: Data[]): Data[];
}

abstract class AbstractTransformer extends Command {
  execute(inputs: Data[]): Data[] {
    // loop all data & call _transform
    throw new Error('Method not implemented.');
  }
  abstract _transform(text: string): string;
}

abstract class AbstractReader extends Command {
  constructor(parameter: ServiceParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 0,
      maxInputs: 0,
      minOutputs: 1,
      maxOutputs: 1,
    };
    super(attr, parameter);
  }
}

abstract class AbstractWriter extends Command {
  constructor(parameter: ServiceParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 0,
      maxOutputs: 0,
    };
    super(attr, parameter);
  }
}

export class MySqlReader extends AbstractReader {
  mysqlParameter: MySQLParameter;
  constructor(parameter: MySQLParameter) {
    super(parameter);
  }
  execute(inputs: Data[]): Data[] {
    throw new Error('Not implemented');
  }
}

export class MySqlWriter extends AbstractWriter {
  mysqlParameter: MySQLParameter;
  constructor(parameter: MySQLParameter) {
    super(parameter);
  }
  execute(inputs: Data[]): Data[] {
    throw new Error('Not implemented');
  }
}

export class FtpReader extends AbstractReader {
  ftpParameter: FtpParameter;
  constructor(parameter: FtpParameter) {
    super(parameter);
  }
  execute(inputs: Data[]): Data[] {
    throw new Error('Not implemented');
  }
}

export class FtpWriter extends AbstractWriter {
  ftpParameter: FtpParameter;
  constructor(parameter: FtpParameter) {
    super(parameter);
  }
  execute(inputs: Data[]): Data[] {
    throw new Error('Not implemented');
  }
}

export interface ServiceParameter extends Parameter {
  host: string;
  username: string;
  password: string;
  port: number;
}

export interface FtpParameter extends ServiceParameter {
  sourcePath: string;
  destPath: string;
}

export interface MySQLParameter extends ServiceParameter {
  tableName: string;
  prefix: string;
}

export class UpperCaseTransformer extends AbstractTransformer {
  constructor(parameter: TransformerParameter) {
    const attr: ProcessorAttributes = {
      minInputs: 1,
      maxInputs: 1,
      minOutputs: 1,
      maxOutputs: 1,
    };
    super(attr, parameter);
  }
  _transform(text: string): string {
    return text.toUpperCase();
  }
}

export class HarmonizeTransformer extends AbstractTransformer {
  dictTransformerParameter: DictionaryTransformerParameter;
  textReplacerFactory: TextReplacerFactory;
  constructor(parameter: DictionaryTransformerParameter) {
    super(parameter);
  }
  _transform(text: string): string {
    this.parameter.dict.entries.forEach(e => {
      const replacer = TextReplacerFactory.create(e.method);
      if (text === e.key1) return replacer.replace(text, e.key1, e.key2);
    });
    return text;
  }
}

export class LookupTransformer extends AbstractTransformer {
  lookupParameter: LookupParameter;
  constructor(parameter: LookupParameter) {
    super(parameter);
  }
  _transform(text: string): string {
    this.parameter.dict.entries.forEach(e => {
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

export interface Data {
  base: any;
  meta: any;
}

export abstract class TextReplacer {
  replace(text: string, searchValue: string, replaceValue: string): string {
    return text.replace(searchValue, this._getRegex(replaceValue));
  }

  protected abstract _getRegex(replaceValue: string): string;
}

export class WordReplacer extends TextReplacer {
  _getRegex(replaceValue: string): string {
    return `\\b${replaceValue}\\b`;
  }
}

export class SpecialReplacer extends TextReplacer {
  _getRegex(replaceValue: string): string {
    return `[${replaceValue}]`;
  }
}

export class ExactReplacer extends TextReplacer {
  _getRegex(replaceValue: string): string {
    return replaceValue;
  }
}
export enum TextReplacerMethod {
  WORD,
  SPECIAL,
  EXACT,
}

export class TextReplacerFactory {
  static create(method: TextReplacerMethod): TextReplacer {
    switch (method) {
      case TextReplacerMethod.WORD:
        return new WordReplacer();
      case TextReplacerMethod.SPECIAL:
        return new SpecialReplacer();
      default:
      case TextReplacerMethod.EXACT:
        return new ExactReplacer();
    }
  }
}
