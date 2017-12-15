import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";

import { environment } from "../../../environments/environment";
import {
  CompilerModel,
  LanguageModel,
  OptionType
} from "../compiler/compiler.model";
import { CompilerInfo } from "./compiler-list.model";

@Injectable()
export class CompilerListAPIService {
  constructor(private http: HttpClient) {}

  public fetch$(): Observable<CompilerInfo[]> {
    return this.http.get(environment.baseApiUrl + "list.json") as any;
  }
}
