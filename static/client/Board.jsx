import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Tile } from './Tile';
import css from './Board.scss';

export class Board extends PureComponent {
  constructor(props) {
    super(props);
    this._renderBoard = this._renderBoard.bind(this);
  }

  componentWillMount() {
    const board = this._renderBoard();
    this.setState({ board });
  }

  _renderBoard() {
    const rowNums = ['8', '7', '6', '5', '4', '3', '2', '1'];
    const colChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return colChars.map((char, charInd) => {
      return (
        <tr key={char}>
          {rowNums.map((num, numInd) => (
            <Tile
              dark={!!((charInd + numInd + 1) % 2)}
              key={`${char}${num}`}
            />
          ))}
        </tr>
      );
    });
  }

  render() {
    return (
      <table className={css.board}>
        <tbody>
          {this.state.board}
        </tbody>
      </table>
    );
  }
}

Board.defaultProps = {};

Board.propTypes = {
  move: PropTypes.string,
};

export default Board;
