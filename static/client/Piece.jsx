import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Draggable from 'react-draggable';
import whitePawn from '../assets/white_pawn_large.png';
import whiteRook from '../assets/white_rook_large.png';
import whiteKnight from '../assets/white_knight_large.png';
import whiteBishop from '../assets/white_bishop_large.png';
import whiteQueen from '../assets/white_queen_large.png';
import whiteKing from '../assets/white_king_large.png';
import blackPawn from '../assets/black_pawn_large.png';
import blackRook from '../assets/black_rook_large.png';
import blackKnight from '../assets/black_knight_large.png';
import blackBishop from '../assets/black_bishop_large.png';
import blackQueen from '../assets/black_queen_large.png';
import blackKing from '../assets/black_king_large.png';

const pieceMap = {
  Wp: whitePawn,
  Wr: whiteRook,
  Wn: whiteKnight,
  Wb: whiteBishop,
  Wq: whiteQueen,
  Wk: whiteKing,
  Bp: blackPawn,
  Br: blackRook,
  Bn: blackKnight,
  Bb: blackBishop,
  Bq: blackQueen,
  Bk: blackKing,
};

export class Piece extends Component {
  static _onDragStart(e) {
    /* Allow the Draggable hoc handle dragging instead of the img defaults */
    e.preventDefault();
  }

  render() {
    const {
      pieceKey,
    } = this.props;
    const piece = pieceMap[pieceKey];

    return !pieceKey ? null : (
      <Draggable>
        <img
          draggable="true"
          onDragStart={this.constructor._onDragStart}
          height="50"
          width="50"
          src={piece}
          alt={pieceKey}
        />
      </Draggable>
    );
  }
}

Piece.propTypes = {
  pieceKey: PropTypes.string,
};

export default Piece;
