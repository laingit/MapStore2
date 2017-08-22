const PropTypes = require('prop-types');
const React = require('react');
const {connect} = require('react-redux');
const Dialog = require('../components/misc/Dialog');

const {
    getLegendaEpics,
    trovaCodiciLegendaEpics
} = require('../epics/ARP_legendaEpics');


import {Grid, Row, Col} from 'react-bootstrap';

function stile(colore) {
    return {
        padding: '2px',
        margin: '2px',
        border: 'solid black 1px',
        width: '50px',
        height: '20px',
        fontSize: '11px',
        background: colore
    };
}

const stileDesc = {
    fontSize: '12px'
};

const Casella = (props) => (
  <div style={stile(props.colore)}><b>{props.sigla}</b></div>
);

class LitoDue extends React.Component {
    static propTypes = {
        items: PropTypes.array
    };

    static defaultProps = {
        items: []
    };

    render() {
        const {items} = this.props;
        return (
            <div>
                {items
                    .map(item => (
                            <Row key={item.liv_2}>
                                <Col md={1}><Casella colore={item.rgb} sigla={item.liv_2}/></Col>
                                <Col md={11} style={stileDesc}> {item.liv_2_desc}</Col>
                            </Row>
                    ))}
            </div>
        );
    }
}


function filtra(presentiZoomAttuale) {
    const esaminaLito = ({liv_2}) => {
        var trovato = false;
        for (let index = 0; index < presentiZoomAttuale.length; index++) {
            let element = presentiZoomAttuale[index];
            trovato = element === liv_2 ? true : trovato;
        }
        return trovato;
    };
    return function filtraFormazioni(tutteLeFormazioni) {
        return tutteLeFormazioni.filter(esaminaLito);
    };
}

class ARPLegendaTool extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        style: PropTypes.object,
        leg_full: PropTypes.array,
        leg_partial: PropTypes.array
    };

    static defaultProps = {
        id: "andrea-legenda",
        style: {
            zIndex: 10,
            position: 'absolute',
            top: '50px',
            left: '50px',
            backgroundColor: '#fff',
            opacity: 1.0
        }
    };

    render() {
        const soloPeresentiFn = filtra(this.props.leg_partial);
        return (
            <Dialog style={{width: '1000px'}}>
                <div role="header">Legenda Carta Litologica - livello 2</div>
                <div role="body" style={{width: '1000px'}}><LitoDue items={soloPeresentiFn(this.props.leg_full)}/></div>
                <div role="footer">footer</div>
            </Dialog>
        );
    }
}


function mapStateToProps(state) {
    return {
        leg_full: state.ARP_legenda.ARP_legenda_full,
        leg_partial: state.ARP_legenda.ARP_legenda_partial
     };
}

const ARPLegendaToolRedux = connect(mapStateToProps)(ARPLegendaTool);

module.exports = {
    ARP_legendaPlugin: ARPLegendaToolRedux,
    reducers: {ARP_legenda: require('../reducers/ARP_legendaReducer')},
    epics: {
        getLegendaEpics,
        trovaCodiciLegendaEpics
    }
};
