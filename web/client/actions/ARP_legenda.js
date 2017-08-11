var axios = require('../libs/ajax');
const ARP_LEGENDA = 'ARP_LEGENDA';
const Proj4js = require('proj4');


function bboxToGauss(bbox) {
    const {maxx, maxy, minx, miny} = bbox.bounds;
    Proj4js.defs("EPSG:3003", "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +units=m +no_defs");
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
function setArpLegenda(data) {
    return {
        type: ARP_LEGENDA,
        ARP_legenda: data
    };
}

function setArpLegendaConst() {
    return {
        type: ARP_LEGENDA,
        ARP_legenda: "costante"
    };
}

function getArpCodiciLegenda(azione) {
    return (dispatch) => {
        console.log(azione.map.present.bbox);
        const bboxGauss = bboxToGauss(azione.map.present.bbox);

        const {xMin, yMin, xMax, yMax} = bboxGauss;
        const rxMin = Number((xMin).toFixed(0));
        const ryMin = Number((yMin).toFixed(0));
        const rxMax = Number((xMax).toFixed(0));
        const ryMax = Number((yMax).toFixed(0));

        const url = `/api/liv_due_mappa?xMin=${rxMin}&yMin=${ryMin}&xMax=${rxMax}&yMax=${ryMax}`;

        console.log("getArpLegenda:");
        console.log(url);
        return axios.get(url).then(response => {
            if (typeof response.data === 'object') {
                dispatch(setArpLegenda(response.data));
            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(setArpLegenda('Parse error: ' + e.message));
                }
            }
        }).catch((e) => {
            dispatch(setArpLegenda(e));
        });
    };
}


function getArpLegenda(azione) {
    return (dispatch) => {
        console.log(azione.map.present.bbox);
        const bboxGauss = bboxToGauss(azione.map.present.bbox);

        const {xMin, yMin, xMax, yMax} = bboxGauss;
        const rxMin = Number((xMin).toFixed(0));
        const ryMin = Number((yMin).toFixed(0));
        const rxMax = Number((xMax).toFixed(0));
        const ryMax = Number((yMax).toFixed(0));

        const url = `/api/liv_due_mappa?xMin=${rxMin}&yMin=${ryMin}&xMax=${rxMax}&yMax=${ryMax}`;

        console.log("getArpLegenda:");
        console.log(url);
        return axios.get(url).then(response => {
            if (typeof response.data === 'object') {
                dispatch(setArpLegenda(response.data));
            } else {
                try {
                    JSON.parse(response.data);
                } catch (e) {
                    dispatch(setArpLegenda('Parse error: ' + e.message));
                }
            }
        }).catch((e) => {
            dispatch(setArpLegenda(e));
        });
    };
}
/**
 *
 * @name actions.maptype
 */
module.exports = {ARP_LEGENDA, getArpLegenda, setArpLegendaConst, getArpCodiciLegenda};
