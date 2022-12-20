export interface ISocketMessage {
    event: string;
    channel: string;
    symbol?: string;
    key?: string;
}