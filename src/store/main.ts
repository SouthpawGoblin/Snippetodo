import Vue from 'vue'
import Vuex, { GetterTree, MutationTree, ActionContext, ActionTree } from 'vuex'
import Lokijs from 'lokijs';
import { remote } from 'electron';
import MySnippet from '@/classes/MySnippet';
import { RELOAD_SNIPPETS, ADD_SNIPPET } from './mutation-types';

Vue.use(Vuex)

export interface MyState {
  snippets: MySnippet[];
}

const db = remote.getGlobal('db') as Lokijs;
const snippetsCol = db.getCollection<MySnippet>('snippets');

export default new Vuex.Store<MyState>({
  state: {
    snippets: [],
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
  } as MutationTree<MyState>,
  actions: {
    [RELOAD_SNIPPETS](injectee: ActionContext<MyState, MyState>) {
      injectee.commit(RELOAD_SNIPPETS, snippetsCol.data);
    },
    [ADD_SNIPPET](injectee: ActionContext<MyState, MyState>, snippet: MySnippet) {
      snippetsCol.insert(snippet);
      db.saveDatabase();
      injectee.commit(ADD_SNIPPET, snippet);
    },
  } as ActionTree<MyState, MyState>,
  strict: true,
});
