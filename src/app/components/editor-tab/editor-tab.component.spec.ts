import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { PermlinkService } from "../api/permlink.service";
import { WandboxCodemirrorComponent } from "../codemirror/wb-codemirror.component";
import { LocalStorageService } from "../common/local-storage.service";
import { EditorService } from "../editor/editor.service";
import { TabComponent } from "./editor-tab.component";
import { EditorConfigModel } from "../editor/editor.model";
import { TabModel } from "./editor-tab.model";

describe("TabComponent", () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TabComponent, WandboxCodemirrorComponent],
        imports: [FormsModule, HttpClientModule],
        providers: [LocalStorageService, PermlinkService, EditorService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    component.config = new EditorConfigModel();
    const tab = new TabModel();
    tab.editorContent = "";
    component.tabs = [tab];
    component.activeIndex = 0;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
