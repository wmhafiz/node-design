import {
  EtlNode,
  HarmonizeTransformer,
  UpperCaseTransformer,
  FtpReader,
} from './node';
import { TextReplacerMethod } from './text-replacer';

export const ftpReader = new EtlNode(
  1,
  'Extract From FTP',
  new FtpReader({
    host: 'localhost',
    port: 22,
    username: 'wmhafiz',
    password: 'mysuperpassword',
    sourcePath: '/home/source_path',
    destPath: '/home/dest_path',
  })
);
const ftpReaderOutput = ftpReader.run();

export const upperCaseNode = new EtlNode(
  2,
  'Uppercase Company Name',
  new UpperCaseTransformer({
    destField: 'companyName_upper',
    sourceField: 'companyName',
  }),
  ftpReaderOutput
);
const upperCaseOutput = upperCaseNode.run();

export const harmonizeNode = new EtlNode(
  3,
  'Harmonize Company Name',
  new HarmonizeTransformer({
    destField: 'companyName_std',
    dict,
    sourceField: 'companyName_upper',
  }),
  upperCaseOutput
);
const finalOutput = harmonizeNode.run();

const dict = {
  entries: [
    {
      key1: 'Sendirian',
      key2: 'SDN',
      method: TextReplacerMethod.WORD,
    },
    {
      key1: 'SND',
      key2: 'SDN',
      method: TextReplacerMethod.WORD,
    },
  ],
};
