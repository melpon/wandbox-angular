import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { ITemplateInfo } from "./template.model";

@Injectable()
export class TemplateAPIService {
  constructor(private http: HttpClient) {}
  public fetch$(templateName: string): Observable<ITemplateInfo> {
    return this.http.get(
      environment.baseApiUrl + "template/" + templateName
    ) as any;
  }
}
