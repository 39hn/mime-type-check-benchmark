import Benchmark from "benchmark";
import typeIs from "type-is";

const JSON_MIME_TYPE = "application/json";

const IdentityOperator = (text?: string) => text === JSON_MIME_TYPE;

const TypeIs = (text?: string) =>
  text !== undefined && !!typeIs.is(text, JSON_MIME_TYPE);

const SplitSome = (text?: string) =>
  text !== undefined &&
  text
    .split(";")
    .map((str) => str.trim())
    .some((str) => str === "application/json");

const StringIncludes = (text?: string) =>
  text === JSON_MIME_TYPE ||
  (text !== undefined && text.includes(JSON_MIME_TYPE));

const suite: Benchmark.Suite = new Benchmark.Suite();

const funcs: Array<(text?: string) => boolean> = [
  IdentityOperator,
  TypeIs,
  SplitSome,
  StringIncludes,
];

const cases: Record<string, [string | undefined, boolean]> = {
  JSON_HEADER: ["application/json", true],
  JSON_HEADER_WITH_CHARSET: ["application/json; charset=utf-8", true],
  PLAIN_HEADER: ["text/plain", false],
  PLAIN_HEADER_WITH_CHARSET: ["text/plain; charset=utf-8", false],
  EMPTY_HEADER: ["", false],
  UNDEFINED_HEADER: [undefined, false],
};

suite.on("cycle", (e: Benchmark.Event) => {
  console.log(String(e.target));
});

funcs.forEach((func) => {
  Object.entries(cases).forEach(([key, [header, shouldBe]]) => {
    suite.add(`${func.name}#${key}`, () => {
      if (func(header) !== shouldBe) throw new Error("fail");
    });
  });
});

suite.run({ async: true });
