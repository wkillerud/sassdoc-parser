export default function type() {
  return {
    name: "type",

    parse(text: string) {
      return text.trim();
    },

    allowedOn: ["variable"],

    multiple: false,
  };
}
