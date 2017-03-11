import React, {Component} from 'react';

class InfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      osmid: '',
      info: '',
      hide: false,
    };

    this.handleChangeOsmid = this.handleChangeOsmid.bind(this);
    this.handleChangeInfo = this.handleChangeInfo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    // var show = nextProps.pick.status ? 'block' : 'none';
    this.setState({
      hide: nextProps.pick.status,
      osmid: nextProps.pick.osmid.toString(),
    });
  }

  handleChangeOsmid(event) {
  this.setState({osmid: event.target.value});
}

  handleChangeInfo(event) {
    this.setState({info: event.target.value});
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.osmid + " " + this.state.info);
    var endpoint = "http://ec2-35-166-171-213.us-west-2.compute.amazonaws.com:8080";

    event.preventDefault();
    var request = new XMLHttpRequest(),
        url = endpoint+"/polygoninfo/";
    request.open("POST", url, true);

    //Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
      if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
          // Request finished. Do processing here.
          alert("Osm object updated!");
      }
    }

    var params = "id=" + this.state.osmid + "&" +
                 "info=" + (this.state.info);
    console.log(params);
    request.send(params);
  }

  render() {
    var html = (
      <form onSubmit={this.handleSubmit}>
        {/* <label>
          OsmId:
          <input type="text" value={this.state.value} onChange={this.handleChangeOsmid} />
        </label>
        <br/> */}
        <label>
          Info:
          <input type="text" value={this.state.value} onChange={this.handleChangeInfo} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
    return this.state.hide ? html : null;
  }
}


export default InfoForm;
