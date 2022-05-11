export default function todo() {
  return {
    name: "todo",

    parse(text: string) {
      return text.trim();
    },

    alias: ["todos"],
  };
}
