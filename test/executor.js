import assertRevert from './helpers/assert_revert.js';
import keccak from './helpers/keccak.js';
import { newSubscription, newSubscriptionFull, newPlan } from './helpers/volume_subscription.js';

var MockVolumeSubscription = artifacts.require("./tests/MockVolumeSubscription.sol");
var MockExecutor = artifacts.require("./test/MockExecutor.sol");
var TransferProxy = artifacts.require("./TransferProxy.sol");
var EightExToken = artifacts.require("./EightExToken.sol");
var StakeContract = artifacts.require("./StakeContract.sol");
var MockPaymentRegistryContract = artifacts.require("./test/MockPaymentRegistry.sol");
var MockToken = artifacts.require("./test/MockToken.sol");
var KyberContract = artifacts.require("./test/MockKyberNetworkInterface.sol");
var WrappedEther = artifacts.require("./base/token/WETH.sol");

contract('Executor', function(accounts) {

    let subscriptionContract;
    let proxyContract;
    let stakeContract;
    let paymentRegistryContract;
    let kyberContract;

    let executorContract;
    let nativeTokenContract;
    let wrappedEtherContract;
    let transactingCurrencyContract;

    let contractOwner = accounts[0]; // Admin role
    let business = accounts[1]; // Plan owner that has a plan that costs $100/month
    let etherSubscriber = accounts[2]; // User paying $100/month subscription worth of ETH
    let tokenSubscriber = accounts[3]; // User paying $100/month subscription directly (probably in DAI)
    let serviceNode = accounts[4]; // Collector party claiming payment
    let unauthorisedAddress = accounts[5]; // Some random address
    let competingServiceNode = accounts[6]; // Another collector party claiming payment

    let planIdentifier;

    let planHash;
    let etherSubscriptionHash;
    let tokenSubscriptionHash;

    let subscriptionCost = 10*10**18; // $10.00
    let exchangeRate = 2*10**15; // 0.002 ETH/USD
    let subscriptionEthCost = (subscriptionCost * exchangeRate) / (10**18);

    let subscriptionFee = 10**17; // $0.10
    let subscriptionEthFee = (subscriptionFee * exchangeRate) / (10**18);

    let subscriptionInterval = 30 * 24 * 60 * 60;
    let multiplier = 10;

    let activationTime = parseInt(Date.now() / 1000);
    let oneMonthLater = parseInt(activationTime + subscriptionInterval);

    before(async function() {

        // Initialise the 8x token contract, the owner has all the initial token supply.
        nativeTokenContract = await EightExToken.new({from: contractOwner});

        // Initialise a mock token contract, the owner has the initial supply
        wrappedEtherContract = await WrappedEther.new();
        transactingCurrencyContract = await MockToken.new({from: contractOwner});

        // Initialise all the other contracts the executor needs in order to function
        subscriptionContract = await MockVolumeSubscription.new({from: contractOwner});
        proxyContract = await TransferProxy.new({from: contractOwner});
        stakeContract = await StakeContract.new(nativeTokenContract.address, {from: contractOwner});
        paymentRegistryContract = await MockPaymentRegistryContract.new({from: contractOwner});

        // Initialise the Kyber Network contract and give it 1000 DAI
        kyberContract = await KyberContract.new({from: contractOwner});
        transactingCurrencyContract.transfer(kyberContract.address, 1000*10**18, {from: contractOwner});

        // Initialise the executor contract with all it's needed components
        executorContract = await MockExecutor.new(
            proxyContract.address,
            stakeContract.address,
            paymentRegistryContract.address,
            wrappedEtherContract.address,
            kyberContract.address,
            {from: contractOwner}
        );

        // Add the executor contract as an authorised address for all the different components
        subscriptionContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        proxyContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        stakeContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});
        paymentRegistryContract.addAuthorizedAddress(executorContract.address, {from: contractOwner});

        // Create a new subscription plan
        let newPlan = await subscriptionContract.createPlan(
            business, transactingCurrencyContract.address, "subscription.new", "test", "", subscriptionInterval, subscriptionCost, subscriptionFee, "{}", {from: business}
        );

        // The hash that we can use to identify the plan
        planHash = newPlan.logs[0].args.identifier;

        // Create a new subscription (from a subscriber)
        let newEtherSubscription = await subscriptionContract.createSubscription(
            planHash, "{}", {from: etherSubscriber}
        );

        let newTokenSubscription = await subscriptionContract.createSubscription(
            planHash, "{}", {from: tokenSubscriber}
        );

        // The hash we can use to identify the subscription
        etherSubscriptionHash = newEtherSubscription.logs[0].args.identifier;
        tokenSubscriptionHash = newTokenSubscription.logs[0].args.identifier;

    });

    describe("basic tests", () => {

        it("should throw if someone other than the owner tries to set the multiplier", async function() {

            await assertRevert(executorContract.updateMultiplier(multiplier, {from: unauthorisedAddress}));

        });

        it("should be able to set the multiplier as the owner", async function() {

            await executorContract.updateMultiplier(multiplier, {from: contractOwner});

            let multiplierInContract = await executorContract.currentMultiplier.call();
            assert.equal(multiplierInContract.toNumber(), multiplier);

        });

    })

    describe("when adding or removing an approved contract", () => {

        it("should not be able to add a contract as an unauthorised address", async function() {

           await assertRevert(executorContract.addApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a contract as the owner", async function() {

            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to set a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: unauthorisedAddress}));

        });

        it("should not be able to set call costs for a contract which isn't already authorised", async function() {

            await assertRevert(executorContract.setApprovedContractCallCost("0xabc", 0, 40, 20, 1, {from: contractOwner}));

        });

        it("should be able to set a contract's call costs as the owner", async function() {

            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 40, 20, 1, {from: contractOwner});
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 1, 30, 10, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 40);
            assert.equal(gasCostObject[1], 20);
            assert.equal(gasCostObject[2], 1);

            let secondGasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(secondGasCostObject[0], 30);
            assert.equal(secondGasCostObject[1], 10);
            assert.equal(secondGasCostObject[2], 1);

        });

        it("should not be able to remove a contract's call costs as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract's call costs as an authorised address", async function() {

            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 0, {from: contractOwner});
            await executorContract.removeApprovedContractCallCost(subscriptionContract.address, 1, {from: contractOwner});

            let gasCostObject = await executorContract.approvedContractMapping.call(subscriptionContract.address, 0);
            assert.equal(gasCostObject[0], 0);
            assert.equal(gasCostObject[1], 0);
            assert.equal(gasCostObject[2], 0);

            let gasCostObjectTwo = await executorContract.approvedContractMapping.call(subscriptionContract.address, 1);
            assert.equal(gasCostObjectTwo[0], 0);
            assert.equal(gasCostObjectTwo[1], 0);
            assert.equal(gasCostObjectTwo[2], 0);
        });

        it("should not be able to remove a contract as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedContract(subscriptionContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a contract as the owner", async function() {

            await executorContract.removeApprovedContract(subscriptionContract.address, {from: contractOwner});

            let approvedArray = await executorContract.getApprovedContracts();
            assert.equal(approvedArray.length, 0);

        });

    });

    describe("when adding an approved token", () => {

        it("should not be able to add a token as an unauthorised address", async function() {

            await assertRevert(executorContract.addApprovedToken(transactingCurrencyContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to add a token as an authorised address", async function() {

            await executorContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

            let isApproved = await executorContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            assert(isApproved);

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 1);

        });

        it("should not be able to remove a token as an unauthorised address", async function() {

            await assertRevert(executorContract.removeApprovedToken(transactingCurrencyContract.address, {from: unauthorisedAddress}));

        });

        it("should be able to remove a token as an authorised address", async function() {

            await executorContract.removeApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

            let approvedObject = await executorContract.approvedTokenMapping.call(transactingCurrencyContract.address);
            assert.equal(approvedObject, 0);

            let approvedArray = await executorContract.getApprovedTokens();
            assert.equal(approvedArray.length, 0);

        });

    });

    describe("when users activate subscriptions", () => {

        before(async function() {

            // Transfer wrapped Ether to the subscriber
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            // Give unlimited allowance to the transfer proxy (from subscriber)
            let approvalAmount = 1000000*10**18;
            await wrappedEtherContract.approve(proxyContract.address, approvalAmount, {from: etherSubscriber});
            await transactingCurrencyContract.approve(proxyContract.address, approvalAmount, {from: tokenSubscriber});

        })

        it("should not be able to subscribe to an unauthorized subscription contract", async function() {

            await executorContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

            let fakeSubscriptionContract = await MockVolumeSubscription.new({from: contractOwner});

            let fakePlan = await fakeSubscriptionContract.createPlan(
                business, transactingCurrencyContract.address, "subscription.unauthorised.contract", "test", "", 30, 100, 10, "{}", {from: business}
            );

            let fakePlanHash = fakePlan.logs[0].args.identifier;

            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, true, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(fakeSubscriptionContract.address, fakePlanHash, false, {from: tokenSubscriber}));

            await executorContract.removeApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

        });

        it("should not be able to subscribe to a plan with an unauthorised token contract", async function() {

            // @TODO: Implementation
            // Might need to implement this check in the create plan function in Volume Subscription.

            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 10, 20, 30, {from: contractOwner});

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, true, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, false, {from: tokenSubscriber}));

            await executorContract.removeApprovedContract(subscriptionContract.address, {from: contractOwner});

        });

        it("should not be able to activate a subscription without enough funds", async function() {

            let difference = 10**15;

            // // Subtract from the wallet so insufficient funds are there
            await wrappedEtherContract.withdraw(difference, {from: etherSubscriber});
            await transactingCurrencyContract.transfer(contractOwner, difference, {from: tokenSubscriber});

            // // Make sure the relevant contracts and tokens have been authorised
            await executorContract.addApprovedContract(subscriptionContract.address, {from: contractOwner});
            await executorContract.setApprovedContractCallCost(subscriptionContract.address, 0, 5**10*16, 10**5, 2*10**9);
            await executorContract.addApprovedToken(transactingCurrencyContract.address, {from: contractOwner});

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, true, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, false, {from: tokenSubscriber}));

            // Top up again
            await wrappedEtherContract.deposit({from: etherSubscriber, value: difference});
            await transactingCurrencyContract.transfer(tokenSubscriber, difference, {from: contractOwner});

        });

        it("should be able to subscribe to an authorized subscription and token contract", async function() {

            // Setup the time we want
            await executorContract.setTime(activationTime);
            await subscriptionContract.setTime(activationTime);

            // Activate the subscription with enough funds in wrapper ether account
            await executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, true, {from: etherSubscriber});

            // Activate the subscription with enough funds in the transacting token contract
            await executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, false, {from: tokenSubscriber});

            // Check if there is an element in the payment registry for the ether subscription
            let etherPaymentInfo = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInfo[0], subscriptionContract.address);
            assert.equal(etherPaymentInfo[1].toNumber(), oneMonthLater);
            assert.equal(etherPaymentInfo[2], subscriptionCost);
            assert.equal(etherPaymentInfo[3], 0);
            assert.equal(etherPaymentInfo[4], 0);
            assert.equal(etherPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[5], 0);

            // Check if there is an element in the subscription registry for the token subscription
            let tokenPaymentInfo = await paymentRegistryContract.payments.call(tokenSubscriptionHash);
            assert.equal(tokenPaymentInfo[0], subscriptionContract.address);
            assert.equal(tokenPaymentInfo[1].toNumber(), oneMonthLater);
            assert.equal(tokenPaymentInfo[2], subscriptionCost);
            assert.equal(tokenPaymentInfo[3], 0);
            assert.equal(tokenPaymentInfo[4], 0);
            assert.equal(tokenPaymentInfo[5], 0);
            assert.equal(etherPaymentInfo[5], 0);

            // See if the start date has been set (subcription activated) for the ether subscription
            let etherSubscription = await subscriptionContract.subscriptions.call(etherSubscriptionHash);
            assert.isAbove(etherSubscription[3].toNumber(), 0);

            // See if the start date has been set (subcription activated) for the token subscription
            let tokenSubscription = await subscriptionContract.subscriptions.call(tokenSubscriptionHash);
            assert.isAbove(tokenSubscription[3].toNumber(), 0);

            // Check to ensure the user has an empty wrapped ether wallet
            let userEtherBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            assert.equal(userEtherBalance.toNumber(), 0);

            // Check to ensure the user has an empty token wallet
            let userTokenBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);
            assert.equal(userTokenBalance.toNumber(), 0);

            // Check to make sure the business received their funds from both parties
            let businessBalance = await transactingCurrencyContract.balanceOf(business);
            assert.equal(businessBalance.toNumber(), subscriptionCost * 2);

        });

        it("should not be able subscribe if it has already been activated", async function() {

            // Top up accounts
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost, {from: contractOwner});

            let result = await subscriptionContract.isValidSubscription(etherSubscriptionHash);
            let result2 = await subscriptionContract.isValidSubscription(tokenSubscriptionHash);

            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, etherSubscriptionHash, true, {from: etherSubscriber}));
            await assertRevert(executorContract.activateSubscription(subscriptionContract.address, tokenSubscriptionHash, false, {from: tokenSubscriber}));

            // Reset balance to 0
            await wrappedEtherContract.withdraw(subscriptionEthCost, {from: etherSubscriber});
            await transactingCurrencyContract.transfer(contractOwner, subscriptionCost, {from: tokenSubscriber});
        });

    });

    describe("when service nodes process subscriptions", () => {

        let stakeAmountForTwo = (subscriptionCost * multiplier) * 2;
        let difference = 1000;

        before(async function() {

            // Set the time forward by one month
            await executorContract.setTime(oneMonthLater);
            await subscriptionContract.setTime(oneMonthLater)
            await paymentRegistryContract.setTime(oneMonthLater);

            // Transfer some enough tokens for cost and fee for the service node
            await wrappedEtherContract.deposit({from: etherSubscriber, value: subscriptionEthCost + subscriptionEthFee});
            await transactingCurrencyContract.transfer(tokenSubscriber, subscriptionCost + subscriptionFee, {from: contractOwner});

        });

        it("should not be able to process an inactive subscription", async function() {

            // This will have a different hash since the timestamp is different
            let inactiveEtherSubscription = await subscriptionContract.createSubscription(
                planHash, "{}", {from: etherSubscriber}
            );

            let inactiveTokenSubscription = await subscriptionContract.createSubscription(
                planHash, "{}", {from: tokenSubscriber}
            );

            // The hash we can use to identify the subscription
            let inactiveEtherSubscriptionHash = inactiveEtherSubscription.logs[0].args.identifier;
            let inactiveTokenSubscriptionHash = inactiveTokenSubscription.logs[0].args.identifier;

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, inactiveEtherSubscriptionHash, true, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, inactiveTokenSubscriptionHash, false, {from: serviceNode}));

        });

        it("should not be able to process a subscription before the due date", async function() {

            // Set the time right before the due date
            await executorContract.turnBackTime(5);
            await subscriptionContract.turnBackTime(5);
            await paymentRegistryContract.turnBackTime(5);

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, true, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, false, {from: serviceNode}));

            await executorContract.turnBackTime(-5);
            await subscriptionContract.turnBackTime(-5);
            await paymentRegistryContract.turnBackTime(-5);

        });

        it("should not be able to process a subscription if the service node does not have any staked tokens", async function() {

            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, true, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, false, {from: serviceNode}));

        });

        it("should not be able to process a subscription if the service node does not have enough staked tokens", async function() {

            // Transfer $10 * multiplier * 2 worth of 8x tokens
            await nativeTokenContract.transfer(serviceNode, stakeAmountForTwo, {from: contractOwner});

            // Approve the stake contract to take 8x tokens from the service node
            await nativeTokenContract.approve(stakeContract.address, stakeAmountForTwo, {from: serviceNode});

            // Top up your stake in the stake contract less 1000
            await stakeContract.topUpStake(difference, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(serviceNode.address);
            assert.equal(balance, difference);

            // Should fail when collecting payment since there aren't enough tokens staked
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, true, {from: serviceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, false, {from: serviceNode}));

        });

        it("should be able to process a valid subscription", async function() {

            // Check to ensure the user has enough funds
            let preUserEthBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            let preUserTokenBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);

            assert.equal(preUserBalance.toNumber(), subscriptionCost);
            assert.equal(preUserBalance.toNumber(), subscriptionEthCost);

            // Top up stake by difference
            await stakeContract.topUpStake(stakeAmountForTwo - 1000, {from: serviceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(serviceNode.address);
            assert.equal(balance, stakeAmountForTwo);

            // Should be able to process now that the service node has enough staked tokens
            await executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, true, {from: serviceNode});
            await executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, false, {from: serviceNode});

            // Check the payments registry has been updated
            let etherPaymentInformation = await paymentRegistryContract.payments.call(etherSubscriptionHash);
            assert.equal(etherPaymentInformation[0], subscriptionContract.address);
            assert.equal(etherPaymentInformation[1], oneMonthLater + subscriptionInterval);
            assert.equal(etherPaymentInformation[2], subscriptionCost);
            assert.equal(etherPaymentInformation[3], oneMonthLater);
            assert.equal(etherPaymentInformation[4], serviceNode);
            assert.equal(etherPaymentInformation[5], 0); // We claimed it straight away
            assert.equal(etherPaymentInformation[6], 10);

            let tokenPaymentInformation = await paymentRegistryContract.payments.call(tokenSubscriptionHash);
            assert.equal(tokenPaymentInformation[0], subscriptionContract.address);
            assert.equal(tokenPaymentInformation[1], oneMonthLater + subscriptionInterval);
            assert.equal(tokenPaymentInformation[2], subscriptionCost);
            assert.equal(tokenPaymentInformation[3], oneMonthLater);
            assert.equal(tokenPaymentInformation[4], serviceNode);
            assert.equal(tokenPaymentInformation[5], 0); // We claimed it straight away
            assert.equal(tokenPaymentInformation[6], 10);

            // Check if the service node got their reward, gas costs reimbursed and tokens locked up
            let serviceNodeStakeBalance = await stakeContract.getAvailableStake(serviceNode);
            assert.equal(serviceNodeStakeBalance.toNumber(), 0);

            // @TODO: Value for gas needs to be reimbursed

            // Check if the balance of the user was subtracted
            let postEtherUserBalance = await wrappedEtherContract.balanceOf(etherSubscriber);
            let postTokenUserBalance = await transactingCurrencyContract.balanceOf(tokenSubscriber);
            assert.equal(postEtherUserBalance.toNumber(), 0);
            assert.equal(postTokenUserBalance.toNumber(), 0);

            // Check if the businesses' account was credited
            let postBusinessBalance = await transactingCurrencyContract.balanceOf(business);
            assert.equal(postBusinessBalance.toNumber(), (subscriptionCost - fee) * 2);

        });

        it("should not be able to process a subscription once it has already been processed", async function() {

            // Transfer some tokens to a competing service node
            let amount = stakeAmountForTwo / 2;
            await nativeTokenContract.transfer(competingServiceNode, amount, {from: contractOwner});

            // Approve the stake contract to take 8x tokens from you
            await nativeTokenContract.approve(stakeContract.address, amount, {from: competingServiceNode});

            // Top up your stake in the stake contract
            await stakeContract.topUpStake(amount, {from: competingServiceNode});

            // Check the balance to ensure it topped up the correct amount
            let balance = await stakeContract.getAvailableStake(competingServiceNode);
            assert.equal(balance, amount);

            // Should fail when collecting payment since it has already been claimed/processed
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, etherSubscriptionHash, true, {from: competingServiceNode}));
            await assertRevert(executorContract.collectPayment(subscriptionContract.address, tokenSubscriptionHash, false, {from: competingServiceNode}));

        });

    });

    describe("when service nodes cancel a subscription", () => {

        it("should not be able to if the due date has already passed", async function() {

            // @TODO: Implementation

        });

        it("should be able to before the due date", async function() {

            // @TODO: Implementation

        });

    });

    describe("when businesses cancel a subscription", () => {

        it("should not be able to cancel to an unauthorised subscription contract", async function() {

            // @TODO: Protocol

        });

        it("should not be able to as an unauthorised user", async function() {

            // @TODO: Implementation

        });

    });

    describe("when users don't have enough funds in their wallet", () => {

        it("should not allow the subscription to be processed", async function() {

            // @TODO: Implementation

        });

        it("should cancel the subscription", async function() {

            // @TODO: Implementation

        });

    });

});