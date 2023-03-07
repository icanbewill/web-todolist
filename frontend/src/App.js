import { useState, useEffect, useRef } from "react";
import List from "./components/List";
import { FaPlus } from "react-icons/fa";
import "./App.css";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';
import Modal from 'react-bootstrap/Modal';

import { ColorRing } from 'react-loader-spinner'
import Button from 'react-bootstrap/Button';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [updateState, setUpdateState] = useState("");
  const [updateLib, setUpdateLib] = useState("");
  const [toUpdate, setToUpdate] = useState("");
  const addField = useRef(null);
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const [queriedList, setQueriedList] = useState('')

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // componentDidMount 
  useEffect(() => {
    fetchTasks()
  }, [])

  // Action ENTRER
  const handleKeyDown = (event) => {
    if (event.charCode === 13) {
      // if (event.key === 'Enter') {
      setTodo(event.target.value);
      addTodo()
    }
  };

  // Récuperer la liste des taches
  const fetchTasks = async () => {
    setIsLoading(true)
    await axios.get(`http://localhost:8000/api/tasks`).then(({ data }) => {
      setTodos(data.tasks)
      setIsLoading(false)
    })

  }

  const addTodo = async (e) => {
    if (todo !== "") {
      setIsLoading(true)
      const formData = { libelle: todo };
      await axios.post(`http://localhost:8000/api/tasks`, formData).then(({ data }) => {
        if (data.success) {
          setTodos([...todos, data.task]);
          setTodo("");
          this.refs.addField.value = '';
        }
        setIsLoading(false)
      }).catch(({ response }) => {
        // Catcher l'erreur ici
      })
    };
  };

  const deleteTodo = async (item) => {
    setIsLoading(true)
    await axios.delete(`http://localhost:8000/api/tasks/${item.id}`).then(({ data }) => {
      fetchTasks()
      setIsLoading(false)
    }).catch(({ response: { data } }) => {

    })
  };

  const editTodo = async (item) => {
    setToUpdate(item);
    setUpdateLib(item.libelle);
    setUpdateState(item.state);
    handleShowModal()
  };

  const updateTodo = async (e) => {
    if (updateLib !== "") {
      setIsLoading(true)
      const formData = { id: toUpdate.id, libelle: updateLib, state: updateState };
      await axios.put(`http://localhost:8000/api/tasks/${toUpdate.id}`, formData).then(({ data }) => {
        if (data.success) {
          fetchTasks()
        }
        handleCloseModal()
        setIsLoading(false)
      }).catch(({ response }) => {
        // Catcher l'erreur ici
      })
    };
  };

  const onSearch = async (e) => {
    setQuery(e.target.value);
    const results = todos.filter(todo => {
      if (e.target.value === "") return todos
      return todo.libelle.toLowerCase().includes(e.target.value.toLowerCase())
    })

    setQueriedList(results)
  };



  return (
    <div className="App App-content" >
      <div className="container">
        <h1 className="text-dark text-uppercase font-weight-bolder title">TO-DO LIST</h1>
        <hr />

        <div className='searchbar rounded mb-5'>
          <input
            className='searchinput my-2'
            type="text"
            onChange={onSearch}
            placeholder="Rechercher"
          />
        </div>
        <ColorRing
          visible={isLoading}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />

        {/* <Input todo={todo} setTodo={setTodo} addTodo={addTodo} /> */}
        <div className="content rounded">

          <List list={query == '' ? todos : queriedList} remove={deleteTodo} edit={editTodo} />
          <div className="input-wrapper">
            <FaPlus className='icone mx-2' />
            <input
              className="addInput mx-2"
              type="text"
              name="todo"
              ref={addField}
              id="todo"
              placeholder="Ajouter une tâche (puis appuyez deux fois sur ENTRER)"
              onKeyPress={handleKeyDown}
            />
          </div>

        </div>
      </div>
      <div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier une tâche</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateTodo}>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="todo"
                  className="form-control mb-2"
                  id="todo"
                  value={updateLib}
                  onChange={(event) =>
                    setUpdateLib(event.target.value)
                  }
                />
                <select className="form-control mb-2" id="lang" value={updateState}
                  onChange={(event) =>
                    setUpdateState(event.target.value)
                  }>
                  <option value="a faire">A Faire</option>
                  <option value="en cours">En cours</option>
                  <option value="fait">Fait</option>
                  <option value="en retard">En retard</option>
                </select>

              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={updateTodo}>
              Modifier
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  );
};

export default App;