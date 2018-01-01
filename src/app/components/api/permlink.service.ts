import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { environment } from "../../../environments/environment";
import { IPermlinkResponse } from "./permlink.model";

@Injectable()
export class PermlinkService {
  private fetching = false;
  private resultCache: IPermlinkResponse | null = null;
  // private fetchObserver: Observable<IPermlinkResponse> | null = null;

  private linkId: string;

  private subject = new Subject<IPermlinkResponse>();

  constructor(
    private http: HttpClient // , private route: ActivatedRoute
  ) {
    const match = location.href.match(/.*\/permlink\/(.*)\/?/);
    if (match && match.length) {
      this.linkId = match[1];
    } else {
      this.linkId = "";
    }
  }

  get requested() {
    return this.linkId.length > 0;
  }

  /**
   * Check permlink id in url.
   *
   * @readonly
   * @type {Observable<IPermlinkResponse>}
   * @memberof PermlinkService
   */
  public get checkPermlink$(): Observable<IPermlinkResponse> {
    if (!this.fetching && this.requested) {
      if (this.resultCache != null) {
        console.log("[PermlinkService]", "cache subscribe");
        this.subject.next(this.resultCache);
      } else {
        this.fetching = true;
        console.log("[PermlinkService]", "fetch permlink");
        this.http
          .get<IPermlinkResponse>(
            environment.baseApiUrl + "permlink/" + this.linkId
          )
          .subscribe(
            res => {
              this.resultCache = res;
              this.fetching = false;
              console.log("[PermlinkService]", "subscribe permlink");
              this.subject.next(res);
              this.subject.complete();
            },
            err => {
              this.subject.error(err);
            }
          );
      }
    }

    return this.subject.asObservable();
  }
}
