const EDITOR_MODE_MAPPING = {
  "Bash script": "text/x-sh",
  C: "text/x-csrc",
  "C#": "text/x-csharp",
  "C++": "text/x-c++src",
  CPP: "text/x-csrc",
  CoffeeScript: "text/x-coffeescript",
  Crystal: "text/x-crystal",
  D: "text/x-d",
  Elixir: "text/x-ruby",
  Erlang: "text/x-erlang",
  Go: "text/x-go",
  Groovy: "text/x-groovy",
  Haskell: "text/x-haskell",
  Java: "text/x-java",
  JavaScript: "text/javascript",
  Lisp: "text/x-common-lisp",
  Lua: "text/x-lua",
  OCaml: "text/x-ocaml",
  OpenSSL: "text/x-sh",
  PHP: "text/x-php",
  Pascal: "text/x-pascal",
  Perl: "text/x-perl",
  Python: "text/x-python",
  Ruby: "text/x-ruby",
  Rust: "text/x-rustsrc",
  Scala: "text/x-scala",
  Swift: "text/x-swift",
  "Vim script": "text/x-csrc"
};

export function mime(languageName: string) {
  return EDITOR_MODE_MAPPING[languageName] || "";
}

// export class LanguageMimePipe implements PipeTransform {

//     transform(value: string) {
//         return EDITOR_MODE_MAPPING[value] || '';
//     }
// }
