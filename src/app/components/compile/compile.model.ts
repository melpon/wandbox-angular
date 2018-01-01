import { LanguageModel } from "../compiler/compiler.model";
import { TabModel } from "../editor-tab/editor-tab.model";

export class CompileResultModel {
  public tabName: string;
  public languageInfo: LanguageModel;
  public stdin: string;
  public tabs: TabModel[];
  public activeSourceTabIndex = 0;
  public programOutout: string;
  public programMessage: string;
  public programErrorMessage: string;
  public compilerErrorMessage: string;
  public signalMessage: string;
  public status: number;

  public eventSource: boolean;
  public outputLines: EventOutput[] = [];

  public showCode: boolean;
  public resultFetched = false;

  public shareResult: ShareResultModel | null = null;

  get languageName() {
    return this.languageInfo.languageName;
  }

  get compilerName() {
    const c = this.languageInfo.selectedCompiler;
    return c ? c.displayName + " " + c.version : "";
  }

  get activeTab() {
    return this.tabs[this.activeSourceTabIndex];
  }
}

export class CompileComponentModel {
  public compileResults = new Array<CompileResultModel>();
  public activeResultIndex = -1;
  public compiling = false;
  public enableEventSource = false;
  public compileCount = 0;
}

export class ShareResultModel {
  public isFetched = false;
  public url?: string;
}

export class EventOutput {
  public type: string;
  public message: string;
}
