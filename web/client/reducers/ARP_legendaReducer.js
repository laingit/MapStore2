const assign = require('object-assign');

var {ARP_LEGENDA_DOMAIN,
     ARP_LEGENDA_FULL_DESCRIPTION,
     ARP_LEGENDA_PARTIAL} = require('../actions/ARP_legendaActions');


/**
 *
 * @memberof reducers
 * @param  {Object} [state={ARP_legenda: ""}] the initial state
 * @param  {} action
 * @return {Object} the new state
 * @example
 * {
 *  mapType: "leaflet"
 * }
 */
function aprLegendaReducer(state = {
    ARP_legenda_domain: [],
    ARP_legenda_full: [],
    ARP_legenda_partial: []
}, action) {
    switch (action.type) {
    case ARP_LEGENDA_DOMAIN: {
        return assign({}, state, {
            ARP_legenda_domain: action.ARP_legenda_domain
        });
    }
    case ARP_LEGENDA_FULL_DESCRIPTION: {
        return assign({}, state, {
            ARP_legenda_full: action.ARP_legenda_full
        });
    }
    case ARP_LEGENDA_PARTIAL: {
        return assign({}, state, {
            ARP_legenda_partial: action.ARP_legenda_partial
        });
    }
    default:
        return state;
    }
}

module.exports = aprLegendaReducer;
