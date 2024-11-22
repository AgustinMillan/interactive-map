import MapView from "./components/mapView";
import { DateFilterProvide } from "./context/dateFilter.context";

const App = () => {
  return (
    <DateFilterProvide>
      <MapView />
    </DateFilterProvide>
  );
};

export default App;
