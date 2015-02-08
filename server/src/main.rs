#[macro_use]
extern crate rustless;

extern crate iron;

use rustless::{Nesting};

fn main() {
    let app = rustless::Application::new(rustless::Api::build(|api| {
        api.prefix("api");
        api.version("v1", rustless::Versioning::Path);

        api.namespace("jobs", |jobs_ns| {
            jobs_ns.get("server_status", |endpoint| {
                endpoint.handle(|client, _params| {
                    client.text("Everything is OK\n".to_string())  
                })
            });
        })
    }));

    iron::Iron::new(app).listen("localhost:4000").unwrap();
    println!("On 4000");

}
