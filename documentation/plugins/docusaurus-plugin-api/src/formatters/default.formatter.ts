import json2md from "json2md";
import { JSONOutput } from "typedoc";
import { MdTransformer } from "../md/md.transformer";
import { PluginOptions } from "../types/package.types";

export const defaultFormatter = (
  value: JSONOutput.DeclarationReflection,
  options: PluginOptions,
  pkg: string,
): string => {
  const transformer = new MdTransformer(value, options, pkg);

  return json2md([
    ...transformer.getName(),
    ...transformer.getBadges(),
    ...transformer.getMainLine(),
    ...transformer.getAdmonitionsType("deprecated"),
    ...transformer.getAdmonitionsType("danger"),
    ...transformer.getPreview(),
    ...transformer.getDescription(true),
    ...transformer.getAdmonitionsType("info"),
    ...transformer.getAdmonitionsType("tip"),
    ...transformer.getAdmonitionsType("note"),
    ...transformer.getAdmonitionsType("caution"),
    ...transformer.getExample(),
    ...transformer.getImport(),
    ...transformer.getParameters(),
    ...transformer.getMethods(),
  ]);
};
