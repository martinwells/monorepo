export const PaymentRegistry = 
{
  "contractName": "PaymentRegistry",
  "abi": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "payments",
      "outputs": [
        {
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "name": "dueDate",
          "type": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "fee",
          "type": "uint256"
        },
        {
          "name": "lastPaymentDate",
          "type": "uint256"
        },
        {
          "name": "claimant",
          "type": "address"
        },
        {
          "name": "executionPeriod",
          "type": "uint256"
        },
        {
          "name": "staked",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "addAuthorizedAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "authorities",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_target",
          "type": "address"
        }
      ],
      "name": "removeAuthorizedAddress",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "authorized",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAuthorizedAddresses",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifer",
          "type": "bytes32"
        }
      ],
      "name": "PaymentCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifer",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "claimant",
          "type": "address"
        }
      ],
      "name": "PaymentClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifer",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "claimant",
          "type": "address"
        }
      ],
      "name": "PaymentClaimantRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifer",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "name": "claimant",
          "type": "address"
        }
      ],
      "name": "PaymentClaimantTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifer",
          "type": "bytes32"
        }
      ],
      "name": "PaymentCancelled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "subscriptionIdentifier",
          "type": "bytes32"
        }
      ],
      "name": "PaymentDeleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "one",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "two",
          "type": "uint256"
        }
      ],
      "name": "Debug",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "target",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "LogAuthorizedAddressAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "target",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "caller",
          "type": "address"
        }
      ],
      "name": "LogAuthorizedAddressRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "name": "_dueDate",
          "type": "uint256"
        },
        {
          "name": "_amount",
          "type": "uint256"
        },
        {
          "name": "_fee",
          "type": "uint256"
        }
      ],
      "name": "createNewPayment",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "name": "_claimant",
          "type": "address"
        },
        {
          "name": "_nextPayment",
          "type": "uint256"
        },
        {
          "name": "_staked",
          "type": "uint256"
        }
      ],
      "name": "claimPayment",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "name": "_claimant",
          "type": "address"
        }
      ],
      "name": "removeClaimant",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        },
        {
          "name": "_claimant",
          "type": "address"
        },
        {
          "name": "_nextPayment",
          "type": "uint256"
        }
      ],
      "name": "transferClaimant",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        }
      ],
      "name": "cancelPayment",
      "outputs": [
        {
          "name": "sucess",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_subscriptionIdentifier",
          "type": "bytes32"
        }
      ],
      "name": "deletePayment",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_subscriptionIdenitifer",
          "type": "bytes32"
        }
      ],
      "name": "getPaymentInformation",
      "outputs": [
        {
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "name": "dueDate",
          "type": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "fee",
          "type": "uint256"
        },
        {
          "name": "lastPaymentDate",
          "type": "uint256"
        },
        {
          "name": "claimant",
          "type": "address"
        },
        {
          "name": "executionPeriod",
          "type": "uint256"
        },
        {
          "name": "staked",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611c2b806100536000396000f3006080604052600436106100db576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306f6e1d4146100e05780630716326d1461015d57806318a494691461022b57806342f1181e14610294578063494503d4146102d75780635cebcef11461034457806363bcd0cc146103cb57806370712939146103fc5780638da5cb5b1461043f57806397206bcc14610496578063b918161114610509578063c46e967814610564578063d070e581146105ad578063d39de6e91461067b578063f2fde38b146106e7575b600080fd5b3480156100ec57600080fd5b506101436004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919050505061072a565b604051808215151515815260200191505060405180910390f35b34801561016957600080fd5b5061018c6004803603810190808035600019169060200190929190505050610a3c565b604051808973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019850505050505050505060405180910390f35b34801561023757600080fd5b5061027a6004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610ac4565b604051808215151515815260200191505060405180910390f35b3480156102a057600080fd5b506102d5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c11565b005b3480156102e357600080fd5b5061030260048036038101908080359060200190929190505050610de1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561035057600080fd5b506103b16004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291908035906020019092919080359060200190929190505050610e1f565b604051808215151515815260200191505060405180910390f35b3480156103d757600080fd5b506103fa6004803603810190808035600019169060200190929190505050611109565b005b34801561040857600080fd5b5061043d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061123f565b005b34801561044b57600080fd5b506104546114e6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104a257600080fd5b506104ef6004803603810190808035600019169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061150b565b604051808215151515815260200191505060405180910390f35b34801561051557600080fd5b5061054a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611689565b604051808215151515815260200191505060405180910390f35b34801561057057600080fd5b5061059360048036038101908080356000191690602001909291905050506116a9565b604051808215151515815260200191505060405180910390f35b3480156105b957600080fd5b506105dc60048036038101908080356000191690602001909291905050506117e7565b604051808973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018881526020018781526020018681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018381526020018281526020019850505050505050505060405180910390f35b34801561068757600080fd5b50610690611951565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156106d35780820151818401526020810190506106b8565b505050509050019250505060405180910390f35b3480156106f357600080fd5b50610728600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506119df565b005b6000806000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561078757600080fd5b60036000886000191660001916815260200190815260200160002091507fad7c87b11456fab3d69245f95442061bce96cb3c345293507ec8bae59023990f6107cd611b34565b86604051808381526020018281526020019250505060405180910390a181600101546107f7611b34565b1015151561080457600080fd5b61080c611b34565b851015151561081a57600080fd5b60008411151561082957600080fd5b60008260050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156108ec578160060154826001015401610880611b34565b1115151561088d57600080fd5b8573ffffffffffffffffffffffffffffffffffffffff168260050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156108eb57600080fd5b5b6000826006015414801561093a575060008260050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b1561095657816001015461094c611b34565b0382600601819055505b81600101549050858260050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508082600401819055508482600101819055508382600701819055507fe6af54b4631f9021dacc3a3dfbd75c8e439edaf3f7747e2dc8154744facdca3187876040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600192505050949350505050565b60036020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154908060020154908060030154908060040154908060050160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060060154908060070154905088565b600080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610b1f57600080fd5b600360008560001916600019168152602001908152602001600020905060008160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008160060181905550600081600701819055507e36a31884c14ae6789a7095a5a78f8f39f48ab94c8cc4c8bb7311e0b99e47be84846040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600191505092915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610c6c57600080fd5b80600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151515610cc657600080fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060028290806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550503373ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f94bb87f4c15c4587ff559a7584006fa01ddf9299359be6b512b94527aa961aca60405160405180910390a35050565b600281815481101515610df057fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610e29611b3c565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515610e8157600080fd5b60007f010000000000000000000000000000000000000000000000000000000000000002876000602081101515610eb457fe5b1a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614151515610f0657600080fd5b60008673ffffffffffffffffffffffffffffffffffffffff1614151515610f2c57600080fd5b610f34611b34565b8510151515610f4257600080fd5b600084111515610f5157600080fd5b600083111515610f6057600080fd5b610100604051908101604052808773ffffffffffffffffffffffffffffffffffffffff168152602001868152602001858152602001848152602001610fa3611b34565b8152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600081525090508060036000896000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506020820151816001015560408201518160020155606082015181600301556080820151816004015560a08201518160050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060c0820151816006015560e082015181600701559050507fc61f43d580c7bdac3fb7dbb43ddf1135629cc850a2618660c7f3d6bd10b92cbc8760405180826000191660001916815260200191505060405180910390a1600191505095945050505050565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561116157600080fd5b600360008260001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090556002820160009055600382016000905560048201600090556005820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556006820160009055600782016000905550507fba5c2fd6f535449eb93b074461826eb133ee0a15312f29081246db49484ac14f8160405180826000191660001916815260200191505060405180910390a150565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561129c57600080fd5b81600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615156112f557600080fd5b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff0219169055600091505b600280549050821015611487578273ffffffffffffffffffffffffffffffffffffffff1660028381548110151561137c57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561147a5760026001600280549050038154811015156113da57fe5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028381548110151561141457fe5b9060005260206000200160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060016002818180549050039150816114749190611bae565b50611487565b8180600101925050611349565b3373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167ff5b347a1e40749dd050f5f07fbdbeb7e3efa9756903044dd29401fd1d4bb4a1c60405160405180910390a3505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000806000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561156857600080fd5b611570611b34565b841015151561157e57600080fd5b600360008760001916600019168152602001908152602001600020915081600101549050806115ab611b34565b038260060181905550848260050160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508082600401819055508382600101819055507f480511a978276dee9b73313b03d2c2f57aa02afa977d1329c626853d0b75c24286866040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a16001925050509392505050565b60016020528060005260406000206000915054906101000a900460ff1681565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151561170357600080fd5b600360008360001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090556002820160009055600382016000905560048201600090556005820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556006820160009055600782016000905550507f5284be3d3122c1ff1d1ae65992c8c6b2808c7cf72b41d299de6cefc638263b448260405180826000191660001916815260200191505060405180910390a160019050919050565b6000806000806000806000806117fb611b3c565b600360008b6000191660001916815260200190815260200160002061010060405190810160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600182015481526020016002820154815260200160038201548152602001600482015481526020016005820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600682015481526020016007820154815250509050806000015181602001518260400151836060015184608001518560a001518660c001518760e001519850985098509850985098509850985050919395975091939597565b606060028054806020026020016040519081016040528092919081815260200182805480156119d557602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001906001019080831161198b575b5050505050905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611a3a57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611a7657600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600042905090565b61010060405190810160405280600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600081525090565b815481835581811115611bd557818360005260206000209182019101611bd49190611bda565b5b505050565b611bfc91905b80821115611bf8576000816000905550600101611be0565b5090565b905600a165627a7a723058209fac8e0c97a94ab6dc9e10e3985c175200ac55b1f1c7944a3d0775fec0b06b9e0029",
  "compiler": {
    "name": "solc",
    "version": "0.4.24+commit.e67f0147.Emscripten.clang"
  },
  "version": "0.1.0",
  "networks": {}
}