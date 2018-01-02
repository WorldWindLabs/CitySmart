import React from 'react';
import Select from 'react-select';

var SelectLayer = React.createClass({
	displayName: 'SelectLayer',
	propTypes: {
		label: React.PropTypes.string,
	},
	componentWillReceiveProps(nextProps) {
		this.setState({ options: nextProps.layerList})
	},
	getInitialState () {
		return {
			options: [],
			value: [],
		};
	},
	handleSelectChange (value) {
		this.setState({ value });
		this.props.onChange( { layersSelected: value } );
	},
	render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select multi simpleValue
						value={this.state.value}
						placeholder="Select layers"
						options={this.state.options}
						onChange={this.handleSelectChange} />
			</div>
		);
	}
});

export default SelectLayer;
