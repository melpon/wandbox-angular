import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class EditorService {
  private changeConfigSubject = new Subject<IChangeConfigEvent>();
  private changeEditorSubject = new Subject<string>();

  get changeConfig$() {
    return this.changeConfigSubject.asObservable();
  }

  public changeConfigNext$(eventValue: IChangeConfigEvent) {
    this.changeConfigSubject.next(eventValue);
  }

  get changeEditorTab$() {
    return this.changeEditorSubject.asObservable();
  }

  public changeEditorTabNext(value: string) {
    this.changeEditorSubject.next(value);
  }
}

interface IChangeConfigEvent {
  name: string;
  value: string | number | boolean;
}
