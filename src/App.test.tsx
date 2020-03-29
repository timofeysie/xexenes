import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { unmountComponentAtNode } from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Category from './pages/Categories';
import { createStore } from 'redux';
import { Store } from "./store/store";

// function renderWithRedux( ui: any, 
//   { store = createStore( useState ) } = {}
// ) {
//   return {
//     ...render(<Category store={store}>{ui}</Category>),
//     // adding `store` to the returned utilities to allow us
//     // to reference it in our tests (just try to avoid using
//     // this to test implementation details).
//     store,
//   }
// }

it('renders without crashing', () => {
  // const { categories } = renderWithRedux(<Category />, {
  //   initialState: { categories: [] }
  // });
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
