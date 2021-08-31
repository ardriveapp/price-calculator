// import { useEffect } from 'react';
// import { useStateValue } from '../state/state';
// import { ArDriveCommunityOracle } from '../utils/ardrive_community_oracle';

export default async function useCommunityTip(): Promise<void> {
	// const [{ arDriveCommunityTip }, dispatch] = useStateValue();
	// useEffect(() => {
	// 	async function setTip() {
	// 		try {
	// 			const communityOracle = new ArDriveCommunityOracle();
	// 			const latestTipPercentage = await communityOracle.setExactTipSettingInBackground();
	// 			console.log('latestTip ', latestTipPercentage);
	// 			dispatch({
	// 				type: 'setArDriveCommunityTip',
	// 				payload: {
	// 					...arDriveCommunityTip,
	// 					tipPercentage: latestTipPercentage
	// 				}
	// 			});
	// 		} catch (error) {
	// 			//This will happen on page refresh, since readContract takes a significant amount of time to run
	// 			console.log('Smartweave readContract aborted');
	// 		}
	// 	}
	// 	setTip();
	// 	// This lint is disabled because the array has to be empty for it to run only once
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
}
