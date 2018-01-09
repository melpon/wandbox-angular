import { Subject } from "rxjs/Subject";

export class NDJSON {
  private subject = new Subject<IAction>();
  private responsedIndex = 0;
  private readyState: EV_READY_STATE = EV_READY_STATE.CONNECTING;
  private xhr: XMLHttpRequest;

  constructor(private targetUrl: string, private timeout = 50000) {}

  public get ndjson() {
    return this.subject.asObservable();
  }

  public post(request: object) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", this.targetUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "*/*");
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

      xhr.timeout = this.timeout;

      const progress = () => {
        const newText = xhr.responseText.substr(this.responsedIndex);
        const parts = newText.split("\n");
        const remainText = parts.pop() as string;
        this.responsedIndex = xhr.responseText.length - remainText.length;

        for (const line of parts) {
          console.log("line:", line);
          const json = JSON.parse(line);
          this.subject.next({
            messageType: json.type,
            payload: json.data,
            type: "message"
          });
          if (json.type === "Control" && json.data === "Finish") {
            this.subject.complete();
          }
        }
      };

      xhr.onprogress = () => {
        progress();
      };
      xhr.onreadystatechange = () => {
        if (
          xhr.readyState === READY_STATE.LOADING ||
          (xhr.readyState === READY_STATE.DONE && xhr.status === 200)
        ) {
          // on SUCCESS
          if (this.readyState === EV_READY_STATE.CONNECTING) {
            this.readyState = EV_READY_STATE.OPEN;
            this.subject.next({ type: "open" });
          }
          progress();
        } else if (
          this.readyState === EV_READY_STATE.OPEN &&
          xhr.status === 400
        ) {
          this.close();
        } else if (this.readyState !== EV_READY_STATE.CLOSED) {
          // on Error
          if (xhr.readyState === READY_STATE.DONE) {
            this.readyState = EV_READY_STATE.ERROR;
            this.subject.next({ type: "error" });
          }
        }
      };

      xhr.send(JSON.stringify(request));

      setTimeout(() => {
        if (xhr.readyState === READY_STATE.HEADERS_RECEIVED) {
          xhr.abort();
          this.subject.next({ type: "timeout" });
        }
      }, this.timeout);
      this.xhr = xhr;
    } catch (e) {
      this.subject.next({ type: "exception", error: e });
    }
    return;
  }

  public close() {
    this.readyState = EV_READY_STATE.CLOSED;
    this.subject.complete();
    this.xhr.abort();
  }
}

enum READY_STATE {
  UNSENT,
  OPENED,
  HEADERS_RECEIVED,
  LOADING,
  DONE
}

enum EV_READY_STATE {
  CONNECTING,
  OPEN,
  CLOSED,
  ERROR
}

export interface IAction {
  type: string;
  error?: any;
  messageType?: string;
  payload?: string;
}
