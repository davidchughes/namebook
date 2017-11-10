import React, { Component } from 'react';
import {
  ListGroup,
  ListGroupItem,
  FormControl,
  InputGroup,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import logo from './logo.svg';
import './App.css';

const Header = () =>
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <h1 className="App-title">Welcome to namebook</h1>
</header>

class AddNewStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStudent: ''
    };

    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleEnterAddStudent = this.handleEnterAddStudent.bind(this);
    this.addNewStudent = this.addNewStudent.bind(this);
    this.clearStudentInput = this.clearStudentInput.bind(this);
  }

  handleStudentInput(event) {
    this.setState({
      newStudent: event.target.value
    });
  }

  clearStudentInput() {
    this.setState({
      newStudent: ''
    });
  }

  handleEnterAddStudent(event) {
    event.preventDefault(); //prevent refresh
    this.addNewStudent()
  }

  addNewStudent() {
    this.props.addStudent(this.state.newStudent);
    this.clearStudentInput()
  }
  //once actually added, remove text value

  render() {
    return (
      <InputGroup>
        <InputGroup.Button>
          <Button onClick={this.addNewStudent}><FontAwesome name="plus" /></Button>
        </InputGroup.Button>
        <form onSubmit={this.handleEnterAddStudent}>
          <FormControl type="text" placeholder="Add new student" onChange={this.handleStudentInput} value={this.state.newStudent} />
        </form>
      </InputGroup>
    );
  }
}

const StudentList = ({ students, addStudent }) => {
  return (
    <div className="student-list">
      <ListGroup className="student-list-group">
        {
          students.map((studentName, key) => (
              <ListGroupItem key={key}>
                <ButtonGroup justified>
                  <Button className="edit-button" href="#" ><FontAwesome name="pencil" /></Button>
                  <Button className="student-name-button" href="#">{studentName}</Button>
                </ButtonGroup>
              </ListGroupItem>
          ))
        }
        <ListGroupItem>
          <AddNewStudent addStudent={addStudent} />
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}

const Body = ({ students, addStudent }) =>
<div>
  <StudentList students={students} addStudent={addStudent} />
</div>

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: ['bob', 'Thor', 'Landon']
    };

    this.addStudent = this.addStudent.bind(this);
  }

  addStudent = (name) => {
    if (name.length > 0) {
      //const header = new Headers();
      //header.append('Content-Type', 'application/json') //is append really the best here? it feels dirty 
      const localRequest = new Request("http://localhost:8080/students", {
        mode: 'cors',
        method: "POST",
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          name: name
        })
      })
      fetch(localRequest)
      //this.setState({
      //  students: this.state.students.concat([name])
      //});
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Body students={this.state.students} addStudent={this.addStudent} />
      </div>
    );
  }
}

export default App;
