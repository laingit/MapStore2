const PropTypes = require('prop-types');
const React = require('react');
const {bindActionCreators} = require('redux');
const {connect} = require('react-redux');
const Dialog = require('../components/misc/Dialog');
const {toggleShow} = require('../actions/ARP_legendaActions');

import {getFlattenGerarchia} from '../utils/Arp_legendaUtils';

const {
    getLegendaEpics,
    trovaCodiciLegendaEpics
} = require('../epics/ARP_legendaEpics');


import {Row, Col, Tab, Tabs, Glyphicon} from 'react-bootstrap';

function stile(colore) {
    return {
        padding: '1px',
        margin: '1px',
        marginLeft: '25px',
        border: 'solid black 1px',
        width: '40px',
        height: '18px',
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
                            <Row key={item.id}>
                                <Col md={1}><Casella colore={item.rgb} sigla={item.id}/></Col>
                                <Col md={11} style={stileDesc}> {item.desc}</Col>
                            </Row>
                    ))}
            </div>
        );
    }
}


class LitoDueGearchia extends React.Component {
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
                    .map(item => {
                        if (item.tag === 'liv0') {
                            return (<p style={{margin: 0,
                                                padding: 0,
                                                paddingLeft: 5}}>
                                        <b>{item.value.id} - {item.value.desc}</b>
                                    </p>);
                        }
                        if (item.tag === 'liv1') {
                            return (<p style={{margin: 0,
                                                padding: 0,
                                                paddingLeft: 15}}>
                                        <i>{item.value.id} - {item.value.desc}</i>
                                    </p>);
                        }
                        if (item.tag === 'liv2') {
                            return (
                                <Row key={item.id}>
                                    <Col md={1}><Casella colore={item.value.rgb} sigla={item.value.id}/></Col>
                                    <Col md={11} style={stileDesc}> {item.value.desc}</Col>
                                </Row>
                            );
                        }
                    })}
            </div>
        );
    }
}


function filtra(presentiZoomAttuale) {
    const esaminaLito = ({id}) => {
        var trovato = false;
        for (let index = 0; index < presentiZoomAttuale.length; index++) {
            let element = presentiZoomAttuale[index];
            trovato = element === id ? true : trovato;
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
        leg_partial: PropTypes.array,
        showLegend: PropTypes.bool.isRequired,
        toggleMostra: PropTypes.func
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
        const flattenGerarchia = getFlattenGerarchia(this.props.leg_partial);
        // const treeGerarchia = getTreeGerarchia(this.props.leg_partial);
        const soloPeresentiFn = filtra(this.props.leg_partial);
        const {showLegend, toggleMostra} = this.props;
        // Show Legenda o Button
        if (!showLegend) {
            return (
                <button
                    style={{zIndex: 2,
                        position: 'absolute',
                        left: '50px',
                        height: '30px',
                        fontSize: '16px',
                        backgroundColor: '#fff'}}
                    onClick={toggleMostra}
                >
                    Legenda Litologica
                </button>
            );
        }
        return (
            <Dialog style={{width: '1000px'}}>
                <div role="header">
                    Legenda Carta Litologica - livello 2
                    <button onClick={toggleMostra} className="settings-panel-close close">
                        <Glyphicon glyph="1-close"/>
                    </button>
                </div>
                <div role="body" style={{width: '1000px'}}>
                    <Tabs
                        id="controlled-tab-example">
                        <Tab eventKey={1} title="Vista Attule">
                            <LitoDue items={soloPeresentiFn(this.props.leg_full)}/>
                            <i>Nota: il calcolo delle formazioni presenti è ancora in fase di test</i>
                        </Tab>
                        <Tab eventKey={2} title="Completa"><LitoDue items={this.props.leg_full}/></Tab>
                        <Tab eventKey={3} title="Gerarchia">
                            <LitoDueGearchia items={flattenGerarchia}/>
                        </Tab>
                    </Tabs>
                </div>
                <div role="footer">
                    footer
                </div>
            </Dialog>
        );
    }
}


function mapStateToProps(state) {
    return {
        leg_full: state.ARP_legenda.ARP_legenda_full,
        leg_partial: state.ARP_legenda.ARP_legenda_partial,
        showLegend: state.ARP_legenda.show
     };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleMostra: toggleShow
    }, dispatch);
}

const ARPLegendaToolRedux = connect(mapStateToProps, mapDispatchToProps)(ARPLegendaTool);

module.exports = {
    ARP_legendaPlugin: ARPLegendaToolRedux,
    reducers: {ARP_legenda: require('../reducers/ARP_legendaReducer')},
    epics: {
        getLegendaEpics,
        trovaCodiciLegendaEpics
    }
};
