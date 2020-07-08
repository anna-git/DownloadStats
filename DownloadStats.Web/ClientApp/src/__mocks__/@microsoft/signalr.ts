let SignalR = jest.genMockFromModule("@microsoft/signalr");

class HubConnection {

    public on = jest.fn().mockImplementation((methodName: string, callback: () => string) => {
        this.successCallback = callback;
        return Promise.resolve();
    });

    public start(): Promise<void> { return Promise.resolve() }

    public successCallback: () => string = () => "failure";
}

let hubConnection = new HubConnection();

let HubConnectionBuilder = () => ({
    withUrl: (url) => ({
        build: () => hubConnection
    })
});

SignalR = {
    HubConnectionBuilder: HubConnectionBuilder,
    HubConnection: hubConnection
};

module.exports = SignalR;