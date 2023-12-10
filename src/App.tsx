import Player from "./components/Player";
import { PlayerMachineContext } from "./machines/playerMachine";

export const App = () => {
  return (
    <PlayerMachineContext.Provider>
      <Player />
    </PlayerMachineContext.Provider>
  );
};

export default App;
