import React from 'react';
import PropTypes from 'prop-types';
import './Total.css';

const Total = ({ label, value }) => (
	<section className="Total">
		<span className="value">{value}</span>
		<span className="label">{label}</span>
	</section>
);

Total.defaultProps = {
	value: 0,
};

Total.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.number,
};

export default Total;
