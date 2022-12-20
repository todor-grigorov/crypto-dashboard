import React from "react";
import { ArrowType } from "../../types/ArrowType";
import { CoinType } from "../../types/CoinType";
import { images } from "../imports";

import "./coinCard.css";

interface ParentProps {
  coinType: CoinType;
  coinValue: number;
  isIncreasing: boolean;
  isActive: boolean;
  onClickHandler: (coinType: CoinType) => void;
}

type Props = ParentProps;

const CoinCard: React.FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  return (
    <div
      className={props.isActive ? "cointCard active" : "cointCard"}
      onClick={() => {
        props.onClickHandler(props.coinType);
      }}
    >
      <div className="coinCard__image">
        <img src={images[props.coinType]} alt="coin-name" />
      </div>
      <div className="coinCard__info">
        <div className="coinCard__info-symbol">{props.coinType}</div>
        <div
          className={`coinCard__info-container ${
            props.isIncreasing ? "green" : "red"
          }`}
        >
          <div className="coinCard__info-container__value">
            {props.coinValue}
          </div>
          <div className="coinCard__info-container__sign">
            {props.isIncreasing ? ArrowType.UP_ARROW : ArrowType.DOWN_ARROW}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
