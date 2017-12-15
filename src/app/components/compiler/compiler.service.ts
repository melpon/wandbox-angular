import { Injectable } from "@angular/core";
import "rxjs/add/operator/mergeMap";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { CompilerInfo } from "../api/compiler-list.model";
import { CompilerListAPIService } from "../api/compiler-list.service";
import { TemplateAPIService } from "../api/template.service";
import { LanguageModel } from "../compiler/compiler.model";

@Injectable()
export class CompilerService {
  constructor(
    private listApi: CompilerListAPIService,
    private templateApi: TemplateAPIService
  ) {}

  private compilerSubject = new Subject<CompilerInfo>();

  private languageSubject = new Subject<LanguageModel>();

  private loadTemplateSubject = new Subject<string>();

  public get selectedCompiler$() {
    return this.compilerSubject.asObservable();
  }

  public selectedCompilerNext(compiler: CompilerInfo) {
    this.compilerSubject.next(compiler);
  }

  public get selectedLanguage$() {
    return this.languageSubject.asObservable();
  }

  public selectedLanguageNext(language: LanguageModel) {
    this.languageSubject.next(language);
  }

  public get fetchCompilerList$() {
    return this.listApi.fetch$();
  }

  public get loadTemplate$() {
    return this.loadTemplateSubject
      .asObservable()
      .flatMap(template => this.templateApi.fetch$(template));
  }

  public loadTemplateNext(templateName: string) {
    this.loadTemplateSubject.next(templateName);
  }
}
