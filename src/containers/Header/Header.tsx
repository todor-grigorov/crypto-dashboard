import React, { useState, useEffect, useCallback } from "react";
import { Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import TranslateIcon from "@mui/icons-material/Translate";
import { useSocket } from "../../hooks/useSocket";
import { CoinType } from "../../types/CoinType";
import CoinCard from "../../components/CoinCard/CoinCard";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCurrency } from "../../redux/slices/currencySlice";

const Header = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const navigate = useNavigate();

  const tickerId = useAppSelector((state) => state.ticker.chanId);
  const orderBookId = useAppSelector((state) => state.orderBook.chanId);
  const tradesId = useAppSelector((state) => state.trades.chanId);
  const chartsId = useAppSelector((state) => state.charts.chanId);
  const currency = useAppSelector((state) => state.currency.value);

  const [activeCurrency, setActiveCurrency] = useState(currency);

  useEffect(() => {
    setActiveCurrency(currency);
    console.log(currency);
  }, [currency]);

  const coinCardClickHandler = (coinType: CoinType): void => {
    setActiveCurrency(coinType);
    dispatch(setCurrency(coinType));
    navigate(`/${coinType.toLocaleLowerCase()}`);
    socket.unsubscribeAllChannels([tickerId, orderBookId, tradesId, chartsId]);
    socket.subscribeAllChannels(coinType);
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
              coinValue={324.67}
              isIncreasing={true}
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
