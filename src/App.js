import React from 'react'
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom';
import axios from 'axios';
import './App.css';
// import data from './data.json';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert';

const ACCESS_TOKEN = process.env.REACT_APP_LOCATION_ACCESS_TOKEN;

export default class App extends React.Component{
  constructor(){
    super();
    this.state = {
      searchInput:"",
      results:[],
      showResults:false,
      staticMap:null,
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
      let requestData = {
        url:`https://us1.locationiq.com/v1/search?key=${ACCESS_TOKEN}&q=${this.state.searchInput}&format=json`,
        method:'GET'
      };


      let responseData = await axios(requestData);


      this.setState({
        results:responseData.data,
        showResults:true})

    } catch(err) {
      this.setState({error:err.response.status});
      // console.log(err.response.status)
    }
  }


  render() {
    console.log(this.state.error);
    return (
      <div className="App">

          <header className="App-header-container">
            <Form style={{ width: '25rem', marginLeft:'auto', marginRight:'auto' , textAlign:'center', marginTop:"1em" }}>
              <Form.Group className="mb-3" controlId="formBasicText">
                <Form.Label 
                // htmlFor="citySearchBar"
                >Search</Form.Label>
                <Form.Control
                  // id="citySearchBar"
                  onChange={this.handlerOnChangeInput}
                  type="text" 
                  value={this.state.searchInput} 
                  placeholder="ENTER THE NAME OF A CITY HERE"/>
                <Button style={{marginTop:'1em'}}
                  onClick={this.handlerSubmit}
                  variant="primary"
                  type="submit"
                  >Explore!</Button>
              </Form.Group>
            </Form>
          </header>



        {(this.state.showResults) && (this.state.error===null)
        ? 
        <BrowserRouter>
          <Navbar 
          style={{ width: '25rem', marginLeft:'auto', marginRight:'auto' , textAlign:'center', marginTop:"1em" }}
          bg="dark" variant="dark">
            <Container>
              <Navbar.Brand href="#home"style={{color:"red"}}>Navigate</Navbar.Brand>
              <Nav className="me-auto">
                <Link to={"/maps"}>Maps</Link>
                <Link to={"/weather"}>Weather</Link>

              </Nav>
            </Container>
          </Navbar>
          <Routes>
            <Route path="/maps" element={
                <Card 
                  style={{ width: '18rem', marginLeft:'auto',marginRight:'auto', marginTop:"1em", borderRadius:"1em" }}>
                  <Card.Body>
                    <Card.Title>{this.state.results[0].display_name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Longitude: {this.state.results[0].lon}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Latitude: {this.state.results[0].lat}</Card.Subtitle>
                  </Card.Body>
                  <img 
                    className="card-img-bottom" 
                    src={`https://maps.locationiq.com/v3/staticmap?key=${ACCESS_TOKEN}&center=${this.state.results[0].lat},${this.state.results[0].lon}&size=600x600&zoom=12&path=fillcolor:%2390EE90|weight:2|color:blue|17.452945,78.380055|17.452765,78.382026|17.452020,78.381375|17.452045,78.380846|17.452945,78.380055`} 
                    alt="Card"></img>
                </Card>
            }></Route>
            <Route path="/weather" element={<p>weather boogers</p>}></Route>
          </Routes>
        </BrowserRouter>

        : <h2 style={{ width: '25rem', marginLeft:'auto', marginRight:'auto' , textAlign:'center', marginTop:"1em" }}>Search for a city by typing it above and clicking the Explore Button.</h2>
        }

        {(this.state.error!==null)? 
          <>
            <Alert variant="danger" onClose={() => this.setState({error:null})} dismissible>
              <Alert.Heading>Error request status {this.state.error}, watch carefully what you enter in the search bar.</Alert.Heading>
            </Alert>
          </>
        :null}


      </div>
    );
  }
}


