import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import whitePawn from '../assets/white_pawn_large.png';
import whiteRook from '../assets/white_rook_large.png';
import whiteKnight from '../assets/white_knight_large.png';
import whiteBishop from '../assets/white_bishop_large.png';
// import whiteQueen from '../assets/white_queen_large.png';
import whiteKing from '../assets/white_king_large.png';
import blackPawn from '../assets/black_pawn_large.png';
import blackRook from '../assets/black_rook_large.png';
import blackKnight from '../assets/black_knight_large.png';
import blackBishop from '../assets/black_bishop_large.png';
import blackQueen from '../assets/black_queen_large.png';
import blackKing from '../assets/black_king_large.png';
import css from './Piece.scss';

const pieceMap = {
  Wp: whitePawn,
  Wr: whiteRook,
  Wn: whiteKnight,
  Wb: whiteBishop,
  Wq: null, // TODO: Fix
  Wk: whiteKing,
  Bp: blackPawn,
  Br: blackRook,
  Bn: blackKnight,
  Bb: blackBishop,
  Bq: blackQueen,
  Bk: blackKing,
};

const pieceSource = {
  beginDrag(props) {
    return {
      piece: props.pieceKey,
      draggable: props.pieceKey,
    };
  },
  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const {
        pieceKey,
        onPieceDrop,
      } = props;
      const result = Object.assign({},
        monitor.getDropResult(),
        { pieceKey },
      );
      onPieceDrop(result);
    }
  },
};

class Piece extends Component {
  static _onDragStart(e) {
    /* Allow the Draggable hoc handle dragging instead of the img defaults */
    e.preventDefault();
  }

  render() {
    const {
      pieceKey,
      connectDragSource,
      draggable,
      isDragging,
    } = this.props;
    const piece = pieceMap[pieceKey];

    const connectDrag = draggable ? connectDragSource : args => args;
    return pieceKey && (
      connectDrag(
        <img
          className={css.piece}
          draggable={draggable}
          style={{ opacity: (isDragging ? 0.5 : 1) }}
          src={piece}
          alt={pieceKey}
        />
    ));
  }
}

Piece.propTypes = {
  pieceKey: PropTypes.string,
  draggable: PropTypes.bool,

  // Injected by React DnD:
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
};

export default new DragSource('PIECE', pieceSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Piece);
