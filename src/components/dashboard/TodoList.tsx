import { getTasks } from "@/app/actions/taskActions";
import TodoListClient from "./TodoListClient";

export default async function TodoList() {
    // Fetch tasks from the server securely
    const initialTasks = await getTasks();

    return (
        <TodoListClient initialTasks={initialTasks} />
    );
}
