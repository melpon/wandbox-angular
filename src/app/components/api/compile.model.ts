export interface ICompileRequest {
  compiler: string;
  code: string;
  codes: ICodeListModel[];
  options: string;
  stdin: string;
  save: boolean;
  "compiler-option-raw": string;
  "runtime-option-raw": string;
}

export interface ICodeListModel {
  code: string;
  file: string;
}

export interface ICompileResponse {
  status: string;
  signal: string;
  compiler_output: string;
  compiler_error: string;
  compiler_message: string;
  program_output: string;
  program_error: string;
  program_message: string;
  permlink?: string;
  url?: string;
}
