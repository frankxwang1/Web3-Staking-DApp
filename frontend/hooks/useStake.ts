export const useStake = () => {
  const stake = async (amount: string) => {
    console.log('Staking:', amount);
    // TODO: Implement staking with wagmi
  };

  return { stake };
};
