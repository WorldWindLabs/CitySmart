import React, {Component} from 'react';

export default class extends Component{
    
    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        this.map = new window.WorldWind.WorldWindow("canvasOne");
    }
     
    render() {
        return(

            // <canvas id="canvasOne" style="width: 100%; height:100%;">
            <canvas id="canvasOne" ref="canvasOne">
                Your browser does not support HTML5 Canvas.
            </canvas>
        );
    }
}