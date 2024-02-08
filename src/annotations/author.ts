export default function author() {
	return {
		name: "author",

		parse(text: string) {
			return text.trim();
		},
	};
}
