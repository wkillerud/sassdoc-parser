export default function name() {
	return {
		name: "name",

		parse(text: string) {
			return text.trim();
		},

		multiple: false,
	};
}
