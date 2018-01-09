import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core";
import { PermlinkService } from "../api/permlink.service";
import { RunCompileService } from "../common/run-compile.service";
import { CompileResultTabComponent } from "../compile-result-tab/compile-result-tab.component";
import { LanguageModel } from "../compiler/compiler.model";
import { TabModel } from "../editor-tab/editor-tab.model";
import { CompileComponentModel, CompileResultModel } from "./compile.model";

@Component({
  selector: "wandbox-compile",
  styleUrls: ["./compile.component.css"],
  templateUrl: "./compile.component.html"
})
export class CompileComponent {
  @Output() public compile = new EventEmitter();

  @Input() public tabs: TabModel[];
  @Input() public stdin: string;
  @Input() public selectedLanguage: LanguageModel;

  @ViewChild(CompileResultTabComponent)
  public resultTabComponent: CompileResultTabComponent;

  public model = new CompileComponentModel();

  constructor(
    private runCompile: RunCompileService,
    private permlink: PermlinkService
  ) {
    if (this.permlink.requested) {
      this.permlink.checkPermlink$.subscribe(res => {
        const { result, parameter } = res;

        const permlinkTab = new CompileResultModel();
        permlinkTab.tabName = "permlink";
        permlinkTab.programMessage = result.program_message;
        permlinkTab.programOutout = result.program_output;
        permlinkTab.compilerErrorMessage = result.compiler_error;
        permlinkTab.programErrorMessage = result.program_error;
        permlinkTab.signalMessage = result.signal;
        permlinkTab.status = +(result.status !== undefined
          ? result.status
          : -1);
        permlinkTab.stdin = parameter.stdin;

        permlinkTab.languageInfo = new LanguageModel();
        permlinkTab.languageInfo.languageName =
          parameter["compiler-info"].language;
        permlinkTab.languageInfo.addCompiler(parameter["compiler-info"]);

        permlinkTab.tabs = [];

        const sourceTab = new TabModel();
        sourceTab.fileName = "";
        sourceTab.editorContent = parameter.code;

        permlinkTab.tabs.push(sourceTab);

        if (parameter.codes && parameter.codes.length > 0) {
          for (const code of parameter.codes) {
            const tab = new TabModel();
            tab.fileName = code.file;
            tab.editorContent = code.code;
            permlinkTab.tabs.push(tab);
          }
        }

        // push to head
        this.model.compileResults.splice(0, 0, permlinkTab);
        this.model.activeResultIndex = 0;
      });
    }
  }

  /**
   * Handle compile button.
   *
   * @memberof CompileComponent
   */
  public postCompile() {
    if (this.model.compiling) {
      return;
    }
    this.model.compiling = true;
    const result = new CompileResultModel();
    result.tabName = (this.model.compileCount + 1).toString();
    this.model.compileCount++;
    // push to head
    this.model.compileResults.splice(0, 0, result);
    this.model.activeResultIndex = 0;

    // TODO: ディープコピーが適当すぎる
    result.languageInfo = this.selectedLanguage;
    result.tabs = JSON.parse(JSON.stringify(this.tabs));
    result.stdin = this.stdin;

    const subscription = this.runCompile
      .runOnNDJSON$(this.stdin, this.tabs, this.selectedLanguage, false)
      .subscribe(
        event => {
          console.log("compile", event);
          switch (event.type) {
            case "open":
              break;
            case "timeout":
            case "error":
            case "exception":
              result.outputLines.push({
                message: "Finish",
                type: "Control"
              });
              result.resultFetched = true;
              this.model.compiling = false;
              subscription.unsubscribe();
              break;

            case "message":
              if (result.outputLines.length > 0) {
                const eventOutput =
                  result.outputLines[result.outputLines.length - 1];
                if (eventOutput.type === event.messageType!) {
                  eventOutput.message += event.payload!;
                  break;
                }
              }
              result.outputLines.push({
                message: event.payload!,
                type: event.messageType!
              });
              break;
          }
        },
        () => {
          subscription.unsubscribe();
          result.resultFetched = true;
          this.model.compiling = false;
        },
        () => {
          subscription.unsubscribe();
          result.resultFetched = true;
          this.model.compiling = false;
        }
      );
  }

  public removeTab(index: number) {
    this.model.compileResults.splice(index, 1);
  }

  public changeTab(index: number) {
    this.model.activeResultIndex = index;
  }
}
