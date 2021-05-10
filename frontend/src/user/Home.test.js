import React from "react";
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from "@testing-library/react";
import Home from "./Home";
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
        <Home />
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
        <Home />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();
})