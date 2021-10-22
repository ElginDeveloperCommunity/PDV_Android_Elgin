var capacitorm8Plugin = (function (exports, core) {
    'use strict';

    const m8Plugin = core.registerPlugin('m8Plugin', {
        web: () => Promise.resolve().then(function () { return web; }).then(m => new m.m8PluginWeb()),
    });

    class m8PluginWeb extends core.WebPlugin {
        async echo(options) {
            console.log('ECHO', options);
            return options;
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        m8PluginWeb: m8PluginWeb
    });

    exports.m8Plugin = m8Plugin;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}, capacitorExports));
//# sourceMappingURL=plugin.js.map
