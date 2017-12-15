import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { RunCompileService } from "./components/common/run-compile.service";

@Component({
  selector: "app-wandbox",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [RunCompileService]
})
export class AppComponent {
  constructor() {}
}
