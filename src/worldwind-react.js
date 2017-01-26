import React, {Component} from 'react';

export default class extends Component{
    
    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        //var wwd = new WorldWind.WorldWindow("canvasOne");
        console.log("Entré a componentDidMount");
    }
     
    render() {
        return(
            // <canvas id="canvasOne" style="width: 100%; height:100%;">
            <canvas id="canvasOne" ref="worldwind">
                Your browser does not support HTML5 Canvas.
            </canvas>
        );
    }
}