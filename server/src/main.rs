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

#[derive(Debug, RustcEncodable)]
pub struct Program {
    id: i32,
}

#[derive(Debug, RustcEncodable)]
pub struct Instruction {
    id: i32,
    label: String,
    itype: String,
    register: String,
    argument: String,
}

#[derive(Debug, RustcEncodable)]
pub struct Label {
    id: i32,
    name: String,
    value: String,
}

#[derive(Debug, RustcEncodable)]
pub struct Storage {
    address: i32,
    value: String,
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
        DROP TABLE IF EXISTS storage CASCADE;

        DROP TYPE IF EXISTS instruction_type CASCADE;
        DROP TYPE IF EXISTS job_status CASCADE;

        CREATE TABLE programs (
            id serial PRIMARY KEY,
            eax text NOT NULL DEFAULT '',
            ebx text NOT NULL DEFAULT '',
            ecx text NOT NULL DEFAULT '',
            edx text NOT NULL DEFAULT ''
        );

        CREATE TABLE instructions (
            id serial PRIMARY KEY,
            program integer references programs(id) NOT NULL,
            label text NOT NULL DEFAULT '',
            type text NOT NULL DEFAULT '',
            register text NOT NULL DEFAULT '',
            argument text NOT NULL DEFAULT '',
            status text DEFAULT 'inactive'
        );

        CREATE TABLE labels (
            id serial PRIMARY KEY,
            program integer references programs(id) NOT NULL,
            name text NOT NULL DEFAULT '',
            value text NOT NULL DEFAULT ''
        );

        CREATE TABLE storage (
            address serial PRIMARY KEY,
            program integer references programs(id) NOT NULL,
            value text NOT NULL DEFAULT ''
        );

        INSERT INTO programs DEFAULT VALUES;

        INSERT INTO instructions (label, program, type, register, argument) VALUES
            ('msg', 1, 'DB', '', 'Hello World'),
            ('len', 1, 'EQU', '', '$-msg'),

            ('', 1, 'MOV', 'edx', 'len'), ('', 1, 'MOV', 'ecx', 'msg'),
            ('', 1, 'MOV', 'ebx', '1'),
            ('', 1, 'MOV', 'eax', '4'),
            ('', 1, 'INT', '', '0x80'),

            ('', 1, 'MOV', 'ebx', '0'),
            ('', 1, 'MOV', 'eax', '1'),
            ('', 1, 'INT', '', '0x80');

        INSERT INTO labels (program, name, value) VALUES
            (1, 'sample', 'sample');

        INSERT INTO storage (program, value) VALUES
            (1, 'sample');
    "#).unwrap();
}

fn main() {
    let mut app = rustless::Application::new(rustless::Api::build(|api| {
        api.prefix("api");
        api.version("v1", rustless::Versioning::Path);

        api.namespace("instructions", |instr_ns| {
            instr_ns.get("get_next", |endpoint| {
                endpoint.handle(|mut client, _params| {
                    let cn = client.app.db();

                    let statement = cn.prepare("SELECT id, label, type, register, argument FROM instructions WHERE status='inactive' LIMIT 1;").ok().expect("Connection is broken");
                    let instruction_list: Vec<Instruction> = statement.query(&[]).unwrap().map(|row| {
                        Instruction {
                            id: row.get(0),
                            label: row.get(1),
                            itype: row.get(2),
                            register: row.get(3),
                            argument: row.get(4)
                        }
                    }).collect();

                    client.set_json_content_type();
                    client.text(json::encode(&instruction_list).ok().unwrap())  
                })
            });

            instr_ns.get("labels", |endpoint| {
                endpoint.handle(|mut client, _params| {
                    let cn = client.app.db();

                    let statement = cn.prepare("SELECT id, name, value FROM labels;").ok().expect("Connection is broken");
                    let label_list: Vec<Label> = statement.query(&[]).unwrap().map(|row| {
                        Label {
                            id: row.get(0),
                            name: row.get(1),
                            value: row.get(2)
                        }
                    }).collect();

                    client.set_json_content_type();
                    client.text(json::encode(&label_list).ok().unwrap())  
                })
            });

            instr_ns.get("storage", |endpoint| {
                endpoint.handle(|mut client, _params| {
                    let cn = client.app.db();

                    let statement = cn.prepare("SELECT address, value FROM storage;").ok().expect("Connection is broken");
                    let storage_list: Vec<Storage> = statement.query(&[]).unwrap().map(|row| {
                        Storage {
                            address: row.get(0),
                            value: row.get(1),
                        }
                    }).collect();

                    client.set_json_content_type();
                    client.text(json::encode(&storage_list).ok().unwrap())  
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
    iron::Iron::new(chain).listen("0.0.0.0:4000").unwrap();
    println!("On 4000");
}
