var {ARP_LEGENDA} = require('../actions/ARP_legenda');

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
function aprLegenda(state = {ARP_legenda: "prova"}, action) {
    switch (action.type) {
    case ARP_LEGENDA:
        return action.ARP_legenda;
    default:
        return state;
    }
}

module.exports = aprLegenda;
