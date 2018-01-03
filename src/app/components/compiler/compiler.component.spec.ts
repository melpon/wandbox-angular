import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { CompilerListAPIService } from "../api/compiler-list.service";
import { PermlinkService } from "../api/permlink.service";
import { TemplateAPIService } from "../api/template.service";
import { LocalStorageService } from "../common/local-storage.service";
import { CompilerComponent } from "./compiler.component";
import { CompilerService } from "./compiler.service";

describe("CompilerComponent", () => {
  let component: CompilerComponent;
  let fixture: ComponentFixture<CompilerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CompilerComponent],
        imports: [FormsModule, HttpClientModule],
        providers: [
          CompilerService,
          CompilerListAPIService,
          TemplateAPIService,
          LocalStorageService,
          PermlinkService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
