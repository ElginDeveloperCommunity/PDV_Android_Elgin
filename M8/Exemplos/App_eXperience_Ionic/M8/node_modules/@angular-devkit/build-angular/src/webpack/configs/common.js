"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommonConfig = void 0;
const build_optimizer_1 = require("@angular-devkit/build-optimizer");
const compiler_cli_1 = require("@angular/compiler-cli");
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const typescript_1 = require("typescript");
const webpack_1 = require("webpack");
const utils_1 = require("../../utils");
const cache_path_1 = require("../../utils/cache-path");
const environment_options_1 = require("../../utils/environment-options");
const find_up_1 = require("../../utils/find-up");
const spinner_1 = require("../../utils/spinner");
const webpack_diagnostics_1 = require("../../utils/webpack-diagnostics");
const plugins_1 = require("../plugins");
const helpers_1 = require("../utils/helpers");
// eslint-disable-next-line max-lines-per-function
function getCommonConfig(wco) {
    var _a, _b;
    const { root, projectRoot, buildOptions, tsConfig } = wco;
    const { platform = 'browser', sourceMap: { styles: stylesSourceMap, scripts: scriptsSourceMap, vendor: vendorSourceMap }, optimization: { styles: stylesOptimization, scripts: scriptsOptimization }, } = buildOptions;
    const extraPlugins = [];
    const extraRules = [];
    const entryPoints = {};
    // determine hashing format
    const hashFormat = helpers_1.getOutputHashFormat(buildOptions.outputHashing || 'none');
    const buildBrowserFeatures = new utils_1.BuildBrowserFeatures(projectRoot);
    const targetInFileName = helpers_1.getEsVersionForFileName(tsConfig.options.target, buildOptions.differentialLoadingNeeded);
    if (buildOptions.progress) {
        const spinner = new spinner_1.Spinner();
        spinner.start(`Generating ${platform} application bundles (phase: setup)...`);
        extraPlugins.push(new webpack_1.ProgressPlugin({
            handler: (percentage, message) => {
                const phase = message ? ` (phase: ${message})` : '';
                spinner.text = `Generating ${platform} application bundles${phase}...`;
                switch (percentage) {
                    case 1:
                        if (spinner.isSpinning) {
                            spinner.succeed(`${platform.replace(/^\w/, (s) => s.toUpperCase())} application bundle generation complete.`);
                        }
                        break;
                    case 0:
                        if (!spinner.isSpinning) {
                            spinner.start();
                        }
                        break;
                }
            },
        }));
    }
    if (buildOptions.main) {
        const mainPath = path.resolve(root, buildOptions.main);
        entryPoints['main'] = [mainPath];
    }
    const differentialLoadingMode = buildOptions.differentialLoadingNeeded && !buildOptions.watch;
    if (platform !== 'server') {
        if (differentialLoadingMode || tsConfig.options.target === typescript_1.ScriptTarget.ES5) {
            if (buildBrowserFeatures.isEs5SupportNeeded()) {
                const polyfillsChunkName = 'polyfills-es5';
                entryPoints[polyfillsChunkName] = [path.join(__dirname, '..', 'es5-polyfills.js')];
                if (!buildOptions.aot) {
                    if (differentialLoadingMode) {
                        entryPoints[polyfillsChunkName].push(path.join(__dirname, '..', 'jit-polyfills.js'));
                    }
                    entryPoints[polyfillsChunkName].push(path.join(__dirname, '..', 'es5-jit-polyfills.js'));
                }
                // If not performing a full differential build the polyfills need to be added to ES5 bundle
                if (buildOptions.polyfills) {
                    entryPoints[polyfillsChunkName].push(path.resolve(root, buildOptions.polyfills));
                }
            }
        }
        if (buildOptions.polyfills) {
            const projectPolyfills = path.resolve(root, buildOptions.polyfills);
            if (entryPoints['polyfills']) {
                entryPoints['polyfills'].push(projectPolyfills);
            }
            else {
                entryPoints['polyfills'] = [projectPolyfills];
            }
        }
        if (!buildOptions.aot) {
            const jitPolyfills = path.join(__dirname, '..', 'jit-polyfills.js');
            if (entryPoints['polyfills']) {
                entryPoints['polyfills'].push(jitPolyfills);
            }
            else {
                entryPoints['polyfills'] = [jitPolyfills];
            }
        }
    }
    if (environment_options_1.profilingEnabled) {
        extraPlugins.push(new webpack_1.debug.ProfilingPlugin({
            outputPath: path.resolve(root, 'chrome-profiler-events.json'),
        }));
    }
    // process global scripts
    const globalScriptsByBundleName = helpers_1.normalizeExtraEntryPoints(buildOptions.scripts, 'scripts').reduce((prev, curr) => {
        const { bundleName, inject, input } = curr;
        let resolvedPath = path.resolve(root, input);
        if (!fs_1.existsSync(resolvedPath)) {
            try {
                resolvedPath = require.resolve(input, { paths: [root] });
            }
            catch {
                throw new Error(`Script file ${input} does not exist.`);
            }
        }
        const existingEntry = prev.find((el) => el.bundleName === bundleName);
        if (existingEntry) {
            if (existingEntry.inject && !inject) {
                // All entries have to be lazy for the bundle to be lazy.
                throw new Error(`The ${bundleName} bundle is mixing injected and non-injected scripts.`);
            }
            existingEntry.paths.push(resolvedPath);
        }
        else {
            prev.push({
                bundleName,
                inject,
                paths: [resolvedPath],
            });
        }
        return prev;
    }, []);
    // Add a new asset for each entry.
    for (const script of globalScriptsByBundleName) {
        // Lazy scripts don't get a hash, otherwise they can't be loaded by name.
        const hash = script.inject ? hashFormat.script : '';
        const bundleName = script.bundleName;
        extraPlugins.push(new plugins_1.ScriptsWebpackPlugin({
            name: bundleName,
            sourceMap: scriptsSourceMap,
            filename: `${path.basename(bundleName)}${hash}.js`,
            scripts: script.paths,
            basePath: projectRoot,
        }));
    }
    // process asset entries
    if (buildOptions.assets.length) {
        const copyWebpackPluginPatterns = buildOptions.assets.map((asset, index) => {
            // Resolve input paths relative to workspace root and add slash at the end.
            // eslint-disable-next-line prefer-const
            let { input, output, ignore = [], glob } = asset;
            input = path.resolve(root, input).replace(/\\/g, '/');
            input = input.endsWith('/') ? input : input + '/';
            output = output.endsWith('/') ? output : output + '/';
            if (output.startsWith('..')) {
                throw new Error('An asset cannot be written to a location outside of the output path.');
            }
            return {
                context: input,
                // Now we remove starting slash to make Webpack place it from the output root.
                to: output.replace(/^\//, ''),
                from: glob,
                noErrorOnMissing: true,
                force: true,
                globOptions: {
                    dot: true,
                    followSymbolicLinks: !!asset.followSymlinks,
                    ignore: [
                        '.gitkeep',
                        '**/.DS_Store',
                        '**/Thumbs.db',
                        // Negate patterns needs to be absolute because copy-webpack-plugin uses absolute globs which
                        // causes negate patterns not to match.
                        // See: https://github.com/webpack-contrib/copy-webpack-plugin/issues/498#issuecomment-639327909
                        ...ignore,
                    ].map((i) => path.posix.join(input, i)),
                },
                priority: index,
            };
        });
        extraPlugins.push(new copy_webpack_plugin_1.default({
            patterns: copyWebpackPluginPatterns,
        }));
    }
    if (buildOptions.showCircularDependencies) {
        const CircularDependencyPlugin = require('circular-dependency-plugin');
        extraPlugins.push(new CircularDependencyPlugin({
            exclude: /[\\\/]node_modules[\\\/]/,
        }));
    }
    if (buildOptions.extractLicenses) {
        const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
        extraPlugins.push(new LicenseWebpackPlugin({
            stats: {
                warnings: false,
                errors: false,
            },
            perChunkOutput: false,
            outputFilename: '3rdpartylicenses.txt',
            skipChildCompilers: true,
        }));
    }
    if (buildOptions.statsJson) {
        extraPlugins.push(new (class {
            apply(compiler) {
                compiler.hooks.done.tapPromise('angular-cli-stats', async (stats) => {
                    const { stringifyStream } = await Promise.resolve().then(() => __importStar(require('@discoveryjs/json-ext')));
                    const data = stats.toJson('verbose');
                    const statsOutputPath = path.resolve(root, buildOptions.outputPath, 'stats.json');
                    try {
                        await fs_1.promises.mkdir(path.dirname(statsOutputPath), { recursive: true });
                        await new Promise((resolve, reject) => stringifyStream(data)
                            .pipe(fs_1.createWriteStream(statsOutputPath))
                            .on('close', resolve)
                            .on('error', reject));
                    }
                    catch (error) {
                        webpack_diagnostics_1.addError(stats.compilation, `Unable to write stats file: ${error.message || 'unknown error'}`);
                    }
                });
            }
        })());
    }
    if (scriptsSourceMap || stylesSourceMap) {
        extraRules.push({
            test: /\.m?js$/,
            exclude: vendorSourceMap ? undefined : /[\\\/]node_modules[\\\/]/,
            enforce: 'pre',
            loader: require.resolve('source-map-loader'),
        });
    }
    let buildOptimizerUseRule = [];
    if (buildOptions.buildOptimizer && wco.scriptTarget < typescript_1.ScriptTarget.ES2015) {
        extraPlugins.push(new build_optimizer_1.BuildOptimizerWebpackPlugin());
        buildOptimizerUseRule = [
            {
                loader: build_optimizer_1.buildOptimizerLoaderPath,
                options: { sourceMap: scriptsSourceMap },
            },
        ];
    }
    const extraMinimizers = [];
    if (scriptsOptimization) {
        const TerserPlugin = require('terser-webpack-plugin');
        const angularGlobalDefinitions = buildOptions.aot
            ? compiler_cli_1.GLOBAL_DEFS_FOR_TERSER_WITH_AOT
            : compiler_cli_1.GLOBAL_DEFS_FOR_TERSER;
        // TODO: Investigate why this fails for some packages: wco.supportES2015 ? 6 : 5;
        const terserEcma = 5;
        const terserOptions = {
            warnings: !!buildOptions.verbose,
            safari10: true,
            output: {
                ecma: terserEcma,
                // For differential loading, this is handled in the bundle processing.
                ascii_only: !differentialLoadingMode,
                // Default behavior (undefined value) is to keep only important comments (licenses, etc.)
                comments: !buildOptions.extractLicenses && undefined,
                webkit: true,
                beautify: environment_options_1.shouldBeautify,
                wrap_func_args: false,
            },
            // On server, we don't want to compress anything. We still set the ngDevMode = false for it
            // to remove dev code, and ngI18nClosureMode to remove Closure compiler i18n code
            compress: environment_options_1.allowMinify &&
                (platform === 'server'
                    ? {
                        ecma: terserEcma,
                        global_defs: angularGlobalDefinitions,
                        keep_fnames: true,
                    }
                    : {
                        ecma: terserEcma,
                        pure_getters: buildOptions.buildOptimizer,
                        // PURE comments work best with 3 passes.
                        // See https://github.com/webpack/webpack/issues/2899#issuecomment-317425926.
                        passes: buildOptions.buildOptimizer ? 3 : 1,
                        global_defs: angularGlobalDefinitions,
                        pure_funcs: ['forwardRef'],
                    }),
            // We also want to avoid mangling on server.
            // Name mangling is handled within the browser builder
            mangle: environment_options_1.allowMangle && platform !== 'server' && !differentialLoadingMode,
        };
        const globalScriptsNames = globalScriptsByBundleName.map((s) => s.bundleName);
        extraMinimizers.push(new TerserPlugin({
            parallel: environment_options_1.maxWorkers,
            extractComments: false,
            exclude: globalScriptsNames,
            terserOptions,
        }), 
        // Script bundles are fully optimized here in one step since they are never downleveled.
        // They are shared between ES2015 & ES5 outputs so must support ES5.
        new TerserPlugin({
            parallel: environment_options_1.maxWorkers,
            extractComments: false,
            include: globalScriptsNames,
            terserOptions: {
                ...terserOptions,
                compress: environment_options_1.allowMinify && {
                    ...terserOptions.compress,
                    ecma: 5,
                },
                output: {
                    ...terserOptions.output,
                    ecma: 5,
                },
                mangle: environment_options_1.allowMangle && platform !== 'server',
            },
        }));
    }
    return {
        mode: scriptsOptimization || stylesOptimization.minify ? 'production' : 'development',
        devtool: false,
        target: [
            platform === 'server' ? 'node' : 'web',
            tsConfig.options.target === typescript_1.ScriptTarget.ES5 ||
                (platform !== 'server' && buildBrowserFeatures.isEs5SupportNeeded())
                ? 'es5'
                : 'es2015',
        ],
        profile: buildOptions.statsJson,
        resolve: {
            roots: [projectRoot],
            extensions: ['.ts', '.tsx', '.mjs', '.js'],
            symlinks: !buildOptions.preserveSymlinks,
            modules: [tsConfig.options.baseUrl || projectRoot, 'node_modules'],
        },
        resolveLoader: {
            symlinks: !buildOptions.preserveSymlinks,
            modules: [
                // Allow loaders to be in a node_modules nested inside the devkit/build-angular package.
                // This is important in case loaders do not get hoisted.
                // If this file moves to another location, alter potentialNodeModules as well.
                'node_modules',
                ...find_up_1.findAllNodeModules(__dirname, projectRoot),
            ],
        },
        context: root,
        entry: entryPoints,
        output: {
            clean: (_a = buildOptions.deleteOutputPath) !== null && _a !== void 0 ? _a : true,
            path: path.resolve(root, buildOptions.outputPath),
            publicPath: (_b = buildOptions.deployUrl) !== null && _b !== void 0 ? _b : '',
            filename: ({ chunk }) => {
                if ((chunk === null || chunk === void 0 ? void 0 : chunk.name) === 'polyfills-es5') {
                    return `polyfills-es5${hashFormat.chunk}.js`;
                }
                else {
                    return `[name]${targetInFileName}${hashFormat.chunk}.js`;
                }
            },
            chunkFilename: `[name]${targetInFileName}${hashFormat.chunk}.js`,
        },
        watch: buildOptions.watch,
        watchOptions: helpers_1.getWatchOptions(buildOptions.poll),
        performance: {
            hints: false,
        },
        ignoreWarnings: [
            // Webpack 5+ has no facility to disable this warning.
            // System.import is used in @angular/core for deprecated string-form lazy routes
            /System.import\(\) is deprecated and will be removed soon/i,
            // https://github.com/webpack-contrib/source-map-loader/blob/b2de4249c7431dd8432da607e08f0f65e9d64219/src/index.js#L83
            /Failed to parse source map from/,
            // https://github.com/webpack-contrib/postcss-loader/blob/bd261875fdf9c596af4ffb3a1a73fe3c549befda/src/index.js#L153-L158
            /Add postcss as project dependency/,
        ],
        module: {
            // Show an error for missing exports instead of a warning.
            strictExportPresence: true,
            rules: [
                {
                    // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                    // Removing this will cause deprecation warnings to appear.
                    test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                    parser: { system: true },
                },
                {
                    // Mark files inside `rxjs/add` as containing side effects.
                    // If this is fixed upstream and the fixed version becomes the minimum
                    // supported version, this can be removed.
                    test: /[\/\\]rxjs[\/\\]add[\/\\].+\.js$/,
                    sideEffects: true,
                },
                {
                    test: /\.[cm]?js$|\.tsx?$/,
                    // The below is needed due to a bug in `@babel/runtime`. See: https://github.com/babel/babel/issues/12824
                    resolve: { fullySpecified: false },
                    exclude: [/[\/\\](?:core-js|\@babel|tslib|web-animations-js)[\/\\]/],
                    use: [
                        {
                            loader: require.resolve('../../babel/webpack-loader'),
                            options: {
                                cacheDirectory: cache_path_1.findCachePath('babel-webpack'),
                                scriptTarget: wco.scriptTarget,
                                aot: buildOptions.aot,
                                optimize: buildOptions.buildOptimizer && wco.scriptTarget >= typescript_1.ScriptTarget.ES2015,
                            },
                        },
                        ...buildOptimizerUseRule,
                    ],
                },
                ...extraRules,
            ],
        },
        experiments: {
            syncWebAssembly: true,
            asyncWebAssembly: true,
        },
        cache: getCacheSettings(wco, buildBrowserFeatures.supportedBrowsers),
        optimization: {
            minimizer: extraMinimizers,
            moduleIds: 'deterministic',
            chunkIds: buildOptions.namedChunks ? 'named' : 'deterministic',
            emitOnErrors: false,
        },
        plugins: [
            // Always replace the context for the System.import in angular/core to prevent warnings.
            // https://github.com/angular/angular/issues/11580
            new webpack_1.ContextReplacementPlugin(/\@angular(\\|\/)core(\\|\/)/, path.join(projectRoot, '$_lazy_route_resources'), {}),
            new plugins_1.DedupeModuleResolvePlugin({ verbose: buildOptions.verbose }),
            ...extraPlugins,
        ],
    };
}
exports.getCommonConfig = getCommonConfig;
function getCacheSettings(wco, supportedBrowsers) {
    if (environment_options_1.persistentBuildCacheEnabled) {
        const packageVersion = require('../../../package.json').version;
        return {
            type: 'filesystem',
            cacheDirectory: cache_path_1.findCachePath('angular-webpack'),
            maxMemoryGenerations: 1,
            // We use the versions and build options as the cache name. The Webpack configurations are too
            // dynamic and shared among different build types: test, build and serve.
            // None of which are "named".
            name: crypto_1.createHash('sha1')
                .update(compiler_cli_1.VERSION.full)
                .update(packageVersion)
                .update(wco.projectRoot)
                .update(JSON.stringify(wco.tsConfig))
                .update(JSON.stringify({
                ...wco.buildOptions,
                // Needed because outputPath changes on every build when using i18n extraction
                // https://github.com/angular/angular-cli/blob/736a5f89deaca85f487b78aec9ff66d4118ceb6a/packages/angular_devkit/build_angular/src/utils/i18n-options.ts#L264-L265
                outputPath: undefined,
            }))
                .update(supportedBrowsers.join(''))
                .digest('hex'),
        };
    }
    if (wco.buildOptions.watch && !environment_options_1.cachingDisabled) {
        return {
            type: 'memory',
            maxGenerations: 1,
        };
    }
    return false;
}
