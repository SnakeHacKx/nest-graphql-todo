import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto/args';
import { AggregationsType } from './types/aggregations.type';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'todos', description: 'TODO List' })
  findAll(@Args() statusArgs: StatusArgs): Todo[] {
    return this.todoService.findAll(statusArgs);
  }

  @Query(() => Todo, { name: 'todo', description: 'Single TODO' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo, { name: 'createTodo', description: 'Crea un TODO' })
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    return this.todoService.create(createTodoInput);
  }

  @Mutation(() => Todo, {
    name: 'updateTodo',
    description: 'Actualiza un TODO',
  })
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput);
  }

  @Mutation(() => Boolean, {
    name: 'removeTodo',
    description: 'Elimina un TODO',
  })
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.delete(id);
  }

  //* AGREGEGATIONS

  @Query(() => Int, {name: 'totalTodos'})
  totalTodos(): number {
    return this.todoService.totalTodos;
  }

  @Query(() => Int, {name: 'completedTodos'})
  completedTodos(): number {
    return this.todoService.totalCompletedTodos;
  }

  @Query(() => Int, {name: 'pendingTodos'})
  pendingTodos(): number {
    return this.todoService.totalPendingTodos;
  }
  
  
  @Query(() => AggregationsType) 
  aggregations(): AggregationsType {
    return {
      completed: this.todoService.totalCompletedTodos,
      pending: this.todoService.totalPendingTodos,
      total: this.todoService.totalTodos,
      totalTodosCompleted: this.todoService.totalTodos
    }
  }
}
