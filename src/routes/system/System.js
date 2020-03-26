import React, { Component } from 'react';
import { connect } from 'react-redux'
import Layout from '../../components/Layout';
import Upload from '../../components/Upload';
import Image from '../../components/Image';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../../components/Link/Link';

import {
  Grid,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Media,
  Badge,
  Alert,
  Button,
  Table,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';

import MediaBody from 'react-bootstrap/lib/MediaBody';
import MediaLeft from 'react-bootstrap/lib/MediaLeft';
import MediaHeading from 'react-bootstrap/lib/MediaHeading';

import { AutoAffix } from 'react-overlays';

import { systems, findSystemById } from '../../helpers';
import * as actions from '../../actions/list';
import * as checkActions from '../../actions/check';

import s from './system.css';

const mapStateToProps = (state) => {
  return {
    isUploading: state.upload.get('isUploading'),
    isFetching: state.list.get('isFetching'),
    isDeleting: state.list.get('isDeleting'),
    isCheckingInvalids: state.check.get('isCheckingInvalids'),
    invalidFiles: state.check.get('invalidFiles'),
    systemAvailable: state.list.get('available'),
    listError: state.list.get('error'),
    fileList: state.list.get('list'),
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchList: system => {
      return dispatch(actions.list(system));
    },
    deleteFile: (system, file) => {
      if (confirm('Are you sure you want to delete this file?')) {
        dispatch(actions.deleteFile(system, file))
          .then(() => dispatch(actions.list(system)));
      }
    },
    downloadFile: (system, file) => {
        dispatch(actions.downloadFile(system, file));
    },
    checkInvalidFiles: (fileList, systemExtensions) => {
      return dispatch(checkActions.checkInvalidFiles(fileList, systemExtensions));
    }
  }
};

class Systems extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      system: findSystemById(this.props.id),
      filter: null
    };

    this.onUploadDone = ::this.onUploadDone;
    this.filterByName = ::this.filterByName;
    this.onFilterChange = ::this.onFilterChange;
  }

  componentDidMount() {
    this.props.fetchList(this.state.system.name)
              .then(() => this.props.checkInvalidFiles(this.props.fileList, this.state.system.extensions));
  }

  onUploadDone() {
    this.props.fetchList(this.state.system.name);
  }

  onFilterChange(e) {
    this.setState({
      filter: e.target.value,
    });
  }

  filterByName(filename) {
    if (!this.state.filter) {
      return filename;
    }

    var filterBy = this.state.filter.toLowerCase();
    if (filename.toLowerCase().indexOf(filterBy) !== -1) {
      return filename;
    }
  }

  renderListError() {
    const { listError } = this.props;
    if (listError) {
      return (
        <Alert bsStyle="danger">
          <h4>Oh snap! You got an error!</h4>
          <p>{listError}</p>
        </Alert>
      );
    }
  }

  renderFileList() {
    const { isFetching, isDeleting, fileList, isCheckingInvalids } = this.props;

    const list = [];
    if (isFetching || isDeleting) {
      list.push(<tr key={`system-file-loading`}><td colSpan="3">Processing...</td></tr>)
    } else if (isCheckingInvalids) {
      list.push(<tr key={`system-file-empty`}><td colSpan="3">Checking for invalid files...</td></tr>)
    } else if (!fileList.length) {
      list.push(<tr key={`system-file-empty`}><td colSpan="3">Empty directory</td></tr>)
    } else {
      fileList.filter(this.filterByName).map(file => {
        const delTooltip = (
          <Tooltip id="tooltip">Delete this file</Tooltip>
        );
        const dwnTooltip = (
          <Tooltip id="tooltip">Download this file</Tooltip>
        );

        list.push(
          <tr key={`system-file-${file}`} className={this.props.invalidFiles.indexOf(file) > -1 ? s.invalidFile : ''}>
            <td />
            <td><Link to={`/system/${this.state.system.name}/${file}`}>{file}</Link></td>
            <td>
              <OverlayTrigger placement="left" overlay={delTooltip}>
                <Button bsStyle="danger" bsSize="xs" onClick={this.props.deleteFile.bind(this, this.state.system.name, file)}>
                  <i className="fa fa-close" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="left" overlay={dwnTooltip}>
                <Button bsStyle="success" bsSize="xs" onClick={this.props.downloadFile.bind(this, this.state.system.name, file)}>
                  <i className="fa fa-download" />
                </Button>
              </OverlayTrigger>
            </td>
          </tr>
        )
      });
    }

    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr className={s.tableHeader}>
            <th colSpan="3">Files in directory <Badge>{fileList.length}</Badge></th>
          </tr>
          <tr>
            <th />
            <th >
              <input className={s.filterInput}
                     value={this.state.filter || ''}
                     onChange={this.onFilterChange}
                     placeholder="type to filter by file name"
              />
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {list}
        </tbody>
      </Table>
    )
  }

  renderContent() {
    const { systemAvailable } = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12} md={8}>
            {this.renderListError()}
            {this.renderFileList()}
          </Col>
          <Col xs={6} md={4}>
            <AutoAffix viewportOffsetTop={15} container={this}>
              <div>
                <Upload system={this.state.system}
                        enabled={systemAvailable}
                        onUploadDone={this.onUploadDone}
                />
              </div>
            </AutoAffix>
          </Col>
        </Row>
      </Grid>
    )
  }

  render() {
    const { system } = this.state;
    if (!system) {
      return (<div>Ups</div>);
    }

    const imageSrc = system && system.image ? `/${system.image}` : null;

    return (
      <Layout>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.heading}>
              {this.state.system ?
                <Media>
                  <MediaLeft align="middle">
                    <Image width={64} height={64} src={imageSrc} alt="Image"/>
                  </MediaLeft>
                  <MediaBody>
                    <MediaHeading>{this.state.system.title}</MediaHeading>
                    <p>{this.state.system.description}</p>
                  </MediaBody>
                </Media>
              : null}
            </div>
            {this.renderContent()}
          </div>
        </div>
      </Layout>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(s)(Systems));
