const fs = require('fs-extra');

const Tokens = require("../../artifacts/src/addresses/tokens");
const Dependencies = require("../../artifacts/src/addresses/dependencies");

const Constants = require("./migration_constants");

module.exports = function(deployer, network, accounts) {

    console.log(`Using network: ${network}`);

    if (network == 'develop') {
        return;
    }

    const TransferProxy = artifacts.require("./TransferProxy.sol");
    const ApprovedRegistry = artifacts.require("./ApprovedRegistry.sol");
    const PaymentRegistry = artifacts.require("./PaymentRegistry.sol");
    const StakeContract = artifacts.require("./StakeContract.sol");
    const Requirements = artifacts.require("./Requirements.sol");
    const VolumeSubscription = artifacts.require("./VolumeSubscription.sol");
    const Executor = artifacts.require("./Executor.sol");
    const EightExToken = artifacts.require("./EightExToken.sol");

    const MockToken = artifacts.require("./test/MockToken.sol");
    const MockKyberNetwork = artifacts.require("./test/MockKyberNetwork.sol");

    return deployer.then(async () => {

        let executor;
        let volumeSubscription;
        let approvedRegistry;

        let transferProxy = await deployer.deploy(TransferProxy);
        let paymentRegistry = await deployer.deploy(PaymentRegistry);
        let requirementsContract = await deployer.deploy(Requirements);

        let eightExToken = await deployer.deploy(EightExToken);
        let stakeContract = await deployer.deploy(StakeContract, eightExToken.address);

        let kyberNetworkAddress = Dependencies.KyberNetwork[network] || (await deployer.deploy(MockKyberNetwork)).address;
        let daiAddress = Tokens.DAI.addresses[network] || (await deployer.deploy(MockToken)).address;

        // Deploy the Approved Registry with Kyber Network
        approvedRegistry = await deployer.deploy(ApprovedRegistry, kyberNetworkAddress);

        // Deploy the Volume Subscription contract with the Approved Registry
        volumeSubscription = await deployer.deploy(VolumeSubscription, approvedRegistry.address);

        // Add Dai to the approved token token registry
        await approvedRegistry.addApprovedToken(daiAddress, false)

        // Add Volume Subscription as an approved contract
        await approvedRegistry.addApprovedContract(volumeSubscription.address);

        // Deploy the executor contract
        executor = await deployer.deploy(
            Executor,
            transferProxy.address,
            stakeContract.address,
            paymentRegistry.address,
            approvedRegistry.address,
            requirementsContract.address,
            Constants.LOCK_UP_PERCENTAGE,
            Constants.MAXIMUM_INTERVAL_DIVISOR
        );

        // Export JSON

        let file = Constants.configPath();
        fs.ensureFileSync(file)

        const contractsJson = fs.readJsonSync(file, { throws: false }) || {};

        let output = {
            'addresses': [
                {
                    'name': 'Executor',
                    'address': executor.address
                },
                {
                    'name': 'VolumeSubscription',
                    'address': volumeSubscription.address
                },
                {
                    'name': 'ApprovedRegistry',
                    'address': approvedRegistry.address
                },
                {
                    'name': 'TransferProxy',
                    'address': transferProxy.address
                },
                {
                    'name': 'PaymentRegistry',
                    'address': paymentRegistry.address
                },
                {
                    'name': 'Requirements',
                    'address': requirementsContract.address
                },
                {
                    'name': 'EightExToken',
                    'address': eightExToken.address
                },
                {
                    'name': 'StakeContract',
                    'address': stakeContract.address
                },
                {
                    'name': 'KyberNetwork',
                    'address': kyberNetworkAddress
                }
            ],
            'approvedTokens': [
                {
                    'ticker': 'DAI',
                    'address': daiAddress
                }
            ],
            'approvedContracts': [
                {
                    'name': 'VolumeSubscription',
                    'address': volumeSubscription.address
                }
            ],
            lockUpPercentage: Constants.LOCK_UP_PERCENTAGE,
            maximumIntervalDivisor: Constants.MAXIMUM_INTERVAL_DIVISOR,
        };

        contractsJson[network] = output;

        await fs.outputFile(file, JSON.stringify(contractsJson, null, 2));
    });

};
