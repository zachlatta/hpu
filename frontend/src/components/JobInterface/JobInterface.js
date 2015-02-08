var React = require('react');
var TableBox = require('../TableBox/TableBox.js');

var JobInterface = React.createClass({
  render: function () {
    return (
      <div className="row">
        <div className="col-md-8">
        </div>
        <div className="col-md-4">
          <TableBox title="Labels" />
          <TableBox title="Storage" />
        </div>
      </div>
    );
  }
});

module.exports = JobInterface;
