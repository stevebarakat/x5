import { assign, createMachine } from "xstate";

const originalContext = {
  someNumber: 10,
  someWord: "hello",
};

export const someMachine = createMachine(
  {
    id: "someMachine",
    types: {} as {
      context: {
        someNumber: number;
        someWord: string;
      };
      events:
        | { type: "update"; number: number; word: string }
        | { type: "reset" };
    },
    context: originalContext,
    states: {},
    on: {
      reset: {
        actions: ["resetValues"],
      },
      update: {
        actions: ["updateValues", () => console.log("updated!")],
      },
    },
  },
  {
    actions: {
      resetValues: assign(() => originalContext),
      updateValues: assign(({ event }) => {
        // Make sure the event is the right type, for TypeScript
        if (event.type !== "update") throw new Error();
        return {
          someNumber: event.number,
          someWord: event.word,
        };
      }),
    },
  }
);
