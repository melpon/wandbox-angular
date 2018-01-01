import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { IAction, PostEventSource } from "../../utils/PostEventSource";
import { ICompileRequest, ICompileResponse } from "./compile.model";

@Injectable()
export class PostCompileService {
  constructor(private http: HttpClient) {}

  public postCompile$(param: ICompileRequest): Observable<ICompileResponse> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    headers.set("Cache-Control", "no-cache");
    return this.http.post<ICompileResponse>(
      environment.baseApiUrl + "compile.json",
      param,
      {
        headers
      }
    );
  }

  public postCompileEventStream$(param: ICompileRequest): Observable<IAction> {
    const pes = new PostEventSource(environment.baseUrl + "compile");
    pes.post(param);
    return pes.eventSource;
  }
}
