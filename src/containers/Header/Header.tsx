import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import TranslateIcon from "@mui/icons-material/Translate";

import { CoinType } from "../../types/CoinType";
import CoinCard from "../../components/CoinCard/CoinCard";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrency } from "../../redux/slices/currencySlice";
import config from "../../configs/config";
import { ITickerData, TickerService } from "../../services/TickerService";
import "./Header.css";

const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [btcService, setBtcService] = useState<TickerService>();
  const [ethService, setEthService] = useState<TickerService>();
  const [solService, setSolService] = useState<TickerService>();
  const [udcService, setUdcService] = useState<TickerService>();

  const [btcData, setBtcData] = useState<ITickerData>();
  const [ethData, setEthData] = useState<ITickerData>();
  const [solData, setSolData] = useState<ITickerData>();
  const [udcData, setUdcData] = useState<ITickerData>();

  const currency = useAppSelector((state) => state.currency.value);

  const [activeCurrency, setActiveCurrency] = useState(currency);

  /**
   * Gets Dispatch function that stores the state for a coresponding coin (currency pair)
   * @param type type CoinType
   * @returns Dispatch function that stores the state for a coresponding coin (currency pair)
   */
  const getStateHandler = (
    type: CoinType
  ): Dispatch<React.SetStateAction<ITickerData | undefined>> | null => {
    switch (type) {
      case CoinType.BTC:
        return setBtcData;
      case CoinType.ETH:
        return setEthData;
      case CoinType.SOL:
        return setSolData;
      case CoinType.UDC:
        return setUdcData;

      default:
        return null;
    }
  };

  /**
   * Gets value (Last price) of coin (currency pair) based on CoinType
   * @param type CoinType
   * @returns number, which is the currency pair Last price
   */
  const getCoinValue = (type: CoinType): number => {
    switch (type) {
      case CoinType.BTC:
        return btcData?.LAST_PRICE || 0;
      case CoinType.ETH:
        return ethData?.LAST_PRICE || 0;
      case CoinType.SOL:
        return solData?.LAST_PRICE || 0;
      case CoinType.UDC:
        return udcData?.LAST_PRICE || 0;

      default:
        return 0;
    }
  };

  /**
   * Sets Active currency when changed
   */
  useEffect(() => {
    setActiveCurrency(currency);
    console.log(currency);
  }, [currency]);

  /**
   * Initial start of all WS connections for all CoinCards
   */
  useEffect(() => {
    Object.values(CoinType).forEach((type) => {
      const service = new TickerService(
        getStateHandler(type),
        "ticker",
        type,
        config.urls.wsUrl
      );
      service.start();
    });
  }, []);

  /**
   * CoinCard click handler
   * @param coinType CoinType
   */
  const coinCardClickHandler = (coinType: CoinType): void => {
    setActiveCurrency(coinType);
    dispatch(setCurrency(coinType));
    navigate(`/${coinType.toLocaleLowerCase()}`);
  };

  return (
    <div className="header">
      <div className="header__left">
        <IconButton aria-label="menu" size="medium" style={{ color: "#fff" }}>
          <MenuIcon fontSize="inherit" />
        </IconButton>

        <div className="header__left-image">
          <img
            src="https://assets-test.deribit.com/static/media/logo-theme-dark-test.031cb4550cff9f5f7b78ba3c113872ee.svg"
            alt="Deribit"
          />
        </div>

        <div className="header__left-coins">
          {Object.values(CoinType).map((type) => (
            <CoinCard
              key={type}
              coinType={type}
              coinValue={getCoinValue(type)}
              isActive={type === activeCurrency}
              onClickHandler={coinCardClickHandler}
            />
          ))}
        </div>
      </div>

      <div className="header__right">
        <div className="header__right-item">
          <IconButton
            aria-label="notification"
            size="small"
            style={{ color: "#fff" }}
          >
            <NotificationsNone fontSize="inherit" />
          </IconButton>
        </div>

        <div className="header__right-item">
          <IconButton
            aria-label="settings"
            size="small"
            style={{ color: "#fff" }}
          >
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div className="header__right-item">
          <IconButton
            aria-label="settings"
            size="small"
            style={{ color: "#fff" }}
          >
            <TranslateIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div className="header__right-item">
          <Button
            style={{
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            Register
          </Button>
        </div>

        <div className="header__right-item">
          <Button
            variant="contained"
            style={{
              color: "#fff",
              backgroundColor: "#00cfbe",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
