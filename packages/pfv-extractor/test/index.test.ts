import { cmdHandler, main } from "../src";
// import { exec } from "child_process";
import { exec } from 'shelljs'
import iconv from "iconv-lite";
import { toStr } from "../src/encoding";
import fs from "fs-extra";
// exec("CHCP 932")
describe("base", () => {
  console.log(__dirname);
  it("output", async () => {
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
    exec("node scripts/index.js")
    return 
    // main(["node", "--help"])
    // expect(toStr(toStr(a, "SJIS", "BINARY"), "SJIS")).toMatchInlineSnapshot();
    // expect(toStr(toStr(a, "SJIS", "BINARY"), "UTF8")).toMatchInlineSnapshot();
    // expect(toStr(toStr(a, "UTF8", "BINARY"), "SJIS")).toMatchInlineSnapshot();
  });
});
