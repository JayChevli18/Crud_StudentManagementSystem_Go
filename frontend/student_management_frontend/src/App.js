import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const apiUrl = 'http://localhost:8080/students';

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', age: Number(0), grade: '' });
  const [editing, setEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Fetch all students on page load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(apiUrl);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleCreateStudent = async () => {
    console.log(newStudent.name, newStudent.age, newStudent.grade );
    console.log(typeof(newStudent.age))
    const studentData={...newStudent,age:parseInt(newStudent.age)}
    try {
      await axios.post(apiUrl, studentData);
      fetchStudents();
      setNewStudent({ name: '', age: 0, grade: '' });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEditStudent = (student) => {
    setEditing(true);
    setCurrentStudent(student);
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(`${apiUrl}/${currentStudent._id}`, currentStudent);
      fetchStudents();
      setEditing(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleEditInputChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <h1>Student Management System</h1>


      <h2>Add New Student</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
          required
        />
        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newStudent.age}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            value={newStudent.grade}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="action-buttons">
          <button type="button" onClick={handleCreateStudent}>Add Student</button>
        </div>
      </form>

      {editing && (
        <div>
          <h2>Edit Student</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={currentStudent.name}
              onChange={handleEditInputChange}
              required
            />
            <div className="form-group">
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={currentStudent.age}
                onChange={handleEditInputChange}
                required
              />
              <input
                type="text"
                name="grade"
                placeholder="Grade"
                value={currentStudent.grade}
                onChange={handleEditInputChange}
                required
              />
            </div>
            <div className="action-buttons">
              <button type="button" onClick={handleUpdateStudent}>Update Student</button>
              <button type="button" className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <h2>All Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <span>{student.name} (Age: {student.age}, Grade: {student.grade})</span>
            <div>
              <button onClick={() => handleEditStudent(student)}>Edit</button>
              <button className="btn-delete" onClick={() => handleDeleteStudent(student._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default App;
