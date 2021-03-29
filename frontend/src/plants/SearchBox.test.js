import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import SearchBox from "./SearchBox";

const fxn = () => {return null}

it("renders without crashing", function() {
  render(
    <MemoryRouter>
        <SearchBox setFxn={fxn} query="rose" />
    </MemoryRouter>
    );
});

it("matches snapshot", function() {
    const { asFragment } = render(
        <MemoryRouter>
            <SearchBox setFxn={fxn} query="rose" />
        </MemoryRouter>
        );
    expect(asFragment()).toMatchSnapshot();
  });