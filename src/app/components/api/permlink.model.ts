import { ICodeListModel, ICompileResponse } from "./compile.model";
import { ICompilerInfo } from "./compiler-list.model";

export interface IPermlinkResponse {
  parameter: IParameter;
  result: ICompileResponse;
}

export interface IParameter {
  code: string;
  codes?: ICodeListModel[];
  compiler: string;
  "compiler-info": ICompilerInfo;
  "compiler-option-raw": string;
  description: string;
  created_at: number;
  github_user: string;
  stdin: string;
  title: string;
}
