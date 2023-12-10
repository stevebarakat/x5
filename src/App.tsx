import { createActorContext } from "@xstate/react";
import { Details } from "./Details";
import { someMachine } from "./some-machine";

export const SomeMachineContext = createActorContext(someMachine);

export const App = () => {
  return (
    <SomeMachineContext.Provider>
      <Details />
    </SomeMachineContext.Provider>
  );
};

export default App;
