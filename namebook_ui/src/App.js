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

class EditableStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student: props.student
    };

    this.handleStudentInput = this.handleStudentInput.bind(this);
    this.handleEnterUpdateStudent = this.handleEnterUpdateStudent.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    //this.clearStudentInput = this.clearStudentInput.bind(this);
  }

  handleStudentInput(event) {
    this.setState({
      student: {name: event.target.value}
    });
  }

  clearStudentInput() {
    this.setState({
      student: ''
    });
  }

  handleEnterUpdateStudent(event) {
    event.preventDefault(); //prevent refresh
    this.updateStudent()
  }

  updateStudent() {
    this.props.updateStudent(this.state.student);
    this.clearStudentInput()
  }
  //once actually added, remove text value

  render() {
    return (
      <InputGroup>
        <InputGroup.Button>
          <Button><FontAwesome name="check" /></Button>
        </InputGroup.Button>
        <form onSubmit={this.handleEnterUpdateStudent}>
          <FormControl type="text" placeholder="Add new student" onChange={this.handleStudentInput} onBlur={this.updateStudent} value={this.state.student.name} />
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
          students.map((student, key) => (
              <ListGroupItem key={key} href="#">
                <EditableStudent student = {student} />
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
      students: []
    };

    const localRequest = new Request("http://localhost:8080/students", {  //TODO pull these requests out
        mode: 'cors',
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
    })
    fetch(localRequest)
      .then(response => response.json())
      .then(response => {
        this.setState({
         students: response._embedded.students
        });
      })

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
        .then(response => response.json())
        .then(response => {
          this.setState({
           students: this.state.students.concat([response])
          });
        })
      
    }
  }

  updateStudent = (student) => {
    if (student.name.length > 0) {
      //const header = new Headers();
      //header.append('Content-Type', 'application/json') //is append really the best here? it feels dirty 
      const localRequest = new Request("http://localhost:8080/students", {
        mode: 'cors',
        method: "PUT",
        headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        body: JSON.stringify(student)
      })
      fetch(localRequest)
        .then(response => response.json())
        .then(response => {
          this.setState({
           students: this.state.students.concat([response])
          });
        })
      
    }
  }

  dothis(x){
    console.log(x);
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
