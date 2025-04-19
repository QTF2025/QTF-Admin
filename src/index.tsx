import React from 'react';
import ReactDOM from 'react-dom/client';
import createSagaMiddleware from 'redux-saga'
import { BrowserRouter } from 'react-router-dom'
import { configureStore as createStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import storeReducer from './store/reducers'
import { rootSaga } from './store/redux-saga'
import App from './App';

const sagaMiddleWare = createSagaMiddleware()

const store = createStore({
  reducer: {
    store: storeReducer
  },
  middleware: [sagaMiddleWare],
  devTools: true
})

sagaMiddleWare.run(rootSaga)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
