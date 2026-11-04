import test from "node:test";
import assert from "node:assert/strict";
import { memberAvatarPath } from "../src/lib/member-avatars.ts";
import { memberAvatars } from "../src/config/member-avatars.ts";

const active = { id: "alice", data: { status: "active" } };
const graduated = { id: "aina", data: { status: "graduated" } };

test("active avatar versions change centrally while graduated avatars stay fixed", () => {
  assert.equal(memberAvatarPath(active), `photo/avatar/${memberAvatars.activeSet}/alice.jpg`);
  assert.equal(memberAvatarPath(graduated), "photo/avatar/graduated/aina.jpg");
  const next = { activeSet: "17th", overrides: {} };
  assert.equal(memberAvatarPath(active, next), "photo/avatar/17th/alice.jpg");
  assert.equal(memberAvatarPath(graduated, next), "photo/avatar/graduated/aina.jpg");
});

test("explicit per-member resource paths take precedence over the version rule", () => {
  assert.equal(memberAvatarPath(active, {
    activeSet: "16th", overrides: { alice: "photo/avatar/special/alice.webp" },
  }), "photo/avatar/special/alice.webp");
});
