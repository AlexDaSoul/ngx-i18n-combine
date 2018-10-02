import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as sort from 'sort-keys';

import { ICombineOptions, ICompiller, ILocale, ILocales } from './combine.interfaces';

/**
 * Compiller class for generate
 * locale files from ILocales object
 *
 * @class
 * @implements {ICompiller}
 * @param {ICombineOptions}
 */
export class Compiller implements ICompiller {

    constructor(private options: ICombineOptions) {
    }


    /**
     * Compile files
     *
     * @access public
     * @param {ILocales}
     * @return {void}
     */
    public compile(locales: ILocales): void {
        this.log(chalk.bold('\r\n Compile files...'));

        this.options.output.forEach((filesPath: string) => {

            /** Get file directory */
            const directory: string = path.dirname(filesPath);

            /** Get file extname */
            const extname: string = path.extname(filesPath);

            /** Get file name */
            const name: string = extname ? path.basename(filesPath).split('.')[0] : '*';

            /** Get locale keys */
            const keys: string[] = Object.keys(locales);

            /** Is once locale files */
            const isOnceLocale: boolean = keys.includes(name);

            /** Is multiple files */
            const isMultipleFiles: boolean = name[0] === '{' || name[0] === '*';


            /** Add directories if not found */
            mkdirp(directory, (err) => {
                if (err) {

                    /** If error */
                    this.log(chalk.bold.red('ERROR: directory is not added'));
                } else {

                    /** Set locale files */
                    if (isMultipleFiles) {

                        /** if multiple files */
                        for (const locale in locales) {
                            if (locales.hasOwnProperty(locale)) {

                                /** Add files */
                                this.addFiles(directory, locale, extname, locales[locale]);
                            }
                        }
                    } else if (isOnceLocale) {

                        /** if locale filename */
                        this.addFiles(directory, name, extname, locales[name]);
                    } else {

                        /** if other filename */
                        this.addFiles(directory, name, extname, locales);
                    }
                }
            });
        });
    }


    /**
     * Add files
     *
     * @access public
     * @param {string}
     * @param {string}
     * @param {string}
     * @param {ILocales | ILocale}
     * @return {void}
     */
    private addFiles(directory: string, name: string, extname: string, content: ILocales | ILocale): void {

        if (this.options.sort) {

            /** Sort ILocale */
            content = sort(content, { deep: true });

            /** Log */
            this.log(chalk.dim('- sorted strings'));
        }


        /** Set locale file path */
        const file: string = path.normalize(`${directory}/${name}${extname || '.json'}`);

        /** Tab for code style formatting */
        const indentation: string = !this.options.minify ? this.options.indent : null;

        /** Get file format type */
        const ifEsFormat = ['js', 'ts', 'tsx', 'jsx'].includes(name[1]);

        /** Set string from ILocale object */
        const contents: string = JSON.stringify(content, null, indentation);

        /** Set file type from format option */
        const formattedContents: string = ifEsFormat ? `export const ${name} = ${contents}` : contents;


        /** Create locale file */
        fs.writeFileSync(file, formattedContents, 'utf8');

        if (this.options.verbose) {

            /** Log results */
            this.log(chalk.gray('- %s'), file);
        }
    }


    /**
     * Console log wrapper
     *
     * @access private
     * @param {Array<any>}
     * @return {void}
     */
    private log(...args: any[]): void {
        console.log.apply(this, arguments);
    }
}
