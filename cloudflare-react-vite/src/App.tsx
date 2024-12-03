import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  // Will be utilized for get
  // const [todos, setTodos] = useState<Todo[]>([]);
  // POST a todo
  const [todo, setTodo] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const url = "http://localhost:8787/todos";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(`Todo added succesfully: ${json}`);

      // Ensures that potentially preceding error messages are removed
      setErrorMessage(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
        console.log(errorMessage);
      } else {
        console.log("An unknown error occorred");
      }
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Todo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Enter Todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
    </>
  );
}

export default App;
