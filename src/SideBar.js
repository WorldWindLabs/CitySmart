import React, {Component} from 'react';

class SideBar extends Component{
    render(){
        const style = {
            backgroundColor: '#4F628E',
            //justifyContent: 'center',
            width: 250,
            height: '100vh'
            //float: 'left',

        }
    
        return(
            <div style={style}>
                Hello I'm the sidebar
            </div>
        );
    }
}

export default SideBar;