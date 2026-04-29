'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONFIG } from '@/lib/config';
import STAKING_ABI from '@/abi/staking.json';
import { Loader2, ArrowDownCircle, XCircle, CheckCircle2, Wallet } from 'lucide-react';

export default function WithdrawPanel() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'signing' | 'pending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { isConnected } = useAccount();
  const { data: hash, writeContract, isPending: isSigning, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, isError, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSigning) setStatus('signing');
    else if (isConfirming) setStatus('pending');
    else if (isSuccess) {
      setStatus('success');
      setAmount('');
      const timer = setTimeout(() => setStatus('idle'), 5000);
      return () => clearTimeout(timer);
    } else if (isError || writeError) {
      setStatus('error');
      setErrorMsg(writeError?.message || confirmError?.message || 'Transaction failed');
    }
  }, [isSigning, isConfirming, isSuccess, isError, writeError, confirmError]);

  const handleWithdraw = async () => {
    if (!amount || !isConnected) return;
    setErrorMsg('');

    try {
      writeContract({
        address: CONFIG.STAKING_CONTRACT_ADDRESS as `0x${string}`,
        abi: STAKING_ABI,
        functionName: 'withdraw',
        args: [parseEther(amount)],
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send transaction');
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ArrowDownCircle className="text-red-500 w-5 h-5" />
          Withdraw Tokens
        </h2>
      </div>

      {!isConnected ? (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 mb-4">
          <Wallet className="text-orange-500 w-5 h-5 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">钱包未连接</p>
            <p className="text-xs text-orange-600">请先连接钱包以进行提取操作。</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              value={amount}
              disabled={status === 'signing' || status === 'pending'}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-lg font-medium text-black focus:border-red-500 focus:bg-white outline-none transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">TOKEN</span>
          </div>

          <button 
            onClick={handleWithdraw}
            disabled={!isConnected || status === 'signing' || status === 'pending' || !amount}
            className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${
              status === 'signing' || status === 'pending' 
                ? 'bg-blue-100 text-blue-500' 
                : 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {(status === 'signing' || status === 'pending') && <Loader2 className="animate-spin w-5 h-5" />}
            {status === 'signing' ? '等待钱包签名...' : status === 'pending' ? '交易确认中 (Pending)...' : 'Withdraw Now'}
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">提取成功！资金已退回您的钱包。</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 animate-in fade-in slide-in-from-top-2">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold">操作失败</p>
            <p className="break-all opacity-80">{errorMsg.slice(0, 100)}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
