import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useDispatch } from "react-redux";
import config from "../../configs/config";
import { useAppSelector } from "../../redux/hooks";
import {
  addChartData,
  addSnapshotCharts,
  setLoading,
} from "../../redux/slices/chartsSlice";
import { WebSocketData } from "../../services/BaseWebSocketService";
import { ChartService, IChartResponse } from "../../services/ChartService";
import { CoinType } from "../../types/CoinType";
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
  const [chartUpdates, setChartUpdates] =
    useState<WebSocketData<IChartResponse>>();
  const [ChartSnapshot, setChartSnapshot] =
    useState<WebSocketData<IChartResponse>>();
  const [service, setService] = useState<ChartService>();

  const chartsState = useAppSelector((state) => state.charts.candles);

  const currency = useAppSelector((state) => state.currency.value);
  const dispatch = useDispatch();

  const serviceConnect = useCallback((currCurrency: CoinType) => {
    const initService = new ChartService(
      setChartUpdates,
      "candles",
      currCurrency,
      config.urls.wsUrl,
      undefined,
      setChartSnapshot
    );

    initService.start();
    setService(initService);
  }, []);

  useEffect(() => {
    if (!ChartSnapshot) return;

    dispatch(addSnapshotCharts(ChartSnapshot));
    dispatch(setLoading(false));
  }, [ChartSnapshot, dispatch]);

  useEffect(() => {
    if (!chartUpdates) return;

    dispatch(addChartData(chartUpdates));
  }, [chartUpdates, dispatch]);

  /**
   * Unsunscribe to current currency pair and subscribe to the new pair
   */
  useEffect(() => {
    if (!service) return;

    service?.unSubscribe();
    dispatch(setLoading(true));
    service?.reconnect(currency);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, dispatch]);

  useEffect(() => {
    serviceConnect(currency);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        series={makeChartData}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default React.memo(Chart);
