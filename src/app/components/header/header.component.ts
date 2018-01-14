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
      const url = new URL(location.href);
      const session = url.searchParams.get("session");

      if (session != null) {
        this.storage.setValue("session", session);
      }

      window.history.replaceState(null, document.title, url.pathname);
    }

    return undefined;
  }
  public getLoginURL() {
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.set("client_id", "d097a8f338db3c15fe08");
    url.searchParams.set("redirect_uri", "https://wandbox.org/test/login/github/callback?redirect_uri=http://localhost:4200/");
    return url.href;
  }
}
