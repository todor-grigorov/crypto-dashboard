import { ISocketMessage } from "../../interfaces/ISocketMessage";
import { RootState } from "../store";

const onTickerMessage = (socket: WebSocket) => {
    return new Promise((resolve, reject) => {
        socket.onmessage = (message: any) => {
            console.log(message?.data);
            resolve(message?.data);
        }
    });
}

export const subscribeTicker = (socket: WebSocket, symbol: string) => (dispatch: (data: any) => void, getState: () => RootState) => {
    const state = getState();
    const chanId = state.ticker.chanId;
    const type = state.currency.value;
    let msg = JSON.stringify({
        event: "unsubscribe",
        channel: "ticker",
        symbol: `t${type}USD`,
    } as ISocketMessage);

    if (chanId) {
        socket.send(msg);
        let response;
        onTickerMessage(socket).then(res => response = res);
        console.log(response);
        dispatch(response);
    } else {
        msg = JSON.stringify({
            event: "subscribe",
            channel: "ticker",
            symbol: "tBTCUSD",
        } as ISocketMessage);

        socket.send(msg);
        let response;
        onTickerMessage(socket).then(res => response = res);
        console.log(response);
        dispatch(response);
    }
}