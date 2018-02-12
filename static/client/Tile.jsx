import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _get from 'lodash/get';
import classNames from 'classnames';
import { Piece } from './Piece';
import css from './Tile.scss';

function drop(e) {
  console.log('HOHO'); // TODO: Delete
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  e.target.appendChild(document.getElementById(data));
}

function allowDrop(e) { // Doesn't seem to work
  e.preventDefault();
  console.log('HEYHEY'); // TODO: Delete
}

class Tile extends PureComponent {
  componentWillMount() {
    this.setState({ piece: 'piece' });
  }

  render() {
    const {
      dark,
      pieceKey,
    } = this.props;

    return (
      <td
        className={classNames(css.tile, { [css.dark]: dark })}
        onDrop={drop}
        onDragOver={allowDrop}
      >
        <Piece pieceKey={pieceKey} />
      </td>
    );
  }
}

Tile.defaultProps = {
  dark: true,
};

Tile.propTypes = {
  dark: PropTypes.bool,
  pieceKey: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const pieceKey = _get(state, `boardState.${props.location}`, null);
  return { pieceKey };
};

export default connect(mapStateToProps, null)(Tile);
