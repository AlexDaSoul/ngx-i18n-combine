import pc from 'picocolors';
import * as glob from 'glob';
import * as fs from 'fs';
import * as root from 'app-root-path';
import * as path from 'path';

import { ICombineOptions, IParser, ILocale, ILocales } from './combine.interfaces';

/**
 * Parser class for parse locale files and
 * generate ILocales object
 *
 * @class
 * @implements {IParser}
 * @param {ICombineOptions}
 */
export class Parser implements IParser {

    /**
     * Object locales
     *
     * @access private
     * @type {ILocales}
     */
    private locales: ILocales = {};

    constructor(private options: ICombineOptions) {
    }


    /**
     * Parse locale files
     *
     * @access public
     * @return {ILocales}
     */
    public parse(): ILocales {
        this.log(pc.bold('Parse files...'));

        /** Init field with an empty object */
        this.locales = {};


        this.options.input.forEach((filesPath: string) => {

            /** Get Files array */
            const files: string[] = this.getFiles(filesPath);

            if (!files.length) {

                /** If files not found */
                this.log(pc.red(pc.bold('ERROR: files not found')));
            } else {

                /** Set ILocale from files */
                files.forEach((file: string) => this.setLocale(file));
            }
        });

        return this.locales;
    }


    /**
     * Set Locale from file
     *
     * @access private
     * @param {String}
     * @return {void}
     */
    private setLocale(file: string): void {

        /** Get file name */
        const fileName: string[] = path.basename(file).split('.');

        /** Read locale file */
        const contents: string = fs.readFileSync(file, 'utf-8');

        /** Get file format type */
        const ifEsFormat = ['js', 'ts', 'tsx', 'jsx'].includes(fileName[1]);

        /** ILocale JSON parse es format of json */
        const parseObject: ILocale = JSON.parse((ifEsFormat ? contents.split('=')[1].replace(';', '') : contents));


        if (!Object.keys(parseObject).length) {

            /** If file is empty */
            this.log(pc.red(pc.bold(`ERROR: File is empty: ${file}`)));
        } else {

            /** Set log if replace double strings */
            this.isUnique(fileName[0], parseObject);

            /** Set ILocale object */
            this.locales[fileName[0]] = this.locales[fileName[0]] ? {
                ...this.locales[fileName[0]],
                ...parseObject
            } : parseObject;

            if (this.options.verbose) {

                /** Log results */
                this.log(pc.gray('- %s'), file);
            }
        }
    }


    /**
     * Find files from input path
     *
     * @access private
     * @param {String}
     * @return {Array<string>}
     */
    private getFiles(filePath: string): string[] {

        /** Pattern search if not ext */
        const pattern: string = '/**/*.json';

        /** Get file name */
        const fileName: boolean = !!(path.extname(filePath));

        /** Add path with pattern */
        const pathWp: string = fileName ? filePath : filePath + pattern;


        return glob.sync(pathWp, { root: root.path })
            .filter(file => fs.statSync(file).isFile());
    }


    /**
     * Set log if replace double strings
     *
     * @access private
     * @param {String}
     * @param {ILocale}
     * @return {void}
     */
    private isUnique(localeName: string, contents: ILocale): void {
        if (contents) {

            /** Get ILocale object keys */
            const keys: string[] = Object.keys(contents);

            /** Get ILocale.key */
            const locale: ILocale = this.locales[localeName];

            for (const key in locale) {
                if (keys.includes(key)) {

                    /** If replaced string */
                    this.log(pc.red(pc.bold('String it was replaced: %s')), key);
                }
            }
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
        console.log.apply(this, args);
    }
}
