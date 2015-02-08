var React = require('react');
var TableList = require('../TableList/TableList.js');

var TableBox = React.createClass({
  render: function () {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.title}</div>
        <TableList data={this.props.data} />
      </div>
    );
  }
});

module.exports = TableBox;
