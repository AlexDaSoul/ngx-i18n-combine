/**
 * Interface for locale hash tables {key: value}
 *
 * @interface
 */
export interface ILocale {
    [key: string]: any;
}

/**
 * Interface for locale's object with hash tables {key: ILocale}
 *
 * @interface
 */
export interface ILocales {
    [key: string]: ILocale;
}


/**
 * Interface for CLI options
 *
 * @interface
 */
export interface ICombineOptions {
    input: string[];
    output: string[];
    indent?: string;
    locales?: string[];
    sort?: boolean;
    minify?: boolean;
    verbose?: boolean;
    watch?: boolean;
}


/**
 * Interface for public method of Parser class
 *
 * @interface
 */
export interface IParser {
    parse(): ILocale;
}


/**
 * Interface for public method of Compiller class
 *
 * @interface
 */
export interface ICompiller {
    compile(locales: ILocale): void;
}


/**
 * Interface for public method of Combine class
 *
 * @interface
 */
export interface ICombine {
    run(): void;
}
