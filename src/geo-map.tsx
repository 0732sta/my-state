import { useEffect, useRef, useState } from "react";
import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

export default function Map() {
  const chartRef = useRef();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/markmarkoh/datamaps/master/src/js/data/mys.topo.json"
    )
      .then((response) => response.json())
      .then((value) => {
        setData(
          (ChartGeo.topojson.feature(value, value.objects.mys) as any).features
        );
      });
  }, []);

  return (
    <Chart
      ref={chartRef}
      type="choropleth"
      data={{
        labels: data.map((d: any) => d.properties.name),
        datasets: [
          {
            outline: data,
            label: "Dataset 1",
            data: data.map((d: any) => ({
              feature: d,
              value: Math.random() * 10
            }))
            // backgroundColor: ["#94BA62", "#59A22F", "#1A830C"]
          },
          {
            outline: data,
            label: "Dataset 2",
            data: data.map((d: any) => ({
              feature: d,
              value: Math.random() * 10
            }))
            // backgroundColor: ["#94BA62", "#59A22F", "#1A830C"]
          }
        ]
      }}
      options={{
        showOutline: true,
        showGraticule: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${context.element.feature.properties.name} - ${context.dataset.label}: ${context.formattedValue}`;
              }
            }
          },
          legend: {
            display: true
          }
        },
        hover: {
          mode: "nearest"
        },
        scales: {
          xy: {
            projection: "mercator"
          }
          // Hide color scale
          // color: {
          //   display: false
          // }
        }
      }}
    />
  );
}
