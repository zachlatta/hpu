var React = require('react');

var Instructions = React.createClass({
  render: function () {
    return (
      <div>
        <h2>Instructions</h2>
        <p><b>{this.props.data.itype}</b>: {this.props.data.text}</p>
      </div>
    )
  }
});

module.exports = Instructions;
