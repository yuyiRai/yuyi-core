extern crate uuid;
extern crate wasm_bindgen;

use uuid::Uuid;
use wasm_bindgen::prelude::*;
// use wasm_bindgen::JsValue::*;

#[wasm_bindgen]
extern "C" {
  #[wasm_bindgen(js_namespace = console)]
  pub fn log(s: &str);
  #[wasm_bindgen(js_namespace = console)]
  pub fn time(s: &str);
  #[wasm_bindgen(js_namespace = console)]
  pub fn timeEnd(s: &str);
}

#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
export type Coords = { 
  "latitude": number, 
  "longitude": number, 
}; 
"#;

#[wasm_bindgen]
pub fn get_uuid() -> String {
  // time("get_uuid");
  // let _t = Uuid::new_v3();
  let r = Uuid::new_v4().to_hyphenated_ref().to_string();
  // timeEnd("get_uuid");
  return r;
}

#[wasm_bindgen]
pub fn greet(name: i32) {
  log(&format!("Hello, {}!", name));
}

pub fn bootstrap() {
  let app: i32 = 1;
  println!("Hello, world!  {0} {1}", app, repeat("a", 10));
  return;
}

#[wasm_bindgen(typescript_custom_section)]
struct Coords {
  pub latitude: u32,
  pub longitude: u32,
}

// #[wasm_bindgen(typescript_custom_section)]
#[wasm_bindgen(typescript_custom_section)]
pub struct Response {
  pub data: i32,
}

///
/// @param key - 关键字符串
/// @param n - 次数
/// @returns 返回一个重复n次字符的字符串
/// # Example
/// @example
/// ```ts
/// const a: string = repeat("a", 2) => "aa"
/// ```
#[wasm_bindgen]
pub fn repeat(key: &str, n: usize) -> String {
  let mut counter = String::new();
  for _i in 0..n {
    counter.push_str(key);
  }
  return counter;
}

#[no_mangle]
extern "C" fn repeatStr(key: &str, n: usize) -> String {
  let mut counter = String::new();
  for _i in 0..n {
    counter.push_str(key);
  }
  return counter;
}

/**
 *
 */
#[wasm_bindgen]
pub fn repeat_native(key: &str, times: usize) -> String {
  return String::from(key).repeat(times);
}

/**
 *
 */
#[wasm_bindgen]
pub fn repeat_native2() -> Response {
  return Response { data: 123 };
}
