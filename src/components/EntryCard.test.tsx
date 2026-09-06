import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { groupRepository } from "@/lib/repository";
import { EntryCard } from "./EntryCard";

describe("EntryCard", () => {
  it("links a group to its permanent page", () => {
    const entry = groupRepository.findSphere(2, 3)!;
    render(<EntryCard entry={entry} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/groups/spheres/2/3");
    expect(screen.getByText("known")).toBeInTheDocument();
  });
});
