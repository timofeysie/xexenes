  
import React, { useState } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import ItemList from './ItemList';
import { createStore } from 'redux';
import { Store } from "../../store/store";

// function renderWithRedux(
//   { store = createStore(useState) } = {}
// ) {
//   return {
//     ...render(<ItemList store={store}></ItemList>),
//     // adding `store` to the returned utilities to allow us
//     // to reference it in our tests (just try to avoid using
//     // this to test implementation details).
//     store,
//   }
// }

let container = document.createElement('div');
const fields = {
  name: 'name',
};

test('can render with redux with defaults', () => {
  const store = createStore(() => ({ todos: { } }))
  // const { getByTestId, getByText } = renderWithRedux(<ItemList />, {
  //   store,
  // });
})

// it('matches the snapshot', () => {
//   const tree = renderer.create(<ItemList/>).toJSON();
//   expect(tree).toMatchSnapshot();
// });