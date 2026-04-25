import { Jimp } from "jimp";
import type { JimpInstance } from "jimp";
import { createSelector } from "reselect"
import path from "path"

import {
  contentOfFile,
} from "funkophile/funkophileHelpers";

import styleFunkophile from "./stylesheets/funkophile.js";
import pagesFunkophile from "./pages/funkophile.js";
import blogFunkophile from "./blogEntries/funkophile.js";
import assets from "./images/assets";

const $$$ = createSelector;

const FAVICON_PNG = 'FAVICON_PNG'
const JPG = 'JPG'
const PNG = 'PNG'
const JS = 'JS'
const LICENSE = 'LICENSE';
const PDF_SETTINGS = 'PDF_SETTINGS'
const FONTS = 'FONTS'
const FONT_MPLUS_BOLD = 'FONT_MPLUS_BOLD'
const FONT_RALEWAY_REGULAR = 'FONT_RALEWAY_REGULAR'
const STVINNY_PNG = 'STVINNY_PNG'

const jpgTransformPromises = (jpgs: Record<string, Buffer>) => {
  return Object.keys(jpgs)
    .reduce((mm: Record<string, Promise<Buffer>>, jKey) => {
      const shortFileName = path.basename(jKey)
      mm[jKey.split('/').slice(-2).join('/')] = Promise.resolve(jpgs[jKey]);

      const transformations: Record<string, (image: JimpInstance) => JimpInstance> = (assets as any)[shortFileName]

      if (transformations && typeof transformations === 'object') {

        Object.keys(transformations).forEach((transformationKey) => {

          mm['images/' + transformationKey + '-' + shortFileName] = new Promise((res, rej) => {

            Jimp.read(jpgs[jKey]).then((image: JimpInstance) => {
              try {
                // Get the transformation function
                const transformFunc = transformations[transformationKey];

                if (typeof transformFunc !== 'function') {
                  throw new Error(`Transformation ${transformationKey} for ${shortFileName} is not a function`);
                }

                // Apply the transformation
                const transformedImage: JimpInstance = transformFunc(image);

                // Check if the result is valid
                if (!transformedImage || typeof transformedImage.getBuffer !== 'function') {
                  throw new Error(`Transformation for ${shortFileName} did not return a valid Jimp image`);
                }

                transformedImage.getBuffer("image/jpeg", {}, (err, buffer) => {
                  if (err) {
                    console.error("Error getting buffer:", err);
                    res(jpgs[jKey]);
                  } else {
                    res(buffer);
                  }
                });
              } catch (error) {
                console.error("Error during transformation:", error);
                // Resolve with original content instead of exiting
                res(jpgs[jKey]);
              }
            }).catch(err => {
              console.error("Error reading image:", err);
              // Resolve with original content instead of exiting
              res(jpgs[jKey]);
            });
          });

        });

      }
      return mm;
    }, {} as Record<string, Promise<Buffer>>)
};

const pngTransformPromises = (pngs: Record<string, Buffer>) => {
  return Object.keys(pngs)
    .reduce((mm: Record<string, Promise<Buffer>>, pKey) => {
      const shortFileName = path.basename(pKey)
      mm[pKey.split('/').slice(-2).join('/')] = Promise.resolve(pngs[pKey]);

      const transformations: Record<string, (image: JimpInstance) => JimpInstance> = (assets as any)[shortFileName]

      if (transformations && typeof transformations === 'object') {

        Object.keys(transformations).forEach((transformationKey) => {

          mm['images/' + transformationKey + '-' + shortFileName] = new Promise((res, rej) => {

            Jimp.read(pngs[pKey]).then((image: JimpInstance) => {
              try {
                // Get the transformation function
                const transformFunc = transformations[transformationKey];

                if (typeof transformFunc !== 'function') {
                  throw new Error(`Transformation ${transformationKey} for ${shortFileName} is not a function`);
                }

                // Apply the transformation
                const transformedImage: JimpInstance = transformFunc(image);

                // Check if the result is valid
                if (!transformedImage || typeof transformedImage.getBuffer !== 'function') {
                  throw new Error(`Transformation for ${shortFileName} did not return a valid Jimp image`);
                }

                transformedImage.getBuffer("image/png", {}, (err, buffer) => {
                  if (err) {
                    console.error("Error getting buffer:", err);
                    res(pngs[pKey]);
                  } else {
                    res(buffer);
                  }
                });
              } catch (error) {
                console.error("Error during transformation:", error);
                // Resolve with original content instead of exiting
                res(pngs[pKey]);
              }
            }).catch(err => {
              console.error("Error reading image:", err);
              // Resolve with original content instead of exiting
              res(pngs[pKey]);
            });
          });

        });

      }
      return mm;
    }, {} as Record<string, Promise<Buffer>>)
};

export default {

  inputs: {
    [FAVICON_PNG]: 'images/stVinny2.png',
    [STVINNY_PNG]: 'images/stVinny2.png',
    [JPG]: 'images/*.jpg',
    [PNG]: 'images/*.png',
    [JS]: 'index.js',
    [LICENSE]: 'LICENSE.txt',
    [PDF_SETTINGS]: 'pdfSettings.json',
    [FONT_MPLUS_BOLD]: 'fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Bold.ttf',
    [FONT_RALEWAY_REGULAR]: 'fonts/Raleway/static/Raleway-Regular.ttf',

    ...styleFunkophile.inputs,
    ...pagesFunkophile.inputs,
    ...blogFunkophile.inputs,
  },

  outputs: (_) => {

    const blogSelector = blogFunkophile.outputs(_);
    const cssSelector = styleFunkophile.outputs(_);
    const pageSelectors = pagesFunkophile.outputs(_);

    const $js = contentOfFile(_["JS"]);
    const $favicon = contentOfFile(_["FAVICON_PNG"]);
    const $license = contentOfFile(_["LICENSE"]);

    return {
      $pages: pageSelectors,
      ...blogSelector,
      $js,
      $favicon,
      $content: $$$([
        pageSelectors,
        blogSelector.$blog,
      ], (p, b) => {
        return {
          pages: p,
          blog: b,
        }
      }),

      $all: $$$([
        $favicon,
        $js,
        $license,
        cssSelector.$webCss,
        blogSelector.$allBlogAssets,
        $$$(
          [_.JPG], jpgTransformPromises
        ),
        $$$(
          [_.PNG], pngTransformPromises
        ),
        contentOfFile(_["FONT_MPLUS_BOLD"]),
        contentOfFile(_["FONT_RALEWAY_REGULAR"]),
        blogSelector.$rssFeed,
        contentOfFile(_["STVINNY_PNG"]),
      ], (
        f,
        j,
        l,
        css,
        allBlogAssets,
        jpgs,
        pngs,
        fontMplusBold,
        fontRalewayRegular,
        rssFeed,
        stVinny
      ) => {
        console.log('DIAGNOSTIC: $all selector allBlogAssets keys:', Object.keys(allBlogAssets));
        console.log('DIAGNOSTIC: $all selector jpgs keys:', Object.keys(jpgs));
        console.log('DIAGNOSTIC: $all selector pngs keys:', Object.keys(pngs));
        const result = {
          'favicon.png': f,
          'index.js': j,
          'LICENSE.txt': l,
          'style.css': css,
          ...allBlogAssets,
          ...jpgs,
          ...pngs,
          'fonts/MPLUSRounded1c-Bold.ttf': fontMplusBold,
          'fonts/Raleway-Regular.ttf': fontRalewayRegular,
          'rss.xml': rssFeed,
          'images/stVinny2.png': stVinny,
        };
        console.log('DIAGNOSTIC: $all selector final keys:', Object.keys(result));
        return result;
      }),

      $resumePdfCss: cssSelector.$resumePdfCss,
      $resumeHtmlCss: cssSelector.$resumeHtmlCss

    }
  }
}
