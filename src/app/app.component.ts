import { Component, OnInit } from "@angular/core";
import { RunCompileService } from "./components/common/run-compile.service";

import timeago from "timeago.js";

@Component({
  providers: [RunCompileService],
  selector: "wandbox-app",
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  public title: string = "Wandbox";
  public ngOnInit() {
    const timeAgo = timeago();
    timeAgo.render(document.querySelectorAll(".time-ago"));
  }
}
