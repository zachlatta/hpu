var React = require('react');
var request = require('superagent');

var Instructions = require('../Instructions/Instructions.js');
var Registers = require('../Registers/Registers.js');
var TableBox = require('../TableBox/TableBox.js');

var JobInterface = React.createClass({
  onLabelSubmit: function (label) {
    var labels = this.state.labels;
    console.log("submitting label", label);
    this.setState({labels: labels.concat([label])});
  },
  onStorageSubmit: function (data) {
    var storage = this.state.storage;
    console.log("submitting storage", data);
    this.setState({storage: storage.concat([data])});
  },
  loadNextInstructionsFromServer: function () {
    var that = this;
    request.get('http://mew.hackedu.us:4000/api/v1/instructions/get_next', function (res) {
      var next = JSON.parse(res.text)[0];
      switch (next.itype) {
        case 'DB':
          next.text = 'Create a new item in storage called `' + next.label + '` with the contents `' + next.argument + '`.';
          break;
        case 'MOV':
          next.text = 'Put the value of `' + next.argument + '` into the `' + next.register + '` register.';
          break;
      }

      that.setState({instructions: next});
    });
  },
  loadLabelsFromServer: function () {
    var that = this;
    request.get('http://mew.hackedu.us:4000/api/v1/instructions/labels', function (res) {
      var labels = JSON.parse(res.text);
      that.setState({labels: labels});
    });
  },
  loadStorageFromServer: function () {
    var that = this;
    request.get('http://mew.hackedu.us:4000/api/v1/instructions/storage', function (res) {
      var storage = JSON.parse(res.text);
      that.setState({storage: storage});
    });
  },
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
        value: "foo"
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
        itype: "MOV",
        text: "Put the value of `len` into `EAX`."
      }
    }
  },
  componentDidMount: function() {
    this.loadNextInstructionsFromServer();
    this.loadLabelsFromServer();
    this.loadStorageFromServer();
  },
  render: function () {
    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <Instructions data={this.state.instructions} />
          </div>
          <div className="col-md-4">
            <TableBox title="Labels" data={this.state.labels} onSubmit={this.onLabelSubmit} />
            <TableBox title="Storage" data={this.state.storage} onSubmit={this.onStorageSubmit} />
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
