import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from "@testing-library/react";
import Login from "./Login";
import configureStore from 'redux-mock-store';
import { Provider, connect } from 'react-redux';

// smoke test
it("renders without crashing", function() {
  const mockStore = configureStore();
  const initialState = {};
  const store = mockStore(initialState);

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries = {['/']}>
        <Login />
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
        <Login />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();
})