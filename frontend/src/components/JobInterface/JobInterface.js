var React = require('react');
var Instructions = require('../Instructions/Instructions.js');
var Registers = require('../Registers/Registers.js');
var TableBox = require('../TableBox/TableBox.js');

var JobInterface = React.createClass({
  getInitialState: function () {
    return {
      labels: [{
        id: "1",
        name: "msg",
        value: "0x000"
      }, {
        id: "2",
        name: "len",
        value: 10
      }],

      storage: [{
        id: "1",
        address: "0x000",
        value: "Hello World"
      }],

      registers: [{
        name: "EAX",
        value: null
      }, {
        name: "ECX",
        value: null
      }, {
        name: "EDX",
        value: null
      }, {
        name: "EBX",
        value: null
      }],

      instructions: {
        instruction: "MOV",
        text: "Put the value of `len` into `EAX`."
      }
    }
  },
  render: function () {
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <Instructions data={this.state.instructions} />
          </div>
          <div className="col-md-4">
            <TableBox title="Labels" data={this.state.labels} />
            <TableBox title="Storage" data={this.state.storage} />
          </div>
        </div>
        <div className="row">
          <Registers data={this.state.registers} />
        </div>
      </div>
    );
  }
});

module.exports = JobInterface;
