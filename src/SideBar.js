import React, {Component} from 'react';

class SideBar extends Component{
    render(){
        const style = {
            backgroundColor: '#4F628E',
            justifyContent: 'center',
            padding: 20,
            width: 250,
            height: '95vh'
            //float: 'left',

        }

        const header = {
            textAlign: 'center',
            lineHeight: 0.4,
            padding: 30
        }

        const imageStyle = {
            display: 'block',
            margin: 'auto',
            width: 130,
            align: 'center',
            // padding: '10%'
        }
    
        return(
            <div style={style}>
                <div><img src={require('./DelBiancoLogo.png')} style={imageStyle}/></div>
                <div style={header}><b>DelBianco</b><br/><h1>CitySmart</h1></div>
                {/*Placehoder UI elements*/}
                &emsp;<input></input> <b>Search</b>
                <br/>
                <h3>
                    <p>&emsp;+ Layers</p>
                    <h5>&emsp;&emsp; OpenStreetMap</h5>
                    <h5>&emsp;&emsp; Springfield Fire Reporting</h5>
                    <br/>
                    <p>&emsp;+ Servers</p>
                </h3>
                    &emsp;<input></input> <b>Add</b>
            </div>
        );
    }
}

export default SideBar;