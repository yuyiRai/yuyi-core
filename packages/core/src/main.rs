fn main() {
  main::bootstrap();
}

pub mod main {
  use core::repeat;
  pub fn bootstrap() -> String {
    let app: String = repeat("a", 10);
    println!("Hello, world!  {0}", app);
    return app;
  }
}
