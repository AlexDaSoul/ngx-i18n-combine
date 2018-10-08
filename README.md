# ngx-i18n-combine

Combine files from components i18n directory to assets. For example one-component/i18n/[lang].json and two-component/i18n/[lang].json to assets/i18/[lang].json

## Install

``npm install --save @angular-ru/ngx-i18n-combine``

## Usage

Add an `combine` script to your project's `package.json`:
```
"scripts": {
  "combine": "ngx-i18n-combine -i ./src/i18n/ -o ./src/assets/i18n/"
}
```

**or**

You can now run `npm run combine` to combine files.

## Examples

**Combine from multiple dirs**

`ngx-i18n-combine -i ./src/**/i18n -o ./src/assets/i18n/i18n.json`

**Combine from multiple dirs**

`ngx-i18n-combine -i ./src/component-1/i18n ./src/component-2/i18n -o ./src/assets/i18n`

**Combine and save to multiple files**

`ngx-i18n-combine -i ./src -o ./src/assets/i18n`

**or**

`ngx-i18n-combine -i ./src/**/i18n/*.json -o ./src/assets/i18n/{en,de}.json`

**or**

`ngx-i18n-combine -i ./src/component-1/i18n/en.json ./src/component-2/i18n/en.json -o ./src/assets/i18n/en.json`


## CLI
```
Usage:
ngx-i18n-combine [options]

Options:
--version, -v       Show version number 
                    [boolean]

--help, -h          Show help 
                    [boolean]

--input, -i         Paths you would like to extract files from. 
                    You can use path expansion, 
                    glob patterns and multiple paths 
                    [array] 
                    [default: current working path]

--output, -o        Paths where you would like to save merged files. 
                    You can use path expansion, 
                    glob patterns and multiple paths 
                    [array] 
                    [required]
                    
--indent, -it       Output format indentation
                    [string]
                    [default: "\t"]

--sort, -s          Sort strings in alphabetical order when saving 
                    [boolean] 
                    [default: false]

--minify, -m        Minify strings in output files 
                    [boolean] 
                    [default: false]

--verbose, -vb      If true, prints all processed file paths to console 
                    [boolean] 
                    [default: true]
                    
--watch, -w         Watch changes
                    [boolean] 
                    [default: false]
