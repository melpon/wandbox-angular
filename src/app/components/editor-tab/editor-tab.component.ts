import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as rxjs from "rxjs/Rx";
import { EditorConfigModel } from "../editor/editor.model";
import { ITabChangedEvent, TabModel } from "./editor-tab.model";

import { PermlinkService } from "../api/permlink.service";
import { LocalStorageService } from "../common/local-storage.service";

@Component({
  selector: "wandbox-editor-tab",
  styleUrls: ["./editor-tab.component.css"],
  templateUrl: "./editor-tab.component.html"
})
export class TabComponent {
  @Input() public config: EditorConfigModel;
  @Input() public tabs: TabModel[];
  @Input() public activeIndex: number;

  @Output() public changed = new EventEmitter<ITabChangedEvent>();
  @Output() public compileCommand = new EventEmitter<void>();

  private tabCount = 1;
  private saveContentSubject = new rxjs.Subject<string>();

  constructor(
    private storage: LocalStorageService,
    private permlink: PermlinkService
  ) {
    this.saveContentSubject
      .asObservable()
      .filter(_ => !this.permlink.requested)
      .debounceTime(200)
      .subscribe(_ => {
        this.storage.setValue("tabs", this.tabs);
      });
  }

  /**
   * Tab element click event.
   *
   * @param {number} index clicked tab's index.
   * @memberof TabComponent
   */
  public tabClick(index: number) {
    if (this.activeIndex === index) {
      return;
    }
    this.toggleActive(index);
  }

  /**
   * Add tab button click event.
   *
   * @param {string} [fileName = `noname-${this.tabCount}`] default tab name.
   * @param {string} [content = ''] default tab content.
   * @memberof TabComponent
   */
  public addTab(fileName = `noname-${this.tabCount}`, content = "") {
    const newTab = new TabModel();
    if (this.tabs.some(v => v.fileName === fileName)) {
      fileName = `noname-${++this.tabCount}`;
    }
    newTab.fileName = fileName;
    newTab.editorContent = content;
    this.tabCount++;
    this.tabs.push(newTab);
    this.toggleActive(this.tabs.length - 1);
  }

  /**
   * Tab's name double click event.
   *
   * @param {number} index tab's index.
   * @param {HTMLInputElement} element focus target <input>.
   * @memberof TabComponent
   */
  public editTab(index: number, element: HTMLInputElement) {
    this.tabs[index].editing = true;
    setTimeout(() => element.focus(), 0);
  }

  /**
   * Handle tab changed event.
   *
   * @param {(string | Event)} event
   * @memberof TabComponent
   */
  public tabChanged(event: string | Event) {
    if (typeof event === "string") {
      this.tabs[this.activeIndex].editorContent = event;
      this.saveContentSubject.next(event);
    }
  }

  /**
   * Tab's name input key event.
   *
   * @param {number} index tab's index.
   * @param {KeyboardEvent} event keyboard event.
   * @memberof TabComponent
   */
  public editInputKeyPress(index: number, event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.tabs[index].editing = false;
    }
  }

  /**
   * Tab's remove button event.
   *
   * @param {number} index tab's index.
   * @memberof TabComponent
   */
  public removeTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.activeIndex >= this.tabs.length) {
      this.activeIndex = 0;
      this.toggleActive(0);
    } else {
      this.toggleActive(this.activeIndex);
    }
  }

  /**
   * Change active tab event.
   *
   * @param {number} activateIndex activation tab index.
   * @memberof TabComponent
   */
  public toggleActive(activateIndex: number) {
    this.activeIndex = activateIndex;
    this.tabs.forEach(v => (v.isActive = false));
    this.tabs[activateIndex].isActive = true;
    this.changed.emit({
      data: this.tabs[activateIndex],
      index: activateIndex
    });
    console.log("active tab:", this.activeIndex);
  }

  /**
   * Active tab next.
   *
   * @memberof TabComponent
   */
  public tabNext() {
    const activeIndex =
      this.tabs.length >= this.activeIndex + 1 ? 0 : this.activeIndex + 1;
    this.toggleActive(activeIndex);
  }

  /**
   * Active tab back.
   *
   * @memberof TabComponent
   */
  public tabBack() {
    const activeIndex =
      this.activeIndex - 1 < 0 ? this.tabs.length - 1 : this.activeIndex - 1;
    this.toggleActive(activeIndex);
  }

  public onCompileCommand() {
    this.compileCommand.emit();
  }
}
