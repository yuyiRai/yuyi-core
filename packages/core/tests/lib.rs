extern crate wasm_bindgen_test;
#[cfg(test)]
mod tests {
  use core::*;
  use wasm_bindgen_test::*;

  /**
   *
   */
  #[wasm_bindgen_test]
  fn pass() {
    assert_eq!(1, 1);
  }

  #[test]
  fn sha2() {
    // println!("tests {}", get_sha2("abbbbbbbb", "abc").to_string());
  }
  
  #[test]
  fn it_works() {
    let r: std::string::String = repeat("a", 10);
    println!("tests {}", r);
    assert_eq!(r, repeat_native("a", 10));
    assert_eq!(1, 1);
  }
}
