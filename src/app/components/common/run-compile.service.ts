import { Injectable } from "@angular/core";
// import { Subject } from "rxjs/Subject";
import { ICompileRequest } from "../api/compile.model";
import { PostCompileService } from "../api/compile.service";
import { ICheckboxOption, LanguageModel } from "../compiler/compiler.model";
import { TabModel } from "../editor-tab/editor-tab.model";

@Injectable()
export class RunCompileService {
  // private runCompileSubject = new Subject<IRunCompileModel>();

  constructor(private compileApi: PostCompileService) {}

  /**
   * Post compile request.
   *
   * @param {string} stdin
   * @param {Array<TabModel>} tabs
   * @param {LanguageModel} language
   * @param {boolean} save
   * @returns
   * @memberof RunCompileService
   */
  public run$(
    stdin: string,
    tabs: TabModel[],
    language: LanguageModel,
    save: boolean
  ) {
    return this.compileApi.postCompile$(
      this.createRequestParams(stdin, tabs, language, save)
    );
  }

  /**
   * Post compile request event stream enable.
   * NOTE: this method created observables must be unsubscribe when all process done.
   *
   * @param {string} stdin
   * @param {Array<TabModel>} tabs
   * @param {LanguageModel} language
   * @param {boolean} save
   * @memberof RunCompileService
   */
  public runOnEventSource$(
    stdin: string,
    tabs: TabModel[],
    language: LanguageModel,
    save: boolean
  ) {
    return this.compileApi.postCompileEventStream$(
      this.createRequestParams(stdin, tabs, language, save)
    );
  }

  /**
   * Post compile request and get response with NDJSON.
   * NOTE: this method created observables must be unsubscribe when all process done.
   *
   * @param {string} stdin
   * @param {Array<TabModel>} tabs
   * @param {LanguageModel} language
   * @param {boolean} save
   * @memberof RunCompileService
   */
  public runOnNDJSON$(
    stdin: string,
    tabs: TabModel[],
    language: LanguageModel,
    save: boolean
  ) {
    return this.compileApi.postCompileNDJSON$(
      this.createRequestParams(stdin, tabs, language, save)
    );
  }

  /**
   * Create compile request params
   *
   * @param {string} stdin
   * @param {Array<TabModel>} tabs
   * @param {LanguageModel} language
   * @returns
   * @memberof RunCompileService
   */
  private createRequestParams(
    stdin: string,
    tabs: TabModel[],
    language: LanguageModel,
    save: boolean
  ) {
    const code = tabs[0].editorContent;
    const codes =
      tabs.length > 1
        ? tabs
            .filter((_v, i) => i !== 0) // split of tabs head and later.
            .map(v => ({
              code: v.editorContent,
              file: v.fileName
            }))
        : [];
    const selectCompiler = language.selectedCompiler;
    const compiler = selectCompiler.name;
    const options = selectCompiler.options
      .filter(v => v.type !== "checkbox" || (v.item as ICheckboxOption).checked)
      .filter(v => v.item.value.length > 0)
      .map(v => v.item.value)
      .join(",");

    const compileOptionRawIndex = selectCompiler.options.findIndex(
      v => v.type === "compile"
    );
    const runtimeOptionRawIndex = selectCompiler.options.findIndex(
      v => v.type === "runtime"
    );

    const [compilerOptionRaw, runtimeOptionRaw] = [
      compileOptionRawIndex !== -1
        ? selectCompiler.options[compileOptionRawIndex].item.value
        : undefined,
      runtimeOptionRawIndex !== -1
        ? selectCompiler.options[runtimeOptionRawIndex].item.value
        : undefined
    ];

    return {
      code,
      codes,
      compiler,
      "compiler-option-raw": compilerOptionRaw,
      options,
      "runtime-option-raw": runtimeOptionRaw,
      save,
      stdin
    } as ICompileRequest;
  }
}

// interface IRunCompileModel {
//   language: string;
//   request: ICompileRequest;
//   compiler: CompilerModel;
//   tabs: TabModel[];
// }
