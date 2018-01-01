import { Component } from "@angular/core";
import { RunCompileService } from "./components/common/run-compile.service";

@Component({
  providers: [RunCompileService],
  selector: "wandbox-app",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html"
})
export class AppComponent {}
