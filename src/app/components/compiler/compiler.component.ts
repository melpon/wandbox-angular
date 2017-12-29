import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../environments/environment";
import { ICompilerInfo } from "../api/compiler-list.model";
import { PermlinkService } from "../api/permlink.service";
import { LocalStorageService } from "../common/local-storage.service";
import {
  CompilerComponentModel,
  CompilerModel,
  LanguageModel,
  OptionType
} from "./compiler.model";
import { CompilerService } from "./compiler.service";

@Component({
  selector: "sg-wandbox-compiler",
  styleUrls: ["./compiler.component.css"],
  templateUrl: "./compiler.component.html"
})
export class CompilerComponent {
  public model = new CompilerComponentModel();

  get selectedLanguage() {
    return this.model.languages[this.model.selectedLangIndex] || null;
  }

  constructor(
    private service: CompilerService,
    private storage: LocalStorageService,
    private permlink: PermlinkService
  ) {
    this.service.fetchCompilerList$.subscribe(
      compilerList => {
        const languageDic: { [key: string]: LanguageModel } = {};
        for (const compiler of compilerList) {
          const languageName = compiler.language;
          if (languageDic[languageName] == null) {
            languageDic[languageName] = new LanguageModel();
            languageDic[languageName].languageName = languageName;
          }
          languageDic[languageName].addCompiler(compiler);
        }
        this.model.languages = Object.keys(languageDic).map(
          key => languageDic[key]
        );
        this.model.fetched = true;

        if (this.permlink.requested) {
          this.permlink.checkPermlink$.subscribe(res => {
            const { parameter, result } = res;
            const compilerInfo = parameter["compiler-info"];

            let langIndex = this.model.languages.findIndex(
              v => v.languageName === compilerInfo.language
            );
            if (langIndex === -1) {
              // why arrive code?
              console.error("not found language.", compilerInfo.language);
              langIndex = 0;
            }

            let compilerIndex = this.model.languages[
              langIndex
            ].compilers.findIndex(v => v.name === parameter.compiler);
            if (compilerIndex === -1) {
              // why arrive code?
              console.error("not found compiler.", parameter.compiler);
              compilerIndex = 0;
            }
            this.selectLanguage(langIndex, compilerIndex);
          });
        } else if (this.storage.hasValue("language")) {
          const language = this.storage.getValue("language");
          let langIndex = this.model.languages.findIndex(
            v => v.languageName === language
          );
          if (langIndex === -1) {
            this.storage.removeValue("language");
            langIndex = 0;
          }
          this.selectLanguage(langIndex);
        } else {
          // get default compiler.
          const defaultCompiler = environment.DEFAULT_COMPILER;

          (() => {
            for (const l of this.model.languages.map((lang, index) => ({
              index,
              lang
            }))) {
              for (const c of l.lang.compilers.map((compiler, index) => ({
                compiler,
                index
              }))) {
                if (c.compiler.name === defaultCompiler) {
                  this.selectLanguage(l.index, c.index, null);
                  // break multiple loop
                  return;
                }
              }
            }
          })();
        }
      },
      err => {
        this.model.errorMessage = "failed loading compiler list!";
      }
    );
  }

  /**
   * Activate selected language.
   *
   * @param {number} index
   * @param {number} [selectCompilerIndex]
   * @param {UIEvent} [event]
   * @memberof CompilerComponent
   */
  public selectLanguage(
    index: number,
    selectCompilerIndex?: number,
    event?: UIEvent
  ) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.model.selectedLangIndex = index;
    this.storage.setValue("language", this.selectedLanguage.languageName);

    if (selectCompilerIndex != null) {
      this.selectCompiler(selectCompilerIndex);
    } else if (this.storage.hasValue("compiler")) {
      const compiler = this.storage.getValue("compiler");
      // find index of saved compiler key.
      let compilerIndex = this.selectedLanguage.compilers.findIndex(
        v =>
          this.generateCompileOptionStorageKey(this.selectedLanguage) ===
          compiler
      );
      if (compilerIndex === -1) {
        this.storage.removeValue("compiler");
        compilerIndex = 0;
      }
      this.selectCompiler(compilerIndex);
    } else {
      // default compiler is head of compiler list.
      this.selectCompiler(0);
    }
    this.service.selectedLanguageNext(this.selectedLanguage);
  }

  /**
   * Activate selected compiler.
   *
   * @param {number} index
   * @memberof CompilerComponent
   */
  public selectCompiler(index: number) {
    const keyName = this.generateCompileOptionStorageKey(this.selectedLanguage);
    this.selectedLanguage.selectedCompilerIndex = index;
    this.storage.setValue("compiler", keyName);
    // load compiler options.
    if (this.storage.hasValue(keyName)) {
      const options = this.storage.getValue(keyName);
      this.selectedLanguage.selectedCompiler.options = options;
    }
  }

  /**
   * Detection changed config.
   *
   * @param {number} index
   * @param {OptionType} item
   * @memberof CompilerComponent
   */
  public changeOption(index: number, item: OptionType) {
    const keyName = this.generateCompileOptionStorageKey(this.selectedLanguage);
    this.storage.setValue(
      keyName,
      this.selectedLanguage.selectedCompiler.options
    );
  }

  /**
   * Load template code from API for active language.
   *
   * @param {string} templateName
   * @memberof CompilerComponent
   */
  public clickLoadTemplate(templateName: string) {
    this.service.loadTemplateNext(templateName);
  }

  private generateCompileOptionStorageKey(language: LanguageModel) {
    return `compilerOptions-${language.languageName}-${
      language.selectedCompiler.displayName
    }-${language.selectedCompiler.version}`;
  }
}
