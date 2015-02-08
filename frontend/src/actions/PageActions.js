/*
 * React.js Starter Kit
 * Copyright (c) 2014 Konstantin Tarkus (@koistya), KriaSoft LLC.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

var Dispatcher = require('../core/Dispatcher');
var ActionTypes = require('../constants/ActionTypes');
var pageDefaults = require('../constants/Settings').defaults.page;
var assign = require('react/lib/Object.assign');

module.exports = {

  /**
   * Set metadata for the current page (title, description, keywords etc.).
   * @param {object} The page object.
   */
  set(page) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.SET_CURRENT_PAGE,
      page: assign({}, pageDefaults, page)
    });
  }

};
