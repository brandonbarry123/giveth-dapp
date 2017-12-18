import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {utils} from 'web3';
import {Link} from 'react-router-dom';
import _ from 'underscore';
import moment from 'moment';
import {paramsForServer} from 'feathers-hooks-common';

import {feathersClient} from '../../lib/feathersClient';
import Loader from '../Loader';
import {isAuthenticated, takeActionAfterWalletUnlock, checkWalletBalance} from '../../lib/middleware';
import getNetwork from '../../lib/blockchain/getNetwork';
import {displayTransactionError, getTruncatedText} from '../../lib/helpers';
import User from '../../models/User';
import GivethWallet from '../../lib/blockchain/GivethWallet';

import Graph from 'react-json-graph';

class DonationsGraph extends Component {
  static getStatus(status) {
    switch (status) {
      case 'pending':
        return 'pending successful transaction';
      case 'to_approve':
        return 'pending for your approval to be committed.';
      case 'waiting':
        return 'waiting for further delegation';
      case 'committed':
        return 'committed';
      case 'paying':
        return 'paying';
      case 'paid':
        return 'paid';
      default:
        return 'unknown';
    }
  }

  constructor(props) {
    super(props);

    //Sample State for json
    this.state = {
      name: 'People for Puppies',
      isRefunding: false,
      history1: [
        {
          label: 'Original Donation',
          amt: 3,
          type: 'DAC',
          name: 'California Wild Fire Relief',
        },
        {
          label: 'Delegation',
          amt: 3,
          type: 'Campaign',
          name: 'Rebuild fire victim Camp Newman',
        },
        {
          label: 'Delegation',
          amt: 3,
          type: 'Milestone',
          name: 'Rebuild Camp Newman\'s main cabin.',
        },
      ],
      history2: [
        {
          label: 'Original Donation',
          amt: 10,
          type: 'DAC',
          name: 'Hurricane Maria Relief',
        },
        {
          label: 'Delegation',
          amt: 10,
          type: 'Campaign',
          name: 'Building relief housing in Puerto Rico.',
        },
        {
          label: 'Delegation',
          amt: 10,
          type: 'Milestone',
          name: 'Buying materials for relief structure 1.',
        },
      ],
      history3: [
        {
          label: 'Original Donation',
          amt: 2,
          type: 'DAC',
          name: 'Testing',
        },
        {
          label: 'Delegation',
          amt: 1,
          type: 'Campaign',
          name: 'Test Campaign',
        },
        {
          label: 'Delegation',
          amt: 1,
          type: 'Campaign',
          name: 'Test Campaign 2',
        },
        {
          label: 'Delegation',
          amt: 0.5,
          type: 'Milestone',
          name: 'Test Milestone',
        },
        {
          label: 'Delegation',
          amt: 0.5,
          type: 'Milestone',
          name: 'Test Milestone2',
        },
        {
          label: 'Delegation',
          amt: 0.5,
          type: 'Milestone',
          name: 'Test milestone 3',
        },
        {
          label: 'Delegation',
          amt: 0.5,
          type: 'Milestone',
          name: 'Test Milestone 4',
        },
      ],
      etherScanUrl: '',
      id: this.props.match.params.id,
    };
  }

  render() {
    const { currentUser } = this.props;
    const { history1, history2, history3 } = this.state;
    let history = [];
    if (this.state.id === '2UQEr5MteVsSJmbH') {
      history = history1;
    } else if (this.state.id === 'i2zcuyCijlFGXkEa') {
      history = history2;
    } else if (this.state.id === 'HM4QaYPJyPCq15BL') {
      history = history3;
    }
    const nodesArray = [];
    let edgesArray = [];
    let newNode = {};
    let newEdge = {};
    const height = 5000 + (history.length * 150);
    const width = 5000;
    if (history !== history3) {
      for (let i = 0; i < history.length; i++) {
        newNode = {
          id: i,
          label: 'Label: ' + history[i].label + ' | Amount: ' + history[i].amt +' | Type: ' + history[i].type + ' | Name: ' + history[i].name,
          position: {
            x: 400+(300 * i),
            y: 150,
          },
        };
        nodesArray.push(newNode);
        if (i !== 0) {
          newEdge = {
            source: i,
            target: i-1,
          }
          edgesArray.push(newEdge);
        }
      }
    } else {
      for (let i = 0; i < history.length; i++) {
        let j = 0;
        let k = 0;
        if(i == 1 | i == 2){
          k = 1;
        }else if (i==3|i==4){
          k = 2;
        }else if (i==5|i==6){
          k=3;
        }
        if(i == 1 | i == 3){
          j= 75;
        }else if(i == 2){
          j=-75;
        }else if(i==4){
          j=25;
        }else if(i==6){
          j=-25;
        }
        newNode = {
          id: i,
          label: 'Label: ' + history[i].label + ' | Amount: ' + history[i].amt +' | Type: ' + history[i].type + ' | Name: ' + history[i].name,
          position: {
            x: 400 + (250 * k),
            y: 200+(i*j),
          },
        };
        nodesArray.push(newNode);
      }

      edgesArray= [
        {
          source: 0,
          target: 1,
        },
        {
          source: 0,
          target: 2,
        },
        {
          source: 1,
          target: 3,
        },
        {
          source: 1,
          target: 4,
        },
        {
          source: 2,
          target: 5,
        },
        {
          source: 2,
          target: 6,
        },
      ];
    }

    return (

      <div className="App">
        <div className="col-md-8 m-auto">
          <center>
            <h1>helllo</h1>
          </center>
        </div>
        <div className="col-md-8 m-auto">
          <center>
            <h1>Donation History Graph</h1>
          </center>
        </div>
        <Graph
          width={width}
          height={height}
          json={{
            nodes: nodesArray,
            edges: edgesArray,
            isDirected: true,
          }}
        />
      </div>
    );
  }
}

DonationsGraph.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  history: PropTypes.shape({}).isRequired,
  wallet: PropTypes.instanceOf(GivethWallet).isRequired,
};

export default DonationsGraph;
