const PropTypes = require('prop-types');
const React = require('react');
const {connect} = require('react-redux');


const {getLegendaEpics,
    trovaCodiciLegendaEpics} = require('../epics/ARP_legendaEpics');

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
            zIndex: 50,
            position: 'absolute',
            top: '50px',
            left: '50px',
            "background-color": 'white'
        }
    };

    render() {
        return (
        <div id={this.props.id} style={this.props.style}>
           {this.props.leg_partial.map((item) => <div key={item}>{item}</div>)}
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
