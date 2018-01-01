import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RunCompileService } from "../common/run-compile.service";
import {
  CompileResultModel,
  EventOutput,
  ShareResultModel
} from "../compile/compile.model";
import { TabModel } from "../editor-tab/editor-tab.model";

@Component({
  selector: "wandbox-compile-result-tab",
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
    const shareResult = new ShareResultModel();
    this.compileService
      .run$(
        this.selectedResult.stdin,
        this.selectedResult.tabs,
        this.selectedResult.languageInfo,
        true
      )
      .subscribe(res => {
        shareResult.url = res.permlink;
        shareResult.isFetched = true;
        this.selectedResult.shareResult = shareResult;
      });
  }

  public compileResultTrackBy(
    index: number,
    _item: CompileResultModel
  ): number {
    return index;
  }
  public tabTrackBy(index: number, _item: TabModel): number {
    return index;
  }
  public lineTrackBy(index: number, _item: EventOutput): number {
    return index;
  }
}
