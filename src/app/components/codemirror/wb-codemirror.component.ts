import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core";
import * as CodeMirror from "codemirror";

import { EditorConfigModel } from "../editor/editor.model";
import { EditorService } from "../editor/editor.service";

@Component({
  selector: "wandbox-codemirror",
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

  @ViewChild("host") public host: any;

  private codemirror: CodeMirror.Editor | null = null;

  constructor(/*private*/ service: EditorService, private element: ElementRef) {
    // apply change config.
    service.changeConfig$.filter(v => v.name !== "expand").subscribe(v => {
      if (this.codemirror != null) {
        this.config[v.name] = v.value;
        this.codemirror.setOption(v.name, v.value);
        this.codemirror.refresh();
      }
    });

    // set tab data
    service.changeEditorTab$.subscribe(v => {
      if (this.codemirror != null) {
        this.value = v;
        this.codemirror.setValue(v);
        this.codemirror.refresh();
      }
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
    if (this.codemirror != null) {
      this.codemirror.getDoc().clearHistory();
    }
  }

  private codemirrorInit(config: EditorConfigModel) {
    const codemirror: CodeMirror.Editor = CodeMirror.fromTextArea(
      this.host.nativeElement,
      config
    );
    this.codemirror = codemirror;

    codemirror.setValue(this.value);
    codemirror.on("change", () => {
      this.value = codemirror.getValue();
      this.change.emit(this.value);
    });

    codemirror.on("focus", () => {
      this.focus.emit();
    });

    codemirror.on("blur", () => {
      this.blur.emit();
    });

    // definition shortcut key.
    codemirror.setOption("extraKeys", {
      "Cmd-Enter": (_cm: CodeMirror.Editor) => {
        this.compileCommand.emit();
      },
      "Ctrl-Enter": (_cm: CodeMirror.Editor) => {
        this.compileCommand.emit();
      },
      "Ctrl-Shift-T": (_cm: CodeMirror.Editor) => {
        console.log("hogehoge");
      },
      "Shift-Tab": (cm: CodeMirror.Editor) => {
        cm.execCommand("indentLess");
      },
      Tab: (cm: CodeMirror.Editor) => {
        if (cm.getDoc().somethingSelected()) {
          cm.execCommand("indentMore");
          return;
        }
        // tab insertion.
        if (this.config.indentWithTabs) {
          cm.execCommand("insertTab");
        } else {
          const tabSize = cm.getOption("tabSize");
          const spaces = Array(tabSize + 1).join(" ");
          // @type/codemirror replaceSelection is buggy.
          // replaceSelection has three arguments but @type/codemirror defines as two arguments.
          // @ts-ignore: Expected 1-2 arguments, but got 3.
          cm.getDoc().replaceSelection(spaces, "end", "+input");
        }
      }
    });
    codemirror.refresh();
  }
}
