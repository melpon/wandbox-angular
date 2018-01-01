import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
// import { RouterRootComponent } from './root.component';
import { WandboxCodemirrorComponent } from "./components/codemirror/wb-codemirror.component";
import { CompileComponent } from "./components/compile/compile.component";
import { CompilerComponent } from "./components/compiler/compiler.component";
import { TabComponent } from "./components/editor-tab/editor-tab.component";
import { EditorComponent } from "./components/editor/editor.component";
import { HeaderComponent } from "./components/header/header.component";
import { SponsorsComponent } from "./components/sponsors/sponsors.component";

import { PostCompileService } from "./components/api/compile.service";
import { CompilerListAPIService } from "./components/api/compiler-list.service";
import { PermlinkService } from "./components/api/permlink.service";
import { TemplateAPIService } from "./components/api/template.service";
import { LocalStorageService } from "./components/common/local-storage.service";
import { CompileResultTabComponent } from "./components/compile-result-tab/compile-result-tab.component";
import { CompilerService } from "./components/compiler/compiler.service";

@NgModule({
  // bootstrap: [RouterRootComponent],
  bootstrap: [AppComponent],
  declarations: [
    // RouterRootComponent,
    AppComponent,
    WandboxCodemirrorComponent,
    EditorComponent,
    HeaderComponent,
    SponsorsComponent,
    CompilerComponent,
    CompileComponent,
    TabComponent,
    CompileResultTabComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
    // configuration app routing.
    // RouterModule.forRoot([
    //     { path: 'permlink/:id', component: AppComponent },
    //     { path: '', component: AppComponent, pathMatch: 'full' },
    // ]),
  ],
  providers: [
    TemplateAPIService,
    CompilerListAPIService,
    CompilerService,
    PostCompileService,
    LocalStorageService,
    PermlinkService
  ]
})
export class AppModule {}
