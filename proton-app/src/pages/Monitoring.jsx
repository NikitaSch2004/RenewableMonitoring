import Chart from "../components/Chart";
import TurbineList from "../components/TurbineList";

export default function Monitoring() {
  return (
    <div className="flex flex-col space-y-8">
      <Chart/>
      <TurbineList />
    </div>
  );
}
