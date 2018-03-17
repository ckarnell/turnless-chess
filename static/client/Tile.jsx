import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import classNames from 'classnames';
import Piece from './Piece';
import css from './Tile.scss';

const tileTarget = {
  drop(props) {
    const {
      location,
    } = props;
    return {
      toLocation: location,
    };
  },
  canDrop() {
    return true;
  },
};

function collect(dragConnect, monitor) {
  return {
    connectDropTarget: dragConnect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

class Tile extends Component {
  constructor() {
    super();
    this._decoratedPieceDrop = this._decoratedPieceDrop.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const {
      pieceKey,
      draggable,
    } = this.props;
    if ((pieceKey !== nextProps.pieceKey) || (draggable !== nextProps.draggable)) {
      return true;
    }
    return false;
  }

  _decoratedPieceDrop(args) {
    const {
      onPieceDrop,
      location,
    } = this.props;
    const composedArgs = Object.assign({},
      args,
      { fromLocation: location },
    );
    return onPieceDrop(composedArgs);
  }

  render() {
    const {
      dark,
      pieceKey,
      draggable,
      connectDropTarget,
      location,
    } = this.props;

    return connectDropTarget(
      <td
        className={classNames(css.tile, { [css.dark]: dark })}
      >
        <Piece
          pieceKey={pieceKey}
          location={location}
          onPieceDrop={this._decoratedPieceDrop}
          draggable={draggable}
        />
      </td>
    );
  }
}

Tile.defaultProps = {
  dark: true,
  onPieceDrop: () => {},
};

Tile.propTypes = {
  dark: PropTypes.bool,
  draggable: PropTypes.bool,
  pieceKey: PropTypes.string,
  onPieceDrop: PropTypes.func,
  location: PropTypes.string,

  // Injected by React DnD:
  connectDropTarget: PropTypes.func,
};

const mapStateToProps = (state, props) => {
  const pieceKey = _get(state, `boardState.${props.location}`, null);
  const color = _get(state, 'player.color', null);
  const draggable = pieceKey && color && pieceKey[0] === color;
  return { pieceKey, draggable };
};

export default connect(mapStateToProps, null)(new DropTarget('PIECE', tileTarget, collect)(Tile));
