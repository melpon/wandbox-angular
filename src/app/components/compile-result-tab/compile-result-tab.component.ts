import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RunCompileService } from "../common/run-compile.service";
import { CompileResultModel, ShareResultModel } from "../compile/compile.model";
import {} from "./compiler-result.model";

@Component({
  selector: "sg-compile-result-tab",
  styleUrls: ["./compile-result-tab.component.css"],
  templateUrl: "./compile-result-tab.component.html"
})
export class CompileResultTabComponent {
  @Input() public results: CompileResultModel[];
  @Output() public changeTab = new EventEmitter<number>();
  @Output() public removeTab = new EventEmitter<number>();

  @Input() public activeIndex: number;

  private emptyTab = new CompileResultModel();

  get selectedResult() {
    return this.results[this.activeIndex] || this.emptyTab;
  }

  constructor(private compileService: RunCompileService) {
    this.emptyTab.tabs = [];
    // this.compileService.executeCompile().subscribe(v => {
    //     this.activeIndex = this.results.length - 1;
    // });
  }

  public activationSourceTab(index: number) {
    this.selectedResult.activeSourceTabIndex = index;
  }

  public activationResultTab(index: number) {
    this.changeTab.emit(index);
  }

  public clickRemoveTab(index: number) {
    this.removeTab.emit(index);
    if (this.activeIndex >= this.results.length) {
      this.activationResultTab(this.results.length - 1);
    }
    console.log(this.activeIndex);
  }

  public onShare() {
    if (
      !this.selectedResult.resultFetched ||
      this.selectedResult.shareResult != null
    ) {
      return;
    }
    this.selectedResult.shareResult = new ShareResultModel();
    this.compileService
      .run$(
        this.selectedResult.stdin,
        this.selectedResult.tabs,
        this.selectedResult.languageInfo,
        true
      )
      .subscribe(res => {
        this.selectedResult.shareResult.url = res.permlink;
        this.selectedResult.shareResult.isFetched = true;
      });
  }
}
