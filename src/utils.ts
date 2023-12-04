const findLowestNumberOfPreceedingWhitespace = (block: string): number => {
	const lines = block.match(/^[ \t]*(?=\S)/gm);
	if (!lines) {
		return 0;
	}
	return lines.reduce((r, a) => Math.min(r, a.length), Infinity);
};

export const removeReduntantWhitespace = (block: string): string => {
	const indent = findLowestNumberOfPreceedingWhitespace(block);

	if (indent === 0) {
		return block;
	}

	return block.replace(new RegExp(`^[ \\t]{${indent}}`, "gm"), "");
};
