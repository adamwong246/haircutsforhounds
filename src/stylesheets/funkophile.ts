import { createSelector } from 'reselect';
const $$$ = createSelector;

import {contentsOfFiles} from 'funkophile/funkophileHelpers';
import fs from 'fs';
import CleanCSS from 'clean-css';

const cleandAndMinifyCss = (css: string) => {
	return new CleanCSS({
		keepSpecialComments: 2,
	}).minify(css).styles;
};

export default {
	inputs: {
		['CSS']: 'stylesheets/*.css',
		['RESUME_CSS']: 'stylesheets/resume/*.css',
	},

	outputs: (_: { [x: string]: any; }) => {
		const normalizeDotCss = fs.readFileSync(
			'./node_modules/normalize.css/normalize.css',
			'utf8',
		);

		const $webCss = $$$(
			[contentsOfFiles(_['CSS']), $$$([], () => normalizeDotCss)],
			(css: string, normalize: string) => cleandAndMinifyCss(normalize + '\n' + css),
		);

		const $resumePdfCss = $$$([_['CSS'], _['RESUME_CSS']], (cssFiles: any, rf: Record<string, string>) => {
			// Helper to find content by filename since keys may be absolute paths
			const findContent = (filename: string): string => {
				const key = Object.keys(rf).find(k => k.endsWith(filename));
				return key ? rf[key] : '';
			};
	
			return [
				normalizeDotCss,
				findContent('resume.css'),
				findContent('resume.pdf.css'),
				// Only include the resume-specific styles, not the full typography.css which has many font references
			].join('\n');
		});

		const $resumeHtmlCss = $$$([_['CSS'], _['RESUME_CSS']], (cssFiles: any, rf: Record<string, string>) => {
			// Helper to find content by filename since keys may be absolute paths
			const findContent = (filename: string): string => {
				const key = Object.keys(rf).find(k => k.endsWith(filename));
				return key ? rf[key] : '';
			};
	
			return [
				normalizeDotCss,
				findContent('resume.css'),
				findContent('resume.html.css'),
				// Only include the resume-specific styles, not the full typography.css which has many font references
			].join('\n');
		});

		return {
			$webCss,
			$resumePdfCss,
			$resumeHtmlCss,
		};
	},
};
