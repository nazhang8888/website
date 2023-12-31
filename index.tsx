import Elysia, { t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body 
            class="flex w-full h-screen justify-center items-center"
            hx-get="/todos"
            hx-swap="innerHTML"
            hx-trigger="load"
        />
      </BaseHtml>
    )
  )
  .get("/todos", () => <TodoList todos={db} />)
  .post("/clicked", () => <div class="text-blue-600">I'm from the server!</div>)
  .post(
    "/todos/toggle/:id", 
    ({ params }) => {
        const todo = db.find((todo) => todo.id === params.id)
        if (todo) {
            todo.completed = !todo.completed
            return < TodoItem {...todo} />
        }
    },
    {
        params: t.Object({
            id: t.Numeric()
        })
    }
  )
  .post(
    "/todos",
    ({ body }) => {
        if (body.content.length === 0) {
            throw new Error("Content cannot be empty")
        }
        let lastID = 0
        const newTodo = {
            id: lastID++,
            content: body.content,
            completed: false
        }
        db.push(newTodo)
        return <TodoItem { ...newTodo} />
    },
    {
        body: t.Object({
            content: t.String()
        })
    }
  )
  .delete(
    "/todos/:id",
    ({ params }) => {
        const todo = db.find((todo) => todo.id === params.id)
        if (todo) {
            db.splice(db.indexOf(todo), 1)
            
        }
    },
    {
        params: t.Object({
            id: t.Numeric()
        })
    }
  )
  .listen(3000);

console.log(
  `Server running at http://${app.server?.hostname}:${app.server?.port}/`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nicholas Chang</title>
    <script src="https://unpkg.com/htmx.org@1.9.9" integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX" crossorigin="anonymous"></script>    </head>
    <script src="https://cdn.tailwindcss.com"></script>
    ${children}
`;

type Todo = {
    id: number;
    content: string;
    completed: boolean;
}

const db: Todo[] = [
    {
        id: 1,
        content: "Buy milk",
        completed: false
    },
    {
        id: 2,
        content: "Buy eggs",
        completed: false
    },
    {
        id: 3,
        content: "Buy bread",
        completed: false
    }
]

function TodoItem({ content, completed, id }: Todo) {
    return (
        <div class="flex flex-row space-x-3">
            <p>
                {content}
            </p>
            <input 
                type="checkbox" 
                checked={ completed} 
                hx-post={`/todos/toggle/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            />
            <button 
                class="text-red-500"
                hx-delete={`/todos/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            >
                X
            </button>
        </div>
    )
    
}

function TodoList({ todos }: { todos: Todo[] }) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem { ... todo } />
            ))}
            <TodoForm />
        </div>
    )
}

function TodoForm() {
    return (
        <form
            class="flex flex-row space-x-3" 
            hx-post="/todos"
            hx-swap="beforebegin"
            hx-target="closest div"
        >
            <input 
                type="text" 
                name="content"
                class="border border-black"
            />
            <button type="submit">Add</button>
        </form>
    )
}