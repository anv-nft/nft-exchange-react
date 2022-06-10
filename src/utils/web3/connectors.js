import {InjectedConnector} from "@web3-react/injected-connector";
import {KaikasConnector} from "kaikas-connector";

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42]
});

export const kaikasConnector = new KaikasConnector({
    supportedChainIds: [1001, 8217]
});