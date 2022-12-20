import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../redux/hooks";
import "./chart.css";

const options = {
  chart: {
    type: "candlestick",
    height: 350,
  },
  title: {
    text: "CandleStick Chart",
    align: "left",
    style: {
      color: "#ffa500",
    },
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    labels: {
      style: {
        colors: "#ffa500",
      },
    },
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
    labels: {
      style: {
        colors: "#ffa500",
      },
    },
  },
} as ApexCharts.ApexOptions;

interface ParentProps {}

type Props = ParentProps;

const Chart: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const chartsState = useAppSelector((state) => state.charts.candles);

  const [chartData, setChartData] = useState<ApexAxisChartSeries>([
    { data: [] },
  ]);

  useEffect(() => {
    const data = makeChartData;
    setChartData(data);

    return () => {};
  }, [chartsState]);

  const makeChartData = useMemo((): ApexAxisChartSeries => {
    let series: ApexAxisChartSeries = [{ data: [] }];

    series[0].data = chartsState.map((candle) => {
      return {
        // x: new Date(candle.mts),
        x: candle.mts,
        y: [candle.open, candle.high, candle.low, candle.close],
      };
    });

    return series;
  }, [chartsState]);

  return (
    <div className="chart">
      <ReactApexChart
        options={options}
        series={chartData}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default React.memo(Chart);
