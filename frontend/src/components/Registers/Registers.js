var React = require('react');

var Registers = React.createClass({
  render: function () {
    var registerForms = this.props.data.map(function (register) {
      return (
        <form className="form-inline" key={register.name}>
          <div className="form-group">
            <label for={register.name}>{register.name}</label>
            <input type="text" className="form-control" placeholder={register.value}/>
          </div>
        </form>
      );
    });

    return (
      <div>
        {registerForms}
      </div>
    );
  }
});

module.exports = Registers;
