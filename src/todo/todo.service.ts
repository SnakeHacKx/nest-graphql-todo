import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Pieda del Alma', done: false },
    { id: 2, description: 'Pieda del Espacio', done: true },
    { id: 3, description: 'Pieda del Poder', done: false },
    { id: 4, description: 'Pieda del Tiempo', done: false },
  ];

  get totalTodos() {
    return this.todos.length;
  }

  get totalCompletedTodos() {
    const completedTodos = this.findAll({status: true});
    return completedTodos.length;
  }

  get totalPendingTodos() {
    const pendingTodos = this.findAll({status: false});
    return pendingTodos.length;
  }

  findAll(statusArgs: StatusArgs): Todo[] {

    const { status } = statusArgs;

    if (status !== undefined) {
      return this.todos.filter(todo => todo.done === status)
    }

    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(todo => todo.id === id);

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    return todo;
  }

  create(createTodoInput: CreateTodoInput): Todo {
    const todo = new Todo();
    todo.description = createTodoInput.description;
    todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    this.todos.push(todo);
    return todo;
  }

  update(updateTodoInput: UpdateTodoInput) {
    const { id, description, done } = updateTodoInput;
    const todoToUpdate = this.findOne(id);
    
    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;
    
    this.todos = this.todos.map(todo => {
      return (todo.id === id) ? todoToUpdate : todo;
    });
    
    return todoToUpdate;
  }
  
  delete(id: number) {
    const todo = this.findOne(id);
    this.todos = this.todos.filter(todo => todo.id !== id);

    return true;
  }
}
