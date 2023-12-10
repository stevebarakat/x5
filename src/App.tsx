import { createActorContext } from "@xstate/react";
import Player from "./Player";
import { playerMachine } from "./playerMachine";

export const PlayerMachineContext = createActorContext(playerMachine);

export const App = () => {
  return (
    <PlayerMachineContext.Provider>
      <Player />
    </PlayerMachineContext.Provider>
  );
};

export default App;
