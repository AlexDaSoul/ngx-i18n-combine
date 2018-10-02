import * as chalk from 'chalk';
import * as glob from 'glob';
import * as fs from 'fs';
import * as root from 'app-root-path';
import * as path from 'path';

import { ICombine, ICombineOptions, ICompiller, ILocales, IParser } from './combine.interfaces';

/**
 * Combine class for run cli task
 *
 * @class
 * @implements {ICombine}
 * @param {IParser}
 * @param {ICompiller}
 */
export class Combine implements ICombine {

    /**
     * Object locales from Parser::parse()
     *
     * @access private
     * @type {ILocales}
     */
    private locales: ILocales;

    constructor(private options: ICombineOptions, private parser: IParser, private compiller: ICompiller) {
    }


    /**
     * CLI Task Run
     *
     * @access public
     * @return {void}
     */
    public run(): void {

        /** Set locale object */
        this.locales = this.parser.parse() || {};

        if (Object.keys(this.locales).length) {

            /** Set locale files */
            this.compiller.compile(this.locales);

            if (this.options.watch) {

                /** Add watcher */
                this.watch();
            }
        }
    }


    /**
     * Watch changes
     *
     * @access private
     * @return {void}
     */
    private watch(): void {
        this.options.input.forEach((filesPath: string) => {

            /** Get Files array */
            const files: string[] = this.getFiles(filesPath);

            if (!files.length) {

                /** If files not found */
                this.log(chalk.bold.red('ERROR: files not found'));
            } else {

                /** Set ILocale from files */
                files.forEach((file: string) => {
                    fs.watchFile(file, () => {
                        console.log('File Changed ...');
                        console.log(`File content at: ${new Date()} is \n ${file}`);

                        /** Parse again */
                        this.run();
                    });
                });
            }
        });
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
