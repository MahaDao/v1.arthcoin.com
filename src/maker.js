import Maker, { USD, DAI } from '@makerdao/dai';
import McdPlugin, { ETH, MKR, BAT } from '@makerdao/dai-plugin-mcd';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import walletLinkPlugin from '@makerdao/dai-plugin-walletlink';
import walletConnectPlugin from '@makerdao/dai-plugin-walletconnect';
import configPlugin from '@makerdao/dai-plugin-config';
import networkConfig from './references/config';
import { networkNameToId } from './utils/network';

let _maker;

export function getMaker() {
  if (_maker === undefined) throw new Error('Maker has not been instatiated');
  return _maker;
}

export async function instantiateMaker({
  rpcUrl,
  network,
  testchainId,
  backendEnv,
  navigation
}) {
  let mainnetAddresses;
  if (network === 'mainnet') {
    // Fallback to kovan if mainnet addresses are not found
    try {
      mainnetAddresses = require('./references/mainnet.json');
    } catch (e) {
      navigation.navigate(
        `${navigation.getCurrentValue().url.pathname}?network=kovan`
      );
      network = 'kovan';
      console.error(e);
    }
  }
  const kovanCdpTypes = [
    { currency: ETH, ilk: 'ETH-A' },
    { currency: BAT, ilk: 'BAT-A' }
  ];

  const mainnetCdpTypes = [
    { currency: ETH, ilk: 'ETH-A' },
    { currency: BAT, ilk: 'BAT-A' }
  ];

  const mcdPluginConfig = {
    cdpTypes: network === 'mainnet' ? mainnetCdpTypes : kovanCdpTypes,
    addressOverrides: network === 'mainnet' ? mainnetAddresses : null,
    prefetch: false
  };

  const config = {
    log: false,
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      walletLinkPlugin,
      walletConnectPlugin,
      [McdPlugin, mcdPluginConfig]
    ],
    smartContract: {
      addContracts: {}
    },
    provider: {
      url: rpcUrl,
      type: 'HTTP'
    },
    web3: {
      pollingInterval: network === 'testnet' ? 100 : null
    },
    multicall: true
  };

  // Use the config plugin, if we have a testchainConfigId
  if (testchainId) {
    delete config.provider;
    config.plugins.push([configPlugin, { testchainId, backendEnv }]);
  } else if (!rpcUrl) {
    rpcUrl = networkConfig.rpcUrls[networkNameToId(network)];
    if (!rpcUrl) throw new Error(`Unsupported network: ${network}`);
    config.provider.url = rpcUrl;
  }

  const maker = await Maker.create('http', config);

  // for debugging
  window.maker = maker;

  return maker;
}

export { USD, DAI, MKR, ETH };
