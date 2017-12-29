import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class List extends PureComponent {
  render() {
    const { title, items } = this.props;

    return (
      <section className="List">
        <header>{title}</header>
        <ul>
          {items.map(({ label, value }) => (
            <li key={label} className="ListItem">
              <span className="label">{label}</span>
              <span className="value">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}

List.defaultProps = {
  items: [],
};

List.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

export default List;
