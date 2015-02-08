var React = require('react');
var TableList = require('../TableList/TableList.js');

var TableBox = React.createClass({
  getInitialState: function () {
    return {data: [{id: "1000", desc: "test"}, {id: "1001", desc: "test"}]};
  },
  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.title}</div>
        <TableList data={this.state.data} />
      </div>
    );
  }
});

module.exports = TableBox;
