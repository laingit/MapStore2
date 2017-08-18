const PropTypes = require('prop-types');
const React = require('react');
const {connect} = require('react-redux');


const {getLegendaEpics,
    trovaCodiciLegendaEpics} = require('../epics/ARP_legendaEpics');


import {Grid, Row, Col} from 'react-bootstrap';

function stile(colore) {
    return {
        padding: '2px',
        margin: "2px",
        border: 'solid black 1px',
        width: '50px',
        height: '20px',
        fontSize: '12px',
        background: colore
    };
}


const Casella = (props) => (
  <div style={stile(props.colore)}><b>{props.sigla}</b></div>
);

class LitoDue extends React.Component {
    render() {
        return (
            <div>
                {this
                    .props
                    .items
                    .map(item => (
                        <Grid>
                            <Row key={item.liv_2}>
                                <Col md={1}><Casella colore={item.rgb} sigla={item.liv_2}/></Col>
                                <Col md={11}>{item.liv_2_desc}</Col>
                            </Row>
                        </Grid>
                    ))}
            </div>
        );
    }
}


function filtra(presentiZoomAttuale) {
    const esaminaLito = ({liv_2}) => {
        var trovato = false;
        for (var index = 0; index < presentiZoomAttuale.length; index++) {
            var element = presentiZoomAttuale[index];
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
            zIndex: 1050,
            position: 'absolute',
            top: '50px',
            left: '50px',
            "background-color": 'white'
        }
    };

    render() {
        const soloPeresentiFn = filtra(this.props.leg_partial);
        return (
            <div id={this.props.id} style={this.props.style}>
                <div>
                    <div>
                        <h2>presenti</h2>
                    </div>
                    <LitoDue items={soloPeresentiFn(this.props.leg_full)}/>
                </div>
                {/* <p>Legenda Litologica Formazioni presenti</p>
                {this
                    .props
                    .leg_partial
                    .map((item) => <div key={item}>{item}</div>)} */}
                {/* <div>
                    <div>
                        <h2>Legenda Litologica livello 2</h2>
                    </div>
                    <LitoDue items={this.props.leg_full}/>
                </div> */}
            </div>
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

