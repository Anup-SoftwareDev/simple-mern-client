import {useState, useEffect} from 'react';

const API_BASE = process.env.REACT_APP_API_URL

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect (()=>{
    
    GetTodos();
    console.log("at UseEffect todos:",todos);
  },[])

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res=> res.json())
      .then(data=> setTodos(data))
      .catch(err => console.error("Error:", err));
  }

  const completeTodo = async id=> {
    console.log("Inside completeTodo")
      const data = await fetch(API_BASE + "/todo/complete/" + id)
                  .then(res => res.json());
              
      setTodos(todos => todos.map(todo =>{
            if(todo._id === data._id){
              todo.complete = data.complete;
            }

            return todo;
      }));
  }

  const deleteTodo = async id => {
    console.log("Inside deleteTodo")
    const data = await fetch(API_BASE + "/todo/delete/"+ id,{
      method: "DELETE"
    }).then(res=>res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data._id));
    console.log("at deleteTodo todos:", todos)
  }

  const addTodo = async()=> {
    console.log("Inside addTodo")
    const data = await fetch(API_BASE + "/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: newTodo
        })
    }).then(res=> res.json());

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  }

  return (
    <div className="App">
      {console.log("In Return todos:", todos)}
      <h1>Welcome, Anup</h1>
      <h4>Your Tasks</h4>

      <div className = "todos">
{console.log("In Return classNametodos", todos)}
        {todos.map(todo=>(
   
          <div className = {
            "todo "+(todo.complete?
              "is-complete":"")
            } key = {todo.id} >
              <div className = "checkbox" onClick={()=>completeTodo(todo._id)}></div>
              <div className = "text" onClick={()=>completeTodo(todo._id)}>{todo.text}</div>
              <div className = "delete-todo" onClick={()=>deleteTodo(todo._id)}>x</div> 
          </div>

        ))}
      </div>

      <div className="addPopup" onClick={()=> setPopupActive(true)}>+</div>
    {console.log("In Return addpopup", todos)}
      {popupActive? (
        
        <div className="popup">
            <div className = "closePopup" onClick={()=> setPopupActive
              (false)}>x</div>
              <div className="content">
                <h3 >Add Task</h3>
                
                <input 
                      type ="text" 
                      className="add-todo-input" 
                      onChange= {e=> setNewTodo(e.target.value)}
                      value = {newTodo}/>
              </div>
            <div className="button" onClick={addTodo}>Create Task</div>
        </div>
      
      ):""}
      {console.log("In Return end", todos)}
    </div>
  );
}

export default App;
