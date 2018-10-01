// var axios = require('../libs/ajax');
var axios = require('axios');
const Proj4js = require('proj4');

const ARP_LEGENDA_TOGGLE_SHOW = 'ARP_LEGENDA_TOGGLE_SHOW';
const ARP_LEGENDA_PARTIAL = 'ARP_LEGENDA_PARTIAL';
const ARP_LEGENDA_FULL_DESCRIPTION = 'ARP_LEGENDA_FULL_DESCRIPTION';

const SERVER_API = "http://192.168.18.121:4000";

function bboxToGauss(bbox) {
    const {maxx, maxy, minx, miny} = bbox.bounds;
   // Proj4js.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs");
   // https://epsg.io/3003
   // Proj4js.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68");
   // https://epsg.io/3003-1662
    Proj4js.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs +towgs84=-168.6,-34,38.6,-0.374,-0.679,-1.379,-9.48");
    const epsg3003 = new Proj4js.Proj("EPSG:3003");

    const epsgMap = new Proj4js.Proj(bbox.crs);

    let ptMin = Proj4js.toPoint([minx, miny]);
    Proj4js.transform(epsgMap, epsg3003, ptMin);

    let ptMax = Proj4js.toPoint([maxx, maxy]);
    Proj4js.transform(epsgMap, epsg3003, ptMax);

    return {xMin: ptMin.x, yMin: ptMin.y, xMax: ptMax.x, yMax: ptMax.y};
}


/**
 *
 * @memberof actions.arpLegenda
 * @param  {string} arpLegenda
 * @return {action}
 */
function setArpLegendaFullDescriptionAC(data) {
    return {
        type: ARP_LEGENDA_FULL_DESCRIPTION,
        ARP_legenda_full: data
    };
}


function setArpLegendaPartialAC(data) {
    return {
        type: ARP_LEGENDA_PARTIAL,
        ARP_legenda_partial: data
    };
}

function toggleShow() {
    return {
        type: ARP_LEGENDA_TOGGLE_SHOW
    };
}


function getArpLegendaFullDescription(state, action) {
    return (dispatch) => {
        const url = `${SERVER_API}/api/liv_due`;
        console.log("getArpLegendaFullDescription: state action");
        console.log(state);
        console.log(action);

        return axios.get(url).then(response => {
            if (typeof response.data === 'object') {
                console.log("getArpLegendaFullDescription:");
                console.log(response);
                dispatch(setArpLegendaFullDescriptionAC(response.data.data));
            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(setArpLegendaFullDescriptionAC('Parse error: ' + e.message));
                }
            }
        }).catch((e) => {
            dispatch(setArpLegendaFullDescriptionAC(e));
        });
    };
}


function getArpLegendaPartial(state, action) {
    return (dispatch) => {
        // const bboxGauss = bboxToGauss(action.map.present.bbox);
        const bboxGauss = bboxToGauss(action.bbox);

        const {xMin, yMin, xMax, yMax} = bboxGauss;
        const rxMin = Number((xMin).toFixed(0));
        const ryMin = Number((yMin).toFixed(0));
        const rxMax = Number((xMax).toFixed(0));
        const ryMax = Number((yMax).toFixed(0));

        const url = `${SERVER_API}/api/liv_due_mappa?xMin=${rxMin}&yMin=${ryMin}&xMax=${rxMax}&yMax=${ryMax}`;

        console.log("getArpLegendaPartial: state action");
        console.log(state);
        console.log(action);
        return axios.get(url).then(response => {
            if (typeof response.data === 'object') {
                dispatch(setArpLegendaPartialAC(response.data.data));
            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(setArpLegendaPartialAC('Parse error: ' + e.message));
                }
            }
        }).catch((e) => {
            dispatch(setArpLegendaPartialAC(e));
        });
    };
}


/**
 *
 * @name actions.maptype
 */
module.exports = {
    ARP_LEGENDA_TOGGLE_SHOW, toggleShow,
    ARP_LEGENDA_FULL_DESCRIPTION, getArpLegendaFullDescription,
    ARP_LEGENDA_PARTIAL, getArpLegendaPartial
};
