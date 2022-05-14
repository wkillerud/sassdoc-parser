const linkRegex = /\s*([^:]+:\/\/[^\s]*)?\s*(.*?)$/;

export default function link() {
  return {
    name: "link",

    parse(text: string) {
      const parsed = linkRegex.exec(text.trim());

      if (!parsed) {
        return {
          url: "",
          caption: "",
        };
      }

      return {
        url: parsed[1] || "",
        caption: parsed[2] || "",
      };
    },

    alias: ["source"],
  };
}
