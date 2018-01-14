import { Component, OnInit } from "@angular/core";
import { LocalStorageService } from "../common/local-storage.service";

@Component({
  selector: "wandbox-header",
  styleUrls: ["./header.component.css"],
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit {
  constructor(private storage: LocalStorageService) {
  }
  public ngOnInit() {
    // TODO(melpon): ログイン処理やヘッダーの表示に関しては、別コンポーネントにする
    // ?session= なセッションがあれば、その値をローカルストレージに保存して、クエリ文字列を消しておく
    if (window.location.search.length != 0) {
      /* FIXME(melpon): URL は IE だと使えないらしい
      const url = new URL(location.href);
      url.searchParams.get("session");
      */

      const qs = window.location.search.slice(1);
      let params: {[key: string]: string} = {};
      for (const param of qs.split("&")) {
        const xs = param.split("=");
        params[xs[0]] = xs[1];
      }
      if (params["session"] != null) {
        this.storage.setValue("session", params["session"]);
      }
      window.history.replaceState(null, null, window.location.pathname);
    }

    return undefined;
  }
}
