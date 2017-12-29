declare let CodeMirror;

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core";

import { EditorConfigModel } from "../editor/editor.model";
import { EditorService } from "../editor/editor.service";

@Component({
  selector: "sg-wandbox-codemirror",
  styleUrls: ["./wb-codemirror.component.css"],
  template: `
        <div class="wandbox-codemirror-container" [class.expand]="config.expand">
            <textarea #host></textarea>
        </div>
  `
})
export class WandboxCodemirrorComponent implements AfterViewInit {
  @Input() public value: string;
  @Input() public config: EditorConfigModel = new EditorConfigModel();

  @Output() public blur = new EventEmitter<void>();
  @Output() public focus = new EventEmitter<void>();
  @Output() public change = new EventEmitter<string>();

  @Output() public compileCommand = new EventEmitter<void>();

  @ViewChild("host") public host;

  private codemirror: CodeMirror.Editor = null;

  constructor(private service: EditorService, private element: ElementRef) {
    // apply change config.
    service.changeConfig$.filter(v => v.name !== "expand").subscribe(v => {
      this.config[v.name] = v.value;
      this.codemirror.setOption(v.name, v.value);
      this.codemirror.refresh();
    });

    // set tab data
    service.changeEditorTab$.subscribe(v => {
      this.value = v;
      this.codemirror.setValue(v);
      this.codemirror.refresh();
    });
  }

  public ngAfterViewInit(): void {
    this.codemirrorInit(this.config);
    const codeMirror = this.element.nativeElement as HTMLElement;
    // codemirror style setting from class style definition in css.
    codeMirror.classList.add("cm-s-user");
    this.clearHistory();
  }

  public clearHistory() {
    this.codemirror.getDoc().clearHistory();
  }

  private codemirrorInit(config: EditorConfigModel) {
    this.codemirror = CodeMirror.fromTextArea(this.host.nativeElement, config);
    this.codemirror.setValue(this.value);
    this.codemirror.on("change", () => {
      this.value = this.codemirror.getValue();
      this.change.emit(this.value);
    });

    this.codemirror.on("focus", () => {
      this.focus.emit();
    });

    this.codemirror.on("blur", () => {
      this.blur.emit();
    });

    // definition shortcut key.
    this.codemirror.setOption("extraKeys", {
      "Cmd-Enter": cm => {
        this.compileCommand.emit();
      },
      "Ctrl-Enter": cm => {
        this.compileCommand.emit();
      },
      "Ctrl-Shift-T": cm => {
        console.log("hogehoge");
      },
      "Shift-Tab": cm => {
        cm.execCommand("indentLess");
      },
      Tab: cm => {
        if (cm.somethingSelected()) {
          cm.execCommand("indentMore");
          return;
        }
        // tab insertion.
        if (this.config.indentWithTabs) {
          cm.execCommand("insertTab");
        } else {
          const tabSize = cm.getOption("tabSize");
          const spaces = Array(cm.getOption("tabSize") + 1).join(" ");
          cm.replaceSelection(spaces, "end", "+input");
        }
      }
    });
    this.codemirror.refresh();
  }
}
