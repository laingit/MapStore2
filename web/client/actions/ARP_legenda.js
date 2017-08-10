var axios = require('../libs/ajax');
const ARP_LEGENDA = 'ARP_LEGENDA';


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

function getArpLegenda(bbox, azione) {
    return (dispatch) => {
        console.log("getArpLegenda:");
        console.log(bbox);
         console.log("azione:");
        console.log(azione);
        const url = "/api/posts?xMin=1500001&yMin=4290001&xMax=1600001&yMax=4600001";
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
module.exports = {ARP_LEGENDA, getArpLegenda, setArpLegendaConst};
