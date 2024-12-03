import { Hono } from "hono";
import createTodos from "../controllers/todos/createTodo"
import getTodos from "../controllers/todos/getTodos";
const todosRoutes = new Hono();

todosRoutes.post("/",createTodos)
todosRoutes.get("/",getTodos)

export default todosRoutes;