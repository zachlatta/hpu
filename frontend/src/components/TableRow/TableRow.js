var React = require('react');

var TableRow = React.createClass({
  render: function () {
    var row = this.props.data;
    var columns = Object.keys(row).map(function (key) {
      if (key != "id") {
        return (
          <td key={key}>{row[key]}</td>
        );
      }
    });

    return (
      <tr>
        {columns}
      </tr>
    );
  }
});

module.exports = TableRow;
