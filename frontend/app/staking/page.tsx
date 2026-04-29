import ConnectWallet from '@/components/ConnectWallet';
import StakePanel from '@/components/StakePanel';
import WithdrawPanel from '@/components/WithdrawPanel';
import RewardInfo from '@/components/RewardInfo';

export default function StakingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold">Staking Dashboard</h1>
        <ConnectWallet />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <StakePanel />
          <WithdrawPanel />
        </div>
        <div>
          <RewardInfo />
        </div>
      </div>
    </div>
  );
}
