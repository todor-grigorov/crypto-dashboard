import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../redux/hooks";
import {
  TickerDisplayState,
  TickerState,
} from "../../redux/slices/tickerSlice";
import { ITickerData, TickerService } from "../../services/TickerService";
import { CoinType } from "../../types/CoinType";
import config from "../../configs/config";
import { images } from "../imports";
import "./ticker.css";

const names: { [key: string]: string } = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  UDC: "US-DC",
};

const tickerDisplayFields = [
  { field: "LOW", label: "24h Low" },
  { field: "HIGH", label: "24h High" },
  { field: "VOLUME", label: "24 Volume" },
  { field: "DAILY_CHANGE", label: "24h Change" },
];

interface ParentProps {}

type Props = ParentProps;

const Ticker: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const [coinType, setCoinType] = useState<CoinType>();
  // const [tickerData, setTickerData] = useState<TickerDisplayState>();
  const [currDate, setCurrDate] = useState(new Date());
  const [tickerData, setTickerData] = useState<ITickerData>();
  const [service, setService] = useState<TickerService>();
  const tickerState = useAppSelector((state) => state.ticker);
  const currency = useAppSelector((state) => state.currency.value);

  const tickerService = useCallback(() => {
    const service = new TickerService("ticker", currency, config.urls.wsUrl);
    service.start(setTickerData);
    return service;
  }, []);

  useEffect(() => {
    setService(tickerService());

    const timerId = setInterval(() => {
      setCurrDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    setCoinType(currency);
    // setTickerData(tickerState);
  }, [currency, tickerState]);

  useEffect(() => {
    console.log(tickerData);
  }, [tickerData]);

  return (
    <div className="ticker">
      <div className="ticker__presentation">
        <div className="ticker__presentation-image">
          {coinType ? <img src={images[coinType]} alt="coin-name" /> : null}
        </div>
        <div className="ticker__presentation-name">
          {coinType ? <p>{names[coinType].toLocaleUpperCase()}</p> : null}
        </div>
      </div>

      <div className="ticker__data">
        {tickerDisplayFields.map((data) => (
          <div key={data.field} className="ticker__data-container">
            <div className="ticker__data-container-label">
              <p>
                {data.label} <span>: </span>
              </p>
            </div>

            <div className="ticker__data-container-value">
              ${/* {tickerData && tickerData.hasOwnProperty(data.field) */}
              {tickerData && tickerData.hasOwnProperty(data.field)
                ? tickerData[data.field as keyof ITickerData]
                : null}
            </div>
          </div>
        ))}
      </div>

      <div className="ticker__clock">
        <p>{currDate.toUTCString()}</p>
      </div>
    </div>
  );
};

export default React.memo(Ticker);
