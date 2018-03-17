import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Tile from './Tile';
import css from './Board.scss';

class Board extends Component {
  constructor() {
    super();
    this._renderBoard = this._renderBoard.bind(this);
  }

  componentWillMount() {
    this.board = this._renderBoard();
  }

  _renderBoard() {
    const {
      onPieceDrop,
    } = this.props;
    const rowNums = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const colChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return rowNums.map((num, charInd) => {
      return (
        <tr key={num}>
          {colChars.map((char, numInd) => (
            <Tile
              dark={!!((charInd + numInd + 1) % 2)}
              location={`${char}${num}`}
              key={`${char}${num}`}
              onPieceDrop={onPieceDrop}
            />
          ))}
        </tr>
      );
    });
  }

  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <table className={css.board}>
          <tbody>
            {this.board}
          </tbody>
        </table>
      </DragDropContextProvider>
    );
  }
}

Board.defaultProps = {
  onPieceDrop: () => {},
};

Board.propTypes = {
  onPieceDrop: PropTypes.func,
};

export default Board;
