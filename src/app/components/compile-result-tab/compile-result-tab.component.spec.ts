import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PostCompileService } from "../api/compile.service";
import { RunCompileService } from "../common/run-compile.service";
import { CompileResultTabComponent } from "./compile-result-tab.component";

describe("CompileResultTabComponent", () => {
  let component: CompileResultTabComponent;
  let fixture: ComponentFixture<CompileResultTabComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CompileResultTabComponent],
        imports: [HttpClientModule],
        providers: [RunCompileService, PostCompileService]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompileResultTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
