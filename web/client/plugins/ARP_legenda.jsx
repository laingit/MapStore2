const PropTypes = require('prop-types');
/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const assign = require('object-assign');
const {UserDetails, PasswordReset, UserMenu, Login, LoginNav } = require('./ARP_legenda/index');
const {getLegendaEpics,
    trovaCodiciLegendaEpics} = require('../epics/ARP_legendaEpics');

require('./login/login.css');

/**
  * Login Plugin. Allow to login/logout or show user info and reset password tools
  * @class Login
  * @memberof plugins
  * @static
  *
  * @prop {string} cfg.id identifier of the Plugin, by default `"mapstore-login-menu"`
  * @prop {object} cfg.menuStyle inline style for the menu, by defualt:
  * ```
  * menuStyle: {
  *      zIndex: 30
  * }
  *```
  */
class ARPLegendaTool extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        menuStyle: PropTypes.object
    };

    static defaultProps = {
        id: "mapstore-login-menu",
        menuStyle: {
            zIndex: 30
        }
    };

    render() {
        return (<div id={this.props.id}>
            <div style={this.props.menuStyle}>
                <UserMenu />
            </div>
            <UserDetails />
        </div>);
    }
}

module.exports = {
    ARP_legendaPlugin: assign(ARPLegendaTool, {
        OmniBar: {
            name: "arpLegenda",
            position: 5,
            tool: LoginNav,
            tools: [UserDetails],
            priority: 1
        }
    }),
    reducers: {ARP_legenda: require('../reducers/ARP_legendaReducer')},
    epics: {
        getLegendaEpics,
        trovaCodiciLegendaEpics
    }
};
