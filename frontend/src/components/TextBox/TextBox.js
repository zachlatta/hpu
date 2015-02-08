/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

require('./TextBox.less');

var React = require('react');

var TextBox = React.createClass({

  propTypes: {
    maxLines: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      maxLines: 1
    };
  },

  render() {
    return (
      /* jshint ignore:start */
      <div className="TextBox">
        {this.props.maxLines > 1 ?
          <textarea {...this.props} className="TextBox-input" ref="input" key="input" rows={this.props.maxLines} /> :
          <input {...this.props} className="TextBox-input" ref="input" key="input" />}
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = TextBox;

