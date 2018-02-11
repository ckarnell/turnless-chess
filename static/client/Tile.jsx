import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Piece } from './Piece';
import css from './Tile.scss';

function drop(e) {
  // TODO: Call the endpoint to see if dropping here is allowed
  console.log('HOHO'); // TODO: Delete
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.appendChild(document.getElementById(data));
}

function allowDrop(e) { // Doesn't seem to work
  e.preventDefault();
  console.log('HEYHEY'); // TODO: Delete
}

export class Tile extends PureComponent {
  componentWillMount() {
    this.setState({ piece: 'piece' });
  }

  render() {
    const {
      dark,
    } = this.props;

    return (
      <td
        className={classNames(css.tile, { [css.dark]: dark })}
        onDrop={drop}
        onDragOver={allowDrop}
      >
        <Piece />
      </td>
    );
  }
}

Tile.defaultProps = {
  dark: true,
};

Tile.propTypes = {
  dark: PropTypes.bool,
};

export default Tile;
