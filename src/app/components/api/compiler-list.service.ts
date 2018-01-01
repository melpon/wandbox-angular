import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

import { environment } from "../../../environments/environment";
import { ICompilerInfo } from "./compiler-list.model";

@Injectable()
export class CompilerListAPIService {
  constructor(private http: HttpClient) {}

  public fetch$(): Observable<ICompilerInfo[]> {
    return this.http.get<ICompilerInfo[]>(environment.baseApiUrl + "list.json");
  }
}
