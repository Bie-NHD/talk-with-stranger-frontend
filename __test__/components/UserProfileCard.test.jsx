// import dependencies
import React from "react";
import { expect, test } from "vitest";
// import API mocking utilities from Mock Service Worker
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// import react-testing methods
import { render, fireEvent, screen } from "@testing-library/react";

import UserProfileCard from "../../src/components/UserProfileCard/UserProfileCard";

// route = "/home/profile"
// on click account-box-icon --> renders ProfileView

test("render UserProfileCard", () => {
  expect(render(<UserProfileCard />));
});
