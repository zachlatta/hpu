extern crate hyper;

fn main() {
  let mut client = Client::new();

  let res = client.get("http://www.google.com")
    .header(Connection(vec![Close]))
    .send().unwrap();

  let body = res.read_to_string().unwrap();

  println!("Response: {}", body);
}
