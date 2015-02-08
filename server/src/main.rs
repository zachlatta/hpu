extern crate hyper;
extern crate iron;
extern crate rustless;

use hyper::status::StatusCode;
use iron::Iron;
use rustless::{
    Application, Api, Nesting, Versioning
};

fn main() {
    let api = Api::build(|api| {
        api.prefix("api");
    });
}
