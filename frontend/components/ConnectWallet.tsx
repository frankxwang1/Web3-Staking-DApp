'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button 
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition shadow-lg"
    >
      Connect Wallet
    </button>
  );
}
