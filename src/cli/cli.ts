import yargs from 'yargs';
import * as yargsHelpers from 'yargs/helpers';

import {
    ICombineOptions,
    ICombine,
    ICompiller,
    IParser,
    Combine,
    Parser,
    Compiller
} from '../index';
import * as process from "process";

/** Set CLI */
export const cli = yargs(yargsHelpers.hideBin(process.argv))
    .usage('Extract and merge locale files.\nUsage: $0 [options]')
    .version(require(`${__dirname}/../../package.json`).version)
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .option('input', {
        alias: 'i',
        describe: 'Paths you would like to extract files from. You can use path expansion, glob patterns and multiple paths',
        default: [process.env.PWD || process.cwd()],
        type: 'array',
        normalize: true
    })
    .option('output', {
        alias: 'o',
        describe: 'Paths where you would like to save merged files. You can use path expansion, glob patterns and multiple paths',
        type: 'array',
        normalize: true,
        required: true
    })
    .option('indent', {
        alias: 'it',
        describe: 'Output format indentation',
        default: '\t',
        type: 'string'
    })
    .option('sort', {
        alias: 's',
        describe: 'Sort strings in alphabetical order when saving',
        default: false,
        type: 'boolean'
    })
    .option('minify', {
        alias: 'm',
        describe: 'Minify strings in output files',
        default: false,
        type: 'boolean'
    })
    .option('verbose', {
        alias: 'vb',
        describe: 'Log all output to console',
        default: true,
        type: 'boolean'
    })
    .option('watch', {
        alias: 'w',
        describe: 'Watch changes',
        default: false,
        type: 'boolean'
    })
    .exitProcess(true)
    .parseSync();


/** Set Options from CLI */
const options: ICombineOptions = {
    input: cli.input,
    output: cli.output,
    indent: cli.indent,
    sort: cli.sort,
    minify: cli.minify,
    verbose: cli.verbose,
    watch: cli.watch
};


/**
 * Init Parser
 *
 * @type {IParser}
 * @param {ICombineOptions}
 */
const parser: IParser = new Parser(options);


/**
 * Init Compiller
 *
 * @type {ICompiller}
 * @param {ICombineOptions}
 */
const compiller: ICompiller = new Compiller(options);


/**
 * Init Combine
 *
 * @type {ICombine}
 * @param {IParser}
 * @param {ICompiller}
 */
const combine: ICombine = new Combine(options, parser, compiller);

/** CLI Task Run */
combine.run();
