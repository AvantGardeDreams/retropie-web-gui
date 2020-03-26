import React, { Component } from 'react';
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';
import Link from '../../components/Link/Link';
import Image from '../../components/Image';
import LinearProgress from 'material-ui/LinearProgress';
import { Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import * as actions from '../../actions/game';
import s from './game.css';

const mapStateToProps = (state) => {
  return {
    isChecking: state.game.get('isChecking'),
    details: state.game.get('details'),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (system, game) => { return dispatch(actions.details(system, game)) },
  }
};

class Game extends Component
{
  constructor(...props) {
    super(...props);

    //this.state = {
    //  system: this.props.system,
    //  game:   this.props.game
    //}
  }

  componentDidMount() {
    this.props.onLoad(this.props.system, this.props.game);
  }

  renderGame(details) {
    return (
      <div className={s.container}>
        <h1>{this.props.game}</h1>
        <Grid>
          <Row>
            <Col>
              <Image src={details.cover} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

  render() {
    const { isChecking, details } = this.props;

    if ( isChecking || details == undefined ) {
      return (<LinearProgress />);
    }

    return (
      <Layout>
        {this.renderGame(details)}
      </Layout>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(Game));
