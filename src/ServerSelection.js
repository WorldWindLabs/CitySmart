import React from 'react';
import Select from 'react-select';

var ServerSelection = React.createClass({
	displayName: 'ServerSelection',
	propTypes: {
		hint: React.PropTypes.string,
		label: React.PropTypes.string
	},
	getInitialState () {
		return {
			value: [],
			options: [
				{ value: 'neowms.sci.gsfc.nasa.gov/wms/wms', label: 'test' },
				// { value: 'http://localhost:3000/mapserv.xml', label: 'Springfield-Eugene PSAP Data' },
				{ value: 'hhttp://gaia.inegi.org.mx/NLB/mdm5.wms', label: 'INEGI Mexico' },
				{value: ''}
			],
		};
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			options: nextProps.serversList,
			value: nextProps.serversSelected,
		});
	},
	handleOnChange (value) {
		this.setState({ value });
		this.props.onChange({
      serversList: this.state.options,
      serversSelected: value,
    });
	},
	render () {
		const { value, options } = this.state;
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select.Creatable
					multi={true}
					options={this.state.options}
					onChange={this.handleOnChange}
					value={this.state.value}
          placeholder="Select servers"
				/>
				<div className="hint">{this.props.hint}</div>
			</div>
		);
	}
});

module.exports = ServerSelection;
