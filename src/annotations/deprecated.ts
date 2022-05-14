export default function deprecated() {
  return {
    name: "deprecated",

    parse(text: string) {
      return text.trim();
    },

    multiple: false,
  };
}
