import { TextReplacerFactory, TextReplacerMethod } from "./text-replacer";

const replacer = TextReplacerFactory.create(TextReplacerMethod.EXACT);
const result = replacer.replace("Hafiz Sendirian Berhad", "SENDIRIAN", "SDN");
