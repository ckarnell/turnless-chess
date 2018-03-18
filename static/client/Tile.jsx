import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
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

class Tile extends Component {
  constructor() {
    super();
    this._wrappedPieceDrop = this._wrappedPieceDrop.bind(this);
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

  _wrappedPieceDrop(args) {
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
      connectDropTarget,
      location,
      color,
    } = this.props;
    const draggable = pieceKey && color && pieceKey[0] === color;

    return connectDropTarget(
      <td
        className={classNames(css.tile, { [css.dark]: dark })}
      >
        <Piece
          pieceKey={pieceKey}
          location={location}
          onPieceDrop={this._wrappedPieceDrop}
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
  color: PropTypes.string,
  dark: PropTypes.bool,
  location: PropTypes.string,
  onPieceDrop: PropTypes.func,
  pieceKey: PropTypes.string,
  draggable: PropTypes.bool,

  // Injected by React DnD:
  connectDropTarget: PropTypes.func,
};

function collect(dragConnect, monitor) {
  return {
    connectDropTarget: dragConnect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

export default new DropTarget('PIECE', tileTarget, collect)(Tile);
