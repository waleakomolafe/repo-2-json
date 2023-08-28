import core from '@actions/core';                                   //const core = require('@actions/core');
import github from '@actions/github';                               //const github = require('@actions/github');
import { globbySync } from 'globby';
import fs from 'fs';                                                    //const fs = require('fs');
import { parse as HTML, HTMLElement } from 'node-html-parser';          //const { parse: HTML, HTMLElement } = require('node-html-parser');


try {
    const startDir = core.getInput('start-dir');
    const baseUrl = core.getInput('base-url');

    const paths = globbySync(startDir, {
        gitignore: true
    });

    const readMeta = (el, name) => {
        var prop = el.getAttribute('name') || el.getAttribute('property');
        return prop == name ? el.getAttribute('content') : null;
    }

    const parse = (fileData) => {
        const $ = HTML(fileData);
        let og = {}, meta = {};

        const title = $.querySelector('title');
        if (title)
            meta.title = title.text;

        const metas = $.querySelectorAll('meta');

        for (let i = 0; i < metas.length; i++) {
            const el = metas[i];

            ['title', 'description'].forEach(s => {
                const val = readMeta(el, s);
                if (val)
                    meta[s] = val;
            });

            // ['og.title', 'og.description', 'og.image', 'og.url', 'og.site_name', 'og.type'].forEach(s => {
            //     const val = readMeta(el, s);
            //     if (val)
            //         og[s.split(':')[1]] = val;
            // });
        }

        return { meta, og };
    }

    const json = paths.map(p => {
        const data = fs.readFileSync(p, { flag: 'r'});
        const result = parse(data);

        return { 
            title: result?.meta?.title || result?.og?.title,
            description: result?.meta?.description || result?.og?.description,
            url: `${baseUrl}${p}`,
            path: p 
        };
    });

    core.setOutput('json', json);
} catch (error) {
    core.setFailed(error.message);
}
