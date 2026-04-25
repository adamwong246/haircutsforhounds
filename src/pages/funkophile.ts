import path from 'path';
import { createSelector } from 'reselect';
const $$$ = createSelector;
import {
	contentOfFile,
	contentsOfFiles,
	srcAndContentOfFile,
	srcAndContentOfFiles,
} from 'funkophile/funkophileHelpers';

const PAGES = 'PAGES';

export default {
	inputs: {
		[PAGES]: 'pages/**/*.jade',
	},

	outputs: (_: any) => {
		return $$$(srcAndContentOfFiles(_[PAGES]), (pages: Array<{ src: string; content: string }>) => {
			return pages.map((page: { src: string; content: string }) => {
				const baseFileName = path.basename(page.src).split('.')[0];

				let dest: string, url: string;

				if (baseFileName !== 'index') {
					dest = `${baseFileName}/index.html`;
					url = `/${baseFileName}/index.html`;
				} else {
					dest = `index.html`;
					url = `/index.html`;
				}

				return {
					content: page.content,
					dest,
					url,
					title: baseFileName,
				};
			});
		});
	},
};
