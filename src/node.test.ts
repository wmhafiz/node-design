import {
  EtlNode,
  HarmonizeTransformer,
  Input,
  UpperCaseTransformer,
  FtpReader,
  NodeRelationshipType
} from "./node";
import { TextReplacerMethod } from "./text-replacer";

const inputs: Input[] = [
  {
    data: [
      {
        base: {
          brn: "123",
          companyName: "Telekom Malysia Sendirian Berhad"
        },
        meta: {}
      }
    ]
  }
];

const dict = {
  entries: [
    {
      key1: "Sendirian",
      key2: "SDN",
      method: TextReplacerMethod.WORD
    },
    {
      key1: "SND",
      key2: "SDN",
      method: TextReplacerMethod.WORD
    }
  ]
};

export const ftpReader = new EtlNode(
  1,
  "Extract From FTP",
  new FtpReader({
    host: "localhost",
    port: 22,
    username: "wmhafiz",
    password: "mysuperpassword",
    sourcePath: "/home/source_path",
    destPath: "/home/dest_path"
  })
);

export const upperCaseNode = new EtlNode(
  2,
  "Uppercase Company Name",
  new UpperCaseTransformer(inputs, {
    destField: "companyName_upper",
    sourceField: "companyName"
  })
);

export const harmonizeNode = new EtlNode(
  3,
  "Harmonize Company Name",
  new HarmonizeTransformer(inputs, {
    destField: "companyName_std",
    dict,
    sourceField: "companyName_upper"
  })
);

ftpReader.addRelationship({
  node: upperCaseNode,
  type: NodeRelationshipType.OUTPUT,
  index: 1
});

upperCaseNode.addRelationship({
  node: harmonizeNode,
  type: NodeRelationshipType.OUTPUT,
  index: 1
});

const ftpReaderOutput = ftpReader.run();
const upperCaseOutput = upperCaseNode.run();
const harmonizedOutput = harmonizeNode.run();
