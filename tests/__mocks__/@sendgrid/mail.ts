import { jest } from "@jest/globals";

const send = jest.fn();

const setApiKey = jest.fn();

export default {
  send,
  setApiKey,
};