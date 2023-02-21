import React from 'react'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import axios from 'axios';
import './App.css';
// import data from './data.json';
import Card from 'react-bootstrap/Card';

const ACCESS_TOKEN = process.env.REACT_APP_LOCATION_ACCESS_TOKEN;

export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      searchInput:"",
      results:[],
      showResults:false,
      error:null
    }
  }

  handlerOnChangeInput = (e) => {
    let inputValue = e.target.value;
    this.setState({searchInput:inputValue})
    // console.log(inputValue);
  }

  handlerSubmit = async(e) => {
    e.preventDefault();
    console.log('submitted');
    try {
      let request = {
        url:`https://us1.locationiq.com/v1/search?key=${ACCESS_TOKEN}&q=${this.state.searchInput}&format=json`,
        method:'GET'
      };

      let response = await axios(request);

      this.setState({results:response.data,showResults:true})

    } catch {
      console.log("catching error")
    }
  }


  render() {
    console.log(this.state.results);
    return (
      <div className="App">

          <header className="App-header-container">
            <form>
              <input 
                onChange={this.handlerOnChangeInput}
                type="text" 
                value={this.state.searchInput} 
                placeholder="ENTER THE NAME OF A CITY HERE"/>
              <button
                onClick={this.handlerSubmit}>Explore!</button>
            </form>
          </header>



        {this.state.showResults 
        ? 
        <BrowserRouter>
          <nav>
            <h2>Use the links before to navigate to a feature.</h2>
            <li><Link to={"/maps"}>Maps</Link></li>
            <li><Link to={"/weather"}>Weather</Link></li>
          </nav>
          <Routes>
            <Route path="/maps" element={
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{this.state.results[0].display_name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Longitude: {this.state.results[0].lon}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Latitude: {this.state.results[0].lat}</Card.Subtitle>
                  </Card.Body>
                </Card>
            }></Route>
            <Route path="/weather" element={<p>weather boogers</p>}></Route>
          </Routes>
        </BrowserRouter>
        : <h2>Search for a city by typing it above and clicking the Explore Button.</h2>
        }
      </div>
    );
  }
}


