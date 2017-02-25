import React from 'react';
import Select from 'react-select';

const FLAVOURS = [
	{ label: 'Chocolate', value: '2' },
	{ label: 'Vanilla', value: '4' },
	{ label: 'Strawberry', value: 'strawberry' },
	{ label: 'Caramel', value: 'caramel' },
	{ label: 'Cookies and Cream', value: 'cookiescream' },
	{ label: 'Peppermint', value: 'peppermint' },
];

var SelectLayer = React.createClass({
	displayName: 'SelectLayer',
	propTypes: {
		label: React.PropTypes.string,
	},
	componentWillReceiveProps(nextProps) {
		console.log(nextProps.layerList);
		this.setState({ options: nextProps.layerList});
	},
	getInitialState () {
		return {
			options: FLAVOURS,
			value: [],
		};
	},
	handleSelectChange (value) {
		this.setState({ value });
		this.props.onChange(value);
	},
	render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select multi simpleValue
						value={this.state.value}
						placeholder="Select your favourite(s)"
						options={this.state.options}
						onChange={this.handleSelectChange} />
			</div>
		);
	}
});

module.exports = SelectLayer;
