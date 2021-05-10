import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from "@testing-library/react";
import Register from "./Register";
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// smoke test
it("renders without crashing", function() {
  const mockStore = configureStore();
  const initialState = {};
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries = {['/']}>
        <Register />
      </MemoryRouter>
    </Provider>
  );
});

// snapshot test
it("matches snapshot", function() {
  const mockStore = configureStore();
  const initialState = {};
  const store = mockStore(initialState);

  const { asFragment } =  render(
    <Provider store={store}>
      <MemoryRouter initialEntries = {['/']}>
        <Register />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();
})