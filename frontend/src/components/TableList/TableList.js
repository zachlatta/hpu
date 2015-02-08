var React = require('react');
var TableRow = require('../TableRow/TableRow.js');

var TableList = React.createClass({
  render: function () {
    // TODO: This is really bad, actually check to get all of the keys in the
    // future (iterate over every item, see if all of its attributes are in
    // keys, if not, add them)
    var keys = Object.keys(this.props.data[0]);
    var headerColumns = keys.map(function (key) {
      if (key != "id") {
        return (
          <th key={key}>{key}</th>
        );
      }
    });
    var rows = this.props.data.map(function (row) {
      return (
        <TableRow key={row.id} data={row} />
      );
    });

    return (
      <table className="table table-bordered table-striped">
        <colgroup>
          <col className="col-xs-1" />
          <col className="col-xs-7" />
        </colgroup>
        <thead>
          <tr>
            {headerColumns}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

module.exports = TableList;
