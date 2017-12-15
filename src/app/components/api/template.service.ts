import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { TemplateInfo } from "./template.model";

@Injectable()
export class TemplateAPIService {
  constructor(private http: HttpClient) {}
  public fetch$(templateName: string): Observable<TemplateInfo> {
    return this.http.get(
      environment.baseApiUrl + "template/" + templateName
    ) as any;
  }
}
