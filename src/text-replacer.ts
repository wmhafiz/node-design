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
  EXACT
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
