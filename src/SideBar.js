import React, {Component} from 'react';

class SideBar extends Component{
    render(){
        const style = {
            backgroundColor: '#4F628E',
            justifyContent: 'center',
            padding: 20,
            width: 250,
            height: '50%'
            //float: 'left',

        }

        const headerStyle = {
            textAlign: 'center'
        }
    
        return(
            <div style={style}>
                <h1 style={headerStyle}>CitySmart</h1>
                {/*Placehoder UI elements*/}
                &emsp;<input></input> <b>Search</b>
                <br/>
                <h3>
                    <p>&emsp;+ Layers</p>
                    <h5>&emsp;&emsp; OpenStreetMap</h5>
                    <h5>&emsp;&emsp; Trento 3D Buildings</h5>
                    <br/>
                    <p>&emsp;+ Servers</p>
                </h3>
                    &emsp;<input></input> <b>Add</b>
            </div>
        );
    }
}

export default SideBar;