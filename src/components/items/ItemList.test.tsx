  
import React, { useState, ReactNode } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, RenderResult } from '@testing-library/react'
import renderer from 'react-test-renderer';
import ItemList from './ItemList';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { reducer, initialState } from '../../store/store';
import { AnyAction, Action } from 'redux';

interface RenderWithRedux<
  S = any,
  A extends Action = AnyAction,
  I extends S = any
> {
  (
    ui: ReactNode,
    reduxOptions: {
      store?: Store<S, A>
      initialState?: I
    }
  ): RenderResult & {
    store: Store<S, A>
  }
}
export const renderWithRedux: RenderWithRedux = (
  ui,
  { store = createStore(initialState) } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

let container = document.createElement('div');
const fields = {
  name: 'name',
};

test('can render with redux with defaults', () => {
  const store = createStore(() => ({ categories: { } }))
  const { container } = renderWithRedux(<ItemList />, {
    store,
  });
  expect(container).toExist();
})

it('matches the snapshot', () => {
  const tree = renderer.create(<ItemList/>).toJSON();
  expect(tree).toMatchSnapshot();
});
