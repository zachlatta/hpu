/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var React = require('react');
var PageActions = require('../../actions/PageActions');
var JobInterface = require('../../components/JobInterface/JobInterface.js');
var App = require('../Application');

var HomePage = React.createClass({

  statics: {
    layout: App
  },

  componentWillMount() {
    PageActions.set({title: 'Human Processing Unit'});
  },

  render() {
    return (
      /* jshint ignore:start */
      <div className="container">
        <JobInterface />
      </div>
      /* jshint ignore:end */
    );
  }

});

module.exports = HomePage;
