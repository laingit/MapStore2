const {CHANGE_MAP_VIEW} = require('../actions/map');
const {getArpLegenda} = require('../actions/ARP_legenda');


/**
 * keep the default mapType in sync when change the URL of the map for viewer
 * @memberof epics.ArpType
 * @param  {external:Observable} action$ the stream of actions, acts on `LOCATION_CHANGE`
 * @param  {object} store   the store middleware API from redux `createMiddleware`
 * @return {external:Observable}  the stream of the actions to emit. (`changeMapType`)
 */
const trovaLegenda = (action$, store) =>
    action$.ofType(CHANGE_MAP_VIEW)
        .map(action => {
            return getArpLegenda(store.getState(), action);
        });

/**
 * Epics for maptype switch functionalities
 * @name epics.ArpType
 * @type {Object}
 */
module.exports = {
    trovaLegenda
};
