import Vue from 'vue'
import Vuex, { GetterTree, MutationTree, ActionContext, ActionTree } from 'vuex'
import _ from 'lodash';
import Lokijs from 'lokijs';
import { remote } from 'electron';
import MySnippet from '@/classes/MySnippet';
import { ADD_SNIPPET, DELETE_SNIPPET, UPDATE_SNIPPET, ADD_TODO, UPDATE_TODO, DELETE_TODO } from './mutation-types';
import MyTodo from '@/classes/MyTodo';

Vue.use(Vuex)

export interface MyState {
  snippets: MySnippet[];
  todos: MyTodo[];
}

const db = remote.getGlobal('db') as Lokijs;
const snippetsCol = db.getCollection<MySnippet>('snippets');
const todosCol = db.getCollection<MyTodo>('todos');

export default new Vuex.Store<MyState>({
  state: {
    snippets: _.cloneDeep(snippetsCol.data),
    todos: _.cloneDeep(todosCol.data)
  } as MyState,
  getters: {
    snippets(state: MyState) {
      return state.snippets;
    },
    todos(state: MyState) {
      return state.todos;
    }
  } as GetterTree<MyState, MyState>,
  mutations: {
    [ADD_SNIPPET](state: MyState, payload: MySnippet) {
      state.snippets.push(payload);
    },
    [UPDATE_SNIPPET](state: MyState, payload: MySnippet) {
      let idx = _.findIndex(state.snippets, item => item.id === payload.id);
      (idx > -1) && state.snippets.splice(idx, 1, payload);
    },
    [DELETE_SNIPPET](state: MyState, payload: MySnippet) {
      let idx = _.findIndex(state.snippets, item => item.id === payload.id);
      (idx > -1) && state.snippets.splice(idx, 1);
    },
    [ADD_TODO](state: MyState, payload: MyTodo) {
      state.todos.push(payload);
    },
    [UPDATE_TODO](state: MyState, payload: MyTodo) {
      let idx = _.findIndex(state.todos, item => item.id === payload.id);
      (idx > -1) && state.todos.splice(idx, 1, payload);
    },
    [DELETE_TODO](state: MyState, payload: MyTodo) {
      let idx = _.findIndex(state.todos, item => item.id === payload.id);
      (idx > -1) && state.todos.splice(idx, 1);
    },
  } as MutationTree<MyState>,
  actions: {
    [ADD_SNIPPET](injectee: ActionContext<MyState, MyState>, payload: MySnippet) {
      const snippet = snippetsCol.insert(payload);
      db.saveDatabase();
      injectee.commit(ADD_SNIPPET, _.cloneDeep(snippet));
    },
    [UPDATE_SNIPPET](injectee: ActionContext<MyState, MyState>, payload: MySnippet) {
      snippetsCol.update(payload);
      db.saveDatabase();
      injectee.commit(UPDATE_SNIPPET, _.cloneDeep(payload));
    },
    [DELETE_SNIPPET](injectee: ActionContext<MyState, MyState>, payload: MySnippet) {
      snippetsCol.remove(payload);
      db.saveDatabase();
      injectee.commit(DELETE_SNIPPET, payload);
    },
    [ADD_TODO](injectee: ActionContext<MyState, MyState>, payload: MyTodo) {
      const todo = todosCol.insert(payload);
      db.saveDatabase();
      injectee.commit(ADD_TODO, _.cloneDeep(todo));
    },
    [UPDATE_TODO](injectee: ActionContext<MyState, MyState>, payload: MyTodo) {
      todosCol.update(payload);
      db.saveDatabase();
      injectee.commit(UPDATE_TODO, _.cloneDeep(payload));
    },
    [DELETE_TODO](injectee: ActionContext<MyState, MyState>, payload: MyTodo) {
      todosCol.remove(payload);
      db.saveDatabase();
      injectee.commit(DELETE_TODO, payload);
    },
  } as ActionTree<MyState, MyState>,
  strict: true,
});
