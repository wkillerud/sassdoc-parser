type GroupInfo = {
	groupDescriptions: Record<string, string>;
};

export default function group() {
	return {
		name: "group",

		parse(text: string, info: GroupInfo) {
			const lines = text.trim().split("\n");
			const slug = lines[0].trim().toLowerCase();
			const description = lines.splice(1).join("\n").trim();
			if (description) {
				info.groupDescriptions = info.groupDescriptions || {};
				info.groupDescriptions[slug] = description;
			}
			return [slug];
		},

		default() {
			return ["undefined"];
		},

		multiple: false,
	};
}
