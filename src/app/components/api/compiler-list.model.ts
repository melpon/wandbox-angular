export interface ICompilerInfo {
  "compiler-option-raw": boolean;
  "runtime-option-raw": boolean;
  "display-compile-command": string;
  "display-name": string;
  language: string;
  name: string;
  provider: number;
  templates: string[];
  version: string;
  switches: ICompilerFlagInfo[] | ICompilerFlagSelectionInfo[];
}

export interface ICompilerFlagInfo {
  default: boolean;
  name: string;
  "display-flags": string;
  "display-name": string;
}

export interface ICompilerFlagSelectionInfo {
  default: string;
  options: ICompilerFlagSelectionItemInfo[];
}

export interface ICompilerFlagSelectionItemInfo {
  name: string;
  "display-flags": string;
  "display-name": string;
}
