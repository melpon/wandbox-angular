import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { PostCompileService } from "../api/compile.service";
import { PermlinkService } from "../api/permlink.service";
import { RunCompileService } from "../common/run-compile.service";
import { CompileResultTabComponent } from "../compile-result-tab/compile-result-tab.component";
import { CompileComponent } from "./compile.component";

describe("CompileComponent", () => {
  let component: CompileComponent;
  let fixture: ComponentFixture<CompileComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CompileComponent, CompileResultTabComponent],
        imports: [FormsModule, HttpClientModule],
        providers: [RunCompileService, PostCompileService, PermlinkService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
