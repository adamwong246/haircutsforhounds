import jade from 'jade';

export const jadeRender = (content: string, pageLayout: { src: string }, locals: any): string => {
	return jade.render(content, {
		filename: pageLayout.src,
		...locals,
	});
};

export const jadeRenderPageLayout = (content: string, pageLayout: { src: string; content: string }, locals: any): string => {
	const l = {
		filename: pageLayout.src,
		page: {
			content: content,
		},
		...locals,
	};

	return jade.render(pageLayout.content, l);
};

export const jadeRenderBlogEntry = (blogEntry: any, blogEntryLayout: { src: string; content: string }, locals: any): string => {
	return jade.render(blogEntryLayout.content, {
		filename: blogEntryLayout.src,
		entry: blogEntry,
		page: {
			content: blogEntry.markdownContent,
		},
		...locals,
	});
};
