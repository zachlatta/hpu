var React = require('react');
var TableList = require('../TableList/TableList.js');

var TableBox = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();

    var keys = Object.keys(this.props.data[0]).filter(function (key) {
      return key != "id";
    });

    var newRow = {}, missingValue = false, that = this;
    keys.forEach(function (key) {
      newRow[key] = that.refs[key].getDOMNode().value.trim();
      if (!newRow[key]) {
        missingValue = true;
      }
    });

    if (missingValue) {
      return;
    }

    this.props.onSubmit(newRow);
    keys.forEach(function (key) {
      console.log(that.refs);
      that.refs[key].getDOMNode().value = '';
    });
    this.setState({showForm: false});
  },
  showForm: function (e) {
    e.preventDefault();
    this.setState({showForm: true});
  },
  getInitialState: function () {
    return {
      showForm: false
    };
  },
  render: function () {
    var formFields = Object.keys(this.props.data[0]).map(function (field) {
      if (field != "id") {
        return (
          <div className="form-group">
            <label for={field}>{field}</label>
            <input type="text" className="form-control" placeholder={field}
              ref={field} />
          </div>
        )
      }
    });
    var form = (
      <form onSubmit={this.handleSubmit}>
        {formFields}
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    );

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.props.title}
          <a href="#" className="pull-right" onClick={this.showForm}>Add Item</a>
        </div>

        {this.state.showForm ? <div className="well">{form}</div> : null}
        <TableList data={this.props.data} />
      </div>
    );
  }
});

module.exports = TableBox;
