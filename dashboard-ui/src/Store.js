import { applyMiddleware, createStore } from 'redux';
import { logger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

const initState = {};

const store = createStore(
   (state = initState, action) => {
      switch (action.type) {
         case 'LESSON_LOADED':
            if (JSON.stringify(action.payload) !== JSON.stringify(state.lesson)) {
               return Object.assign(
                  {}, state, { lesson: action.payload }
               )
            }
      }

      return state;
   },
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
   applyMiddleware(
      logger,
      thunkMiddleware,
      promiseMiddleware()
   )
);

export default store;
