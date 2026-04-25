import moment from "moment";
import funkophile from "funkophile";
import * as cheerio from "cheerio";
import fs from "fs";

import { createSelector } from "reselect";
const $$$ = createSelector;

import {
  contentOfFile,
  srcAndContentOfFile,
} from "funkophile/funkophileHelpers";

import {
  jadeRender,
  jadeRenderPageLayout,
  jadeRenderBlogEntry,
} from "./funkophileUtils";

import srcFunkophile from "./src/funkophile.js";

const NOT_FOUND_PAGE = "NOT_FOUND_PAGE";
const VIEWS = "VIEWS";

funkophile({
  mode: process.argv[2],
  initialState: {},

  options: {
    inFolder: "src",
    outFolder: "dist",
  },

  encodings: {
    utf8: ["md", "css", "jade", "txt", "json", "js"],
    "": ["jpg", "png", "gif", "mov"],
  },

  inputs: {
    ...srcFunkophile.inputs,
    [NOT_FOUND_PAGE]: "404.jade",
    [VIEWS]: "views/*.jade",
  },

  // return a selector based on the given selector '_'
  // the selector should return an object with keys for filenames and values of contents.
  // The contents can be a JSON-able, function or promise.

  outputs: (_) => {
    // const $packageDotJson = $$$(() => require("./packageDotJson.json"));
    const $packageDotJson = $$$(() => {
      const data = JSON.parse(fs.readFileSync("package.json").toString());
      return data;
    });

    const srcSelector = srcFunkophile.outputs(_);

    return $$$(
      [
        $$$(
          [
            $$$(
              [
                $packageDotJson,
                srcSelector.$content,
                srcAndContentOfFile(_[VIEWS], "./src/views/page.jade"),
                srcAndContentOfFile(
                  _[VIEWS],
                  "./src/views/blogEntryLayout.jade"
                ),
                contentOfFile(_[NOT_FOUND_PAGE]),
                // srcAndContentOfFile(_[VIEWS], './src/views/resume.jade'),
              ],
              (
                packageDotJson,
                content,
                pageLayout,
                blogEntryLayout,
                notFoundContent
                // resumeLayout
              ) => {
                // Sort blog entries by published date (newest first)
                const sortedBlogEntries = [...content.blog].sort(
                  (a: any, b: any) => 
                    new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime()
                );
                
                const localsToJadeRender = {
                  packageDotJson,
                  blogEntries: sortedBlogEntries,
                  // contacts: content.contacts,
                  pages: content.pages,
                  moment: moment,
                  cheerio: cheerio,
                  fs: fs,
                };

                return {
                  ...sortedBlogEntries.reduce((mm: any, blogEntry: { dest: any; }) => {
                    return {
                      ...mm,
                      [blogEntry.dest]: jadeRenderBlogEntry(
                        blogEntry,
                        blogEntryLayout,
                        localsToJadeRender
                      ),
                    };
                  }, {}),
                  ...content.pages.reduce((mm: any, page: { dest: any; content: any; }) => {
                    return {
                      ...mm,
                      [page.dest]: jadeRender(
                        page.content,
                        pageLayout,
                        localsToJadeRender
                      ),
                    };
                  }, {}),
                  // 'resume.html': jadeRenderPageLayout(content.resume.content, resumeLayout, localsToJadeRender),
                };
              }
            ),
            srcSelector.$all,
          ],
          (
            html,

            srcAll
          ) => {
            return {
              ...srcAll,
              ...html,
              "README.md": fs.readFileSync("./README.md", "utf8"),
            };
          }
        ),

        srcAndContentOfFile(_[VIEWS], "./src/views/page.jade"),
        contentOfFile(_[NOT_FOUND_PAGE]),
        $packageDotJson,
        srcSelector.$content,
        srcSelector.$resumePdfCss,
        srcSelector.$resumeHtmlCss,
      ],
      (
        site,
        pageLayout,
        notFoundContent,
        packageDotJson,
        content,
        resumePdfCss,
        resumeHtmlCss
      ) => {
        return {
          ...site,
          "resume.html.css": resumeHtmlCss,
          "resume.pdf.css": resumePdfCss,
          "sitemap.html": `<ul>${Object.keys(site)
            .sort((e) => e)
            .map((e) => `<li><a href="/${e}"> ${e} </a></li>`)
            .join("")}</ul>`,
          "fuse.js": fs.readFileSync(
            "./node_modules/fuse.js/dist/fuse.min.cjs",
            "utf8"
          ),
          "404.html": jadeRender(notFoundContent, pageLayout, {
            blogEntries: content.blog,
            packageDotJson,
            paths: Object.keys(site),
          }),
        };
      }
    );
  },
});
