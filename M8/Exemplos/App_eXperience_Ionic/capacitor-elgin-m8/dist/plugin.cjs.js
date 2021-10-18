'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

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
//# sourceMappingURL=plugin.cjs.js.map
