'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther } from 'viem';
import { CONFIG } from '@/lib/config';
import STAKING_ABI from '@/abi/staking.json';
import { Coins, TrendingUp, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function RewardInfo() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<'idle' | 'signing' | 'pending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: hash, writeContract, isPending: isSigning, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, isError, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  // Read balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONFIG.STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!address,
    }
  });

  // Read earned rewards
  const { data: earned, refetch: refetchEarned } = useReadContract({
    address: CONFIG.STAKING_CONTRACT_ADDRESS as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'earned',
    args: [address],
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    }
  });

  useEffect(() => {
    if (isSigning) setStatus('signing');
    else if (isConfirming) setStatus('pending');
    else if (isSuccess) {
      setStatus('success');
      refetchBalance();
      refetchEarned();
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    } else if (isError || writeError) {
      setStatus('error');
      setErrorMsg(writeError?.message || confirmError?.message || 'Transaction failed');
    }
  }, [isSigning, isConfirming, isSuccess, isError, writeError, confirmError, refetchBalance, refetchEarned]);

  const handleClaim = () => {
    if (!isConnected) return;
    setErrorMsg('');
    writeContract({
      address: CONFIG.STAKING_CONTRACT_ADDRESS as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'claimReward',
    });
  };

  return (
    <div className="p-8 border rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <TrendingUp className="text-blue-600 w-6 h-6" />
        Rewards Dashboard
      </h2>
      
      <div className="space-y-6 flex-grow">
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="text-gray-400 w-5 h-5" />
            <span className="text-gray-500 font-semibold text-sm">Total Staked</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {balance ? Number(formatEther(balance as bigint)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
            </span>
            <span className="text-gray-400 font-bold">TOKEN</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-500 w-5 h-5" />
            <span className="text-gray-500 font-semibold text-sm">Pending Rewards</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-green-600">
              {earned ? Number(formatEther(earned as bigint)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : '0.00'}
            </span>
            <span className="text-gray-400 font-bold text-sm">REWARD</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 italic">每秒持续产生收益...</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button 
          onClick={handleClaim}
          disabled={!isConnected || status === 'signing' || status === 'pending' || !earned || (earned as bigint) === 0n}
          className={`w-full font-bold py-5 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 ${
            status === 'signing' || status === 'pending'
              ? 'bg-blue-200 text-blue-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-95'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          {(status === 'signing' || status === 'pending') && <Loader2 className="animate-spin w-5 h-5" />}
          {status === 'signing' ? '请在钱包签名...' : status === 'pending' ? '发放奖励中 (Pending)...' : 'Claim Rewards Now'}
        </button>

        {status === 'success' && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-xl flex items-center gap-2 text-green-800 animate-bounce-short">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold">领取成功！</span>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-xl flex items-start gap-2 text-red-800">
            <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-xs font-medium break-all">{errorMsg.slice(0, 80)}...</div>
          </div>
        )}
      </div>
    </div>
  );
}
