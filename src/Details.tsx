import type { FC } from "react";
import { SomeMachineContext } from "./App";

export const Details: FC = () => {
  const someNumber = SomeMachineContext.useSelector(
    (state) => state.context.someNumber
  );

  const someWord = SomeMachineContext.useSelector(
    (state) => state.context.someWord
  );

  const { send } = SomeMachineContext.useActorRef();

  return (
    <div>
      <p>Here is a word: {someWord}</p>
      <p>Here is a number: {someNumber}</p>

      <button
        onClick={() => send({ type: "update", number: 99, word: "splendid" })}
      >
        click me to update
      </button>

      <button onClick={() => send({ type: "reset" })}>click me to reset</button>
    </div>
  );
};
