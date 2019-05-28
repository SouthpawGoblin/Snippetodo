import Vue from 'vue'
import Vuex, { GetterTree, MutationTree, ActionContext, ActionTree } from 'vuex'
import _ from 'lodash';
import Lokijs from 'lokijs';
import { remote } from 'electron';
import MySnippet from '@/classes/MySnippet';
import { RELOAD_SNIPPETS, ADD_SNIPPET, DELETE_SNIPPET, UPDATE_SNIPPET } from './mutation-types';

Vue.use(Vuex)

export interface MyState {
  snippets: MySnippet[];
}

const db = remote.getGlobal('db') as Lokijs;
const snippetsCol = db.getCollection<MySnippet>('snippets');

export default new Vuex.Store<MyState>({
  state: {
    snippets: _.cloneDeep(snippetsCol.data),
  } as MyState,
  getters: {
    snippets(state: MyState) {
      return state.snippets;
    },
  } as GetterTree<MyState, MyState>,
  mutations: {
    [RELOAD_SNIPPETS](state: MyState, payload: MySnippet[]) {
      state.snippets.splice(0, 0, ...payload);
    },
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
  } as MutationTree<MyState>,
  actions: {
    [RELOAD_SNIPPETS](injectee: ActionContext<MyState, MyState>) {
      injectee.commit(RELOAD_SNIPPETS, snippetsCol.data);
    },
    [ADD_SNIPPET](injectee: ActionContext<MyState, MyState>, snippet: MySnippet) {
      const snip = snippetsCol.insert(snippet);
      db.saveDatabase();
      injectee.commit(ADD_SNIPPET, _.cloneDeep(snip));
    },
    [UPDATE_SNIPPET](injectee: ActionContext<MyState, MyState>, snippet: MySnippet) {
      snippetsCol.update(snippet);
      db.saveDatabase();
      injectee.commit(UPDATE_SNIPPET, _.cloneDeep(snippet));
    },
    [DELETE_SNIPPET](injectee: ActionContext<MyState, MyState>, snippet: MySnippet) {
      snippetsCol.remove(snippet);
      db.saveDatabase();
      injectee.commit(DELETE_SNIPPET, snippet);
    },
  } as ActionTree<MyState, MyState>,
  strict: true,
});
