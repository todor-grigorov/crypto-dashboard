import React, { useState, useEffect } from "react";
import { ArrowType } from "../../types/ArrowType";
import { CoinType } from "../../types/CoinType";
import { images } from "../imports";

import "./coinCard.css";

interface ParentProps {
  coinType: CoinType;
  coinValue: number;
  isActive: boolean;
  onClickHandler: (coinType: CoinType) => void;
}

type Props = ParentProps;

const CoinCard: React.FunctionComponent<Props> = ({
  coinType,
  coinValue,
  isActive,
  onClickHandler,
}: Props): JSX.Element => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    if (coinValue > currentValue) setIsIncreasing(true);
    else setIsIncreasing(false);

    setCurrentValue(coinValue);
  }, [coinValue]);

  return (
    <div
      className={isActive ? "cointCard active" : "cointCard"}
      onClick={() => {
        onClickHandler(coinType);
      }}
    >
      <div className="coinCard__image">
        <img src={images[coinType]} alt="coin-name" />
      </div>
      <div className="coinCard__info">
        <div className="coinCard__info-symbol">{coinType}</div>
        <div
          className={`coinCard__info-container ${
            isIncreasing ? "green" : "red"
          }`}
        >
          <div className="coinCard__info-container__value">{coinValue}</div>
          <div className="coinCard__info-container__sign">
            {isIncreasing ? ArrowType.UP_ARROW : ArrowType.DOWN_ARROW}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
