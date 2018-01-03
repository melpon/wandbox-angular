import { async, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { AppModule } from "./app.module";

describe("AppComponent", () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppModule]
      }).compileComponents();
    })
  );
  it(
    "should create the app",
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );
  it(
    "should have as title 'Wandbox'",
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance as AppComponent;
      expect(app.title).toEqual("Wandbox");
    })
  );
  it(
    "should h1 tag doesn't exist",
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("h1")).toEqual(null);
      // expect(compiled.querySelector("h1").textContent).toContain(
      //   "Welcome to app!"
      // );
    })
  );
});
