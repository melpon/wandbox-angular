import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { PostCompileService } from "../api/compile.service";
import { CompilerListAPIService } from "../api/compiler-list.service";
import { PermlinkService } from "../api/permlink.service";
import { TemplateAPIService } from "../api/template.service";
import { WandboxCodemirrorComponent } from "../codemirror/wb-codemirror.component";
import { LocalStorageService } from "../common/local-storage.service";
import { RunCompileService } from "../common/run-compile.service";
import { CompileResultTabComponent } from "../compile-result-tab/compile-result-tab.component";
import { CompileComponent } from "../compile/compile.component";
import { CompilerService } from "../compiler/compiler.service";
import { TabComponent } from "../editor-tab/editor-tab.component";
import { EditorComponent } from "./editor.component";

describe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          EditorComponent,
          TabComponent,
          WandboxCodemirrorComponent,
          CompileComponent,
          CompileResultTabComponent
        ],
        imports: [FormsModule, HttpClientModule],
        providers: [
          CompilerService,
          CompilerListAPIService,
          TemplateAPIService,
          LocalStorageService,
          PermlinkService,
          RunCompileService,
          PostCompileService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
