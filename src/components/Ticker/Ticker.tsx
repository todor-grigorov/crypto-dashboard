import React, { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../redux/hooks";
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

const Ticker: React.FunctionComponent<Props> = (): JSX.Element => {
  const [coinType, setCoinType] = useState<CoinType>();
  const [currDate, setCurrDate] = useState(new Date());
  const [tickerData, setTickerData] = useState<ITickerData>();
  const [service, setService] = useState<TickerService>();
  const currency = useAppSelector((state) => state.currency.value);

  /**
   * UseCallbac for starting and subscribing to Ticker Websocket Service
   */
  const tickerService = useCallback(() => {
    const service = new TickerService(
      setTickerData,
      "ticker",
      currency,
      config.urls.wsUrl
    );
    service.start();
    return service;
  }, []);

  /**
   * Unsunscribe to current currency pair and subscribe to the new pair
   */
  useEffect(() => {
    setCoinType(currency);
    service?.unSubscribe();
    service?.reconnect(currency);
  }, [currency]);

  /**
   * Initial subscribtion to WebSocket and timer logic - on Component Did Mount
   */
  useEffect(() => {
    setService(tickerService());

    const timerId = setInterval(() => {
      setCurrDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

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
