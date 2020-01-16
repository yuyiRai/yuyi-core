import { ShellUtils } from "../src";

const shells = new ShellUtils();
test("env", () => {
  shells.setEnvCode("gbk");
  expect(
    shells.exec(
      'reg delete "HKEY_CLASSES_ROOT*shellyuyi" /f && reg delete "HKEY_CLASSES_ROOTDirectoryshellyuyi" /f && reg delete "HKEY_CLASSES_ROOTDirectoryBackgroundshellyuyi"'
    )
  ).toMatchInlineSnapshot(`
    "Command failed: reg delete \\"HKEY_CLASSES_ROOT*shellyuyi\\" /f && reg delete \\"HKEY_CLASSES_ROOTDirectoryshellyuyi\\" /f && reg delete \\"HKEY_CLASSES_ROOTDirectoryBackgroundshellyuyi\\"
    错误: 无效项名。
    键入 \\"REG DELETE /?\\" 了解用法信息。
    "
  `);
  expect(
    shells.setEnv("AVIUTL_DIR", "C:\\AVIUTL\\AVIUTL_EN")
  ).toMatchInlineSnapshot(`"成功: 指定的值已得到保存。"`);
  expect(shells.getEnv("AVIUTL_DIR")).toMatchInlineSnapshot(
    `"C:\\\\AVIUTL\\\\AVIUTL_EN\\\\Script\\\\tachie_psdtoolkit"`
  );
  expect(shells.getEnvCode()).toMatchInlineSnapshot(`936`);
});
