import { cmdHandler, main } from "../src";
// import { exec } from "child_process";
import { exec } from "shelljs";
import iconv from "iconv-lite";
import pathlib from "path";
import { toStr } from "../src/encoding";
import fs from "fs-extra";
import { getTokenizer } from "kuromojin";
// exec("CHCP 932")
describe("base", () => {
  console.log(__dirname);
  it("output", async () => {
    const ignore = {
      "*": true
    };
    const tokenizer = await getTokenizer({ dicPath: pathlib.join(__dirname, "..", 'assets/kuromoji/dict') });
    const r = tokenizer.tokenize("東北きりたん立ち絵Ver1β");
    const a = r.map(v => v.reading || v.surface_form).join("");
    expect(a).toMatchInlineSnapshot(`"トウホクキリタンタチエVer1ベータ"`);
    expect(r).toMatchInlineSnapshot(`
      Array [
        Object {
          "basic_form": "東北",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "固有名詞",
          "pos_detail_2": "地域",
          "pos_detail_3": "一般",
          "pronunciation": "トーホク",
          "reading": "トウホク",
          "surface_form": "東北",
          "word_id": 1810600,
          "word_position": 1,
          "word_type": "KNOWN",
        },
        Object {
          "basic_form": "きり",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "一般",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "pronunciation": "キリ",
          "reading": "キリ",
          "surface_form": "きり",
          "word_id": 2153440,
          "word_position": 3,
          "word_type": "KNOWN",
        },
        Object {
          "basic_form": "たん",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "一般",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "pronunciation": "タン",
          "reading": "タン",
          "surface_form": "たん",
          "word_id": 2751560,
          "word_position": 5,
          "word_type": "KNOWN",
        },
        Object {
          "basic_form": "立ち",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "一般",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "pronunciation": "タチ",
          "reading": "タチ",
          "surface_form": "立ち",
          "word_id": 124320,
          "word_position": 7,
          "word_type": "KNOWN",
        },
        Object {
          "basic_form": "絵",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "接尾",
          "pos_detail_2": "一般",
          "pos_detail_3": "*",
          "pronunciation": "エ",
          "reading": "エ",
          "surface_form": "絵",
          "word_id": 88450,
          "word_position": 9,
          "word_type": "KNOWN",
        },
        Object {
          "basic_form": "*",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "一般",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "surface_form": "Ver",
          "word_id": 100,
          "word_position": 10,
          "word_type": "UNKNOWN",
        },
        Object {
          "basic_form": "*",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "名詞",
          "pos_detail_1": "数",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "surface_form": "1",
          "word_id": 90,
          "word_position": 13,
          "word_type": "UNKNOWN",
        },
        Object {
          "basic_form": "β",
          "conjugated_form": "*",
          "conjugated_type": "*",
          "pos": "記号",
          "pos_detail_1": "アルファベット",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "pronunciation": "ベータ",
          "reading": "ベータ",
          "surface_form": "β",
          "word_id": 89950,
          "word_position": 14,
          "word_type": "KNOWN",
        },
      ]
    `);
    // const result = await cmdHandler(__dirname + "/MtU_akane_ver2.pfv");
    // expect(typeof result).toBe("string");
    // fs.writeFileSync(
    //   __dirname + "\\test.txt",
    //   iconv.encode("？！", "sjis", { defaultEncoding: "utf8" })
    // );

    // const paramsStr = await new Promise<string>(resolve => {
    //   exec("lua test.lua", { cwd: __dirname }, (error, out) => {
    //     resolve(out);
    //   });
    // });
    // // console.log(a)
    // expect(paramsStr).toMatchInlineSnapshot(`""`);
    // await main([]);
    // exec("node scripts/index.js")
    return;
    // main(["node", "--help"])
    // expect(toStr(toStr(a, "SJIS", "BINARY"), "SJIS")).toMatchInlineSnapshot();
    // expect(toStr(toStr(a, "SJIS", "BINARY"), "UTF8")).toMatchInlineSnapshot();
    // expect(toStr(toStr(a, "UTF8", "BINARY"), "SJIS")).toMatchInlineSnapshot();
  });
});
