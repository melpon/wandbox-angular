import {
  ICompilerFlagInfo,
  ICompilerFlagSelectionInfo,
  ICompilerInfo
} from "../api/compiler-list.model";

export class LanguageModel {
  public languageName = "";
  public mime = "";
  public selectedCompilerIndex = 0;
  public compilers: CompilerModel[] = [];

  public get selectedCompiler() {
    return this.compilers[this.selectedCompilerIndex];
  }

  public addable(compiler: ICompilerInfo) {
    return this.languageName === compiler.language;
  }

  public addCompiler(compiler: ICompilerInfo) {
    const result = new CompilerModel();
    result.name = compiler.name;
    result.displayName = compiler["display-name"];
    result.version = compiler.version;
    result.template = compiler.templates[0] || "";
    result.compileCommand = compiler["display-compile-command"];
    result.options = [];
    for (const flag of compiler.switches) {
      const option = new CompilerOptionModel();
      if (typeof flag.default === "boolean") {
        const compilerFlag = flag as ICompilerFlagInfo;
        option.type = "checkbox";
        option.item = {
          checked: compilerFlag.default,
          displayFlag: compilerFlag["display-flags"],
          name: compilerFlag["display-name"],
          value: compilerFlag.name
        };
      } else {
        const selectionFlag = flag as ICompilerFlagSelectionInfo;
        option.type = "select";
        option.item = {
          displayFlags: selectionFlag.options.map(v => v["display-flags"]),
          name: "",
          names: selectionFlag.options.map(v => v["display-name"]),
          value: selectionFlag.default,
          values: selectionFlag.options.map(v => v.name)
        };
      }
      result.options.push(option);
    }

    if (compiler["compiler-option-raw"]) {
      result.options.push({
        item: {
          name: "Compiler options",
          value: ""
        },
        type: "compile"
      });
    }

    // if (compiler['runtime-option-raw']) {
    result.options.push({
      item: {
        name: "Runtime options",
        value: ""
      },
      type: "runtime"
    });
    // }
    this.compilers.push(result);
  }
}

export class CompilerModel {
  public name: string;
  public displayName: string;
  public compileCommand: string;
  public provider: number;
  public version: string;
  public template: string;
  public options: CompilerOptionModel[];

  get displayFlags(): string {
    return (
      this.options
        // textarea type and has value
        .filter(
          v =>
            (v.type === "compile" && v.item.value.length > 0) ||
            (v.type === "checkbox" && (v.item as ICheckboxOption).checked) ||
            v.type === "select"
        )
        .map(v => {
          if (v.type === "select") {
            const selectItem = v.item as ISelectBoxOption;
            const index = selectItem.values.findIndex(
              item => item === selectItem.value
            );
            return selectItem.displayFlags[index];
          } else if (v.type === "compile") {
            return v.item.value
              .split("\n")
              .filter(str => str.length > 0)
              .map(str => `"${str}"`)
              .join(" ");
          } else {
            return v.item.displayFlag;
          }
        })
        .join(" ")
    );
  }
}

export class CompilerOptionModel {
  public type: "checkbox" | "select" | "runtime" | "compile";
  public item: ICheckboxOption | ISelectBoxOption | TextAreaOption;
}

export interface IOptionItem {
  name: string;
  value: string;
  displayFlag?: string;
}

export interface ICheckboxOption extends IOptionItem {
  checked: boolean;
}

export type TextAreaOption = IOptionItem;

export interface ISelectBoxOption extends IOptionItem {
  names: string[];
  values: string[];
  displayFlags: string[];
}

export type OptionType = ICheckboxOption | ISelectBoxOption | TextAreaOption;

export class CompilerComponentModel {
  public selectedLangIndex = 0;
  public languages = new Array<LanguageModel>();
  public fetched = false;
  public errorMessage = "";
}
