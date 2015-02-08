#[macro_use]
extern crate iron;
extern crate postgres;
extern crate r2d2;
extern crate r2d2_postgres;
extern crate "rustc-serialize" as rustc_serialize;
extern crate rustless;
extern crate typemap;

use std::env;
use rustc_serialize::json;

use rustless::prelude::*;

pub type PostgresPool = r2d2::Pool<r2d2_postgres::PostgresConnectionManager>;
pub type PostgresPooledConnection<'a> = r2d2::PooledConnection<'a, r2d2_postgres::PostgresConnectionManager>;

pub struct AppDb;
impl ::typemap::Key for AppDb {
    type Value = PostgresPool;
}

pub trait DatabaseExt: rustless::Extensible {
    fn db(&self) -> PostgresPooledConnection;
}
impl DatabaseExt for rustless::Application {
    fn db(&self) -> PostgresPooledConnection {
        self.ext().get::<AppDb>().unwrap().get().unwrap()
    }
}

pub struct Program {
    id: i32
}

pub enum InstructionType {
    DB,
    EQU,
    MOV,
}

pub struct Instruction {
    id: i32,
    
}

pub fn setup_db(connection_str: &str, pool_size: u32) -> PostgresPool {
    let manager = r2d2_postgres::PostgresConnectionManager::new(connection_str, postgres::SslMode::None);
    let config = r2d2::Config {
        pool_size: pool_size,
        test_on_check_out: true,
        ..::std::default::Default::default()
    };

    let handler = Box::new(r2d2::NoopErrorHandler);
    r2d2::Pool::new(config, manager, handler).unwrap()
}

fn setup_tables(cn: &postgres::GenericConnection) {
    cn.batch_execute(r#"
        DROP TABLE IF EXISTS programs CASCADE;
        DROP TABLE IF EXISTS instructions CASCADE;
        DROP TABLE IF EXISTS labels CASCADE;

        DROP TYPE IF EXISTS instruction_type CASCADE;
        DROP TYPE IF EXISTS job_status CASCADE;

        CREATE TYPE instruction_type AS ENUM('MOV', 'DB', 'EQU', 'INT');
        CREATE TYPE job_status AS ENUM('inactive', 'in_progress', 'completed', 'failed');

        CREATE TABLE programs (
            id serial PRIMARY KEY,
            eax text,
            ebx text,
            ecx text,
            edx text
        );

        CREATE TABLE instructions (
            id serial PRIMARY KEY,
            program integer references programs(id),
            label text,
            type instruction_type,
            register text,
            argument text,
            status job_status DEFAULT 'inactive'
        );

        CREATE TABLE labels (
            id serial PRIMARY KEY,
            program integer references programs(id),
            name text,
            value text
        );

        INSERT INTO programs DEFAULT VALUES;

        INSERT INTO instructions (label, program, type, register, argument) VALUES
            ('msg', 1, 'DB', null, 'Hello World'),
            ('len', 1, 'EQU', null, '$-msg'),

            (null, 1, 'MOV', 'edx', 'len'),
            (null, 1, 'MOV', 'ecx', 'msg'),
            (null, 1, 'MOV', 'ebx', '1'),
            (null, 1, 'MOV', 'eax', '4'),
            (null, 1, 'INT', null, '0x80'),

            (null, 1, 'MOV', 'ebx', '0'),
            (null, 1, 'MOV', 'eax', '1'),
            (null, 1, 'INT', null, '0x80');
    "#).unwrap();
}

fn main() {
    let mut app = rustless::Application::new(rustless::Api::build(|api| {
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

    let connection_str = env::var_string("POSTGRES_CONNECTION").ok()
      .expect("Provide POSTGRES_CONNECTION environment variable");
    let pool = setup_db(&connection_str[], 5);

    {
        let connection = pool.get().unwrap();
        setup_tables(&*connection);
    }

    app.ext.insert::<AppDb>(pool);

    let chain = iron::Chain::new(app);
    iron::Iron::new(chain).listen("localhost:4000").unwrap();
    println!("On 4000");
}
