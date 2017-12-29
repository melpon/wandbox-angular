import { LanguageModel } from "../compiler/compiler.model";
import { TabModel } from "../editor-tab/editor-tab.model";

/**
 * Model for EditorComponent
 *
 * @export
 * @class EditorModel
 */
export class EditorComponentModel {
  public config: EditorConfigModel = new EditorConfigModel();
  public stdin: string;
  public tabs = new Array<TabModel>();
  public selectedLanguage: LanguageModel;
  public activeTabIndex = 0;

  get dump() {
    return JSON.stringify(this.config, null, "\n");
  }

  get mode() {
    return this.config.mode;
  }
  set mode(value) {
    this.config.mode = value;
  }

  get keyMap() {
    return this.config.keyMap;
  }
  set keyMap(value) {
    this.config.keyMap = value;
  }

  get tabSize() {
    return this.config.tabSize;
  }
  set tabSize(value: number) {
    this.config.tabSize = +value;
  }

  get smartIndent() {
    return this.config.smartIndent;
  }
  set smartIndent(value) {
    this.config.smartIndent = value;
  }

  get indentWithTabs() {
    return this.config.indentWithTabs;
  }
  set indentWithTabs(value) {
    this.config.indentWithTabs = value;
  }

  get tabWidth() {
    return this.tabWidthValue;
  }
  set tabWidth(value: number) {
    this.tabWidthValue = value;
  }

  get expand() {
    return this.config.expand;
  }
  set expand(value) {
    this.config.expand = value;
  }

  private tabWidthValue = 4;
}

export class EditorConfigModel {
  [key: string]: any;

  public keyMap = "default";
  public lineNumbers = true;
  public indentWithTabs = true;
  public smartIndent = true;
  public expand = false;
  public tabSize = 4;
  public indentUnit = 4;
  public mode = "text/x-csrc";
  public viewportMargin = Infinity;
}
