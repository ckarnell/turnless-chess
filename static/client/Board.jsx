import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Tile from './Tile';
import css from './Board.scss';

export class Board extends PureComponent {
  static _renderBoard() {
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
            />
          ))}
        </tr>
      );
    });
  }

  componentWillMount() {
    const board = this.constructor._renderBoard();
    this.setState({ board });
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
