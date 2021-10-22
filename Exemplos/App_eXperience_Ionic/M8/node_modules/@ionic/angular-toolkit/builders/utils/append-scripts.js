"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.augmentIndexHtml = void 0;
const cheerio_1 = require("cheerio");
function augmentIndexHtml(indexString, scripts) {
    const $ = cheerio_1.load(indexString);
    for (const script of scripts) {
        $('html').append(`<script src="${script.bundleName}.js"></script>`);
    }
    const final = $.html();
    return final;
}
exports.augmentIndexHtml = augmentIndexHtml;
