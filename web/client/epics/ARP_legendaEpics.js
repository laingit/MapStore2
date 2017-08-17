const {CHANGE_MAP_VIEW} = require('../actions/map');
const {MAP_INFO_LOADED} = require('../actions/config');

const {
    getArpLegendaFullDescription,
    getArpLegendaPartial
} = require('../actions/ARP_legendaActions');


/**
 * keep the default mapType in sync when change the URL of the map for viewer
 * @memberof epics.ArpType
 * @param  {external:Observable} action$ the stream of actions, acts on `LOCATION_CHANGE`
 * @param  {object} store   the store middleware API from redux `createMiddleware`
 * @return {external:Observable}  the stream of the actions to emit. (`changeMapType`)
 */
const trovaCodiciLegenda = (action$, store) =>
    action$.ofType(CHANGE_MAP_VIEW)
        .map(action => {
            return getArpLegendaPartial(store.getState(), action);
        });


/**
 * keep the default mapType in sync when change the URL of the map for viewer
 * @memberof epics.ArpType
 * @param  {external:Observable} action$ the stream of actions, acts on `LOCATION_CHANGE`
 * @param  {object} store   the store middleware API from redux `createMiddleware`
 * @return {external:Observable}  the stream of the actions to emit. (`changeMapType`)
 */
const getLegenda = (action$, store) =>
    action$.ofType(MAP_INFO_LOADED)
        .map(action => {
            return getArpLegendaFullDescription(store.getState(), action);
        });


/**
 * Epics for maptype switch functionalities
 * @name epics.ArpType
 * @type {Object}
 */
module.exports = {
    getLegenda,
    trovaCodiciLegenda
};
