export default function output() {
  return {
    name: "output",

    parse(text: string) {
      return text.trim();
    },

    alias: ["outputs"],

    allowedOn: ["mixin"],

    multiple: false,
  };
}
