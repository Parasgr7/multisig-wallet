// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./MultiSigFactory.sol";

contract MultiSigWallet {

    address admin;
    address factoryContractAddress;
    uint depositId;
    uint withdrawalId;
    uint transferId;
    string[] tokenList;

    constructor(address _factoryContractAddress) {
        admin = msg.sender;
        tokenList.push("ETH");
        factoryContractAddress = _factoryContractAddress;
    }

    mapping(address => mapping(address => mapping(string => uint))) balance;
    mapping(address => mapping(uint => bool)) approvals;
    mapping(string => Token) tokenMapping;

    struct Token {

        string ticker;
        address tokenAddress;
    }

    struct Account {

        string ticker;
        address sender;
        address walletAddress;
        uint amount;
        uint timeOfTransaction;
        string action;
    }

    Account[] accountTransactions;

    struct Transfer {

        string ticker;
        address sender;
        address payable receiver;
        address walletAddress;
        uint amount;
        uint id;
        uint approvals;
        uint timeOfTransaction;
    }

    Transfer[] transferRequests;

    event walletOwnerAdded(address addedBy, address ownerAdded, uint timeOfTransaction);
    event walletOwnerRemoved(address removedBy, address ownerRemoved, uint timeOfTransaction);
    event fundsDeposited(string ticker, address sender, uint amount, uint depositId, uint timeOfTransaction);
    event fundsWithdrawed(string ticker, address sender, uint amount, uint withdrawalId, uint timeOfTransaction);
    event transferCreated(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferCancelled(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferApproved(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event fundsTransfered(string ticker, address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event tokenAdded(address addedBy, string ticker, address tokenAddress, uint timeOfTransaction);

    modifier onlyAdmin() {
      require(msg.sender == admin, "Only Contract Owner allowed");
      _;

    }

    modifier onlyOwners(address walletAddress) {
       MultiSigFactory factory = MultiSigFactory(factoryContractAddress);

       bool isOwner = false;
       for (uint i = 0; i< factory.getWalletOwners(walletAddress).length; i++) {

           if (factory.getWalletOwners(walletAddress)[i].owners == msg.sender) {

               isOwner = true;
               break;
           }
       }

       require(isOwner == true, "Only wallet owners can call this function");
       _;

    }

    modifier tokenExists(string memory ticker) {

        if(keccak256(bytes(ticker)) != keccak256(bytes("ETH"))) {

            require(tokenMapping[ticker].tokenAddress != address(0), "Token does not exixts");
        }
        _;
    }

    function addToken(string memory ticker, address _tokenAddress) public onlyAdmin {

        for (uint i = 0; i < tokenList.length; i++) {

            require(keccak256(bytes(tokenList[i])) != keccak256(bytes(ticker)), "Cannot add duplicate tokens");
        }

        require(keccak256(bytes(ERC20(_tokenAddress).symbol())) == keccak256(bytes(ticker)));

        tokenMapping[ticker] = Token(ticker, _tokenAddress);

        tokenList.push(ticker);

        emit tokenAdded(msg.sender, ticker, _tokenAddress, block.timestamp);
    }

    function addWalletOwner(address owner, address walletAddress) public onlyOwners(walletAddress) {

       MultiSigFactory factory = MultiSigFactory(factoryContractAddress);

       for (uint i = 0; i < factory.getWalletOwners(walletAddress).length; i++) {

           if(factory.getWalletOwners(walletAddress)[i].owners == owner) {

               revert("cannot add duplicate owners");
           }
       }

       factory.addNewWalletInstance(owner, walletAddress);
       emit walletOwnerAdded(msg.sender, owner, block.timestamp);

    }

    function removeWalletOwner(address owner, address walletAddress) public onlyOwners(walletAddress) {

        MultiSigFactory factory = MultiSigFactory(factoryContractAddress);

        factory.removeNewWalletInstance(owner, walletAddress);
        emit walletOwnerRemoved(msg.sender, owner, block.timestamp);

    }

    function deposit(string memory ticker, uint amount, address walletAddress) public payable onlyOwners(walletAddress) tokenExists(ticker) {

        require(balance[walletAddress][msg.sender][ticker] >= 0, "Cannot deposit 0 amount");

        if(keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {

            balance[walletAddress][msg.sender]["ETH"] += msg.value;
        }

        else {
            balance[walletAddress][msg.sender][ticker] += amount;
            IERC20 token = IERC20(tokenMapping[ticker].tokenAddress);
            require(token.balanceOf(msg.sender) >= amount);
            token.transferFrom(msg.sender, address(this), amount);
        }

        emit fundsDeposited(ticker, msg.sender, msg.value, depositId, block.timestamp);
        accountTransactions.push(Account(ticker, msg.sender, walletAddress, amount, block.timestamp, "Deposit"));

        depositId++;

    }

    function withdraw(string memory ticker, uint amount, address walletAddress) public onlyOwners(walletAddress) tokenExists(ticker) {

        require(balance[walletAddress][msg.sender][ticker] >= amount);

        balance[walletAddress][msg.sender][ticker] -= amount;

        if(keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {

            payable(msg.sender).transfer(amount);
        }

        else {
            IERC20 token = IERC20(tokenMapping[ticker].tokenAddress);
            require(token.balanceOf(address(this)) >= amount,"Insufficient Token");
            token.transfer(msg.sender, amount);
        }

        emit fundsWithdrawed(ticker, msg.sender, amount, withdrawalId, block.timestamp);
        accountTransactions.push(Account(ticker, msg.sender, walletAddress, amount, block.timestamp, "Withdraw"));

        withdrawalId++;

    }

    function createTransferRequest(string memory ticker, address payable receiver, uint amount, address walletAddress) public onlyOwners(walletAddress) tokenExists(ticker) {

        MultiSigFactory factory = MultiSigFactory(factoryContractAddress);

        require(balance[walletAddress][msg.sender][ticker] >= amount, "Insufficent funds to create a Transfer");

        for (uint i = 0; i < factory.getWalletOwners(walletAddress).length; i++) {

            require(factory.getWalletOwners(walletAddress)[i].owners != receiver, "Cannot transfer funds withiwn the wallet");
        }

        balance[walletAddress][msg.sender][ticker] -= amount;
        transferRequests.push(Transfer(ticker, msg.sender, receiver, walletAddress, amount, transferId, 0, block.timestamp));
        transferId++;
        emit transferCreated(ticker, msg.sender, receiver, amount, transferId, 0, block.timestamp);
    }

    function cancelTransferRequest(uint id, address walletAddress) public onlyOwners(walletAddress) {

        bool hasBeenFound = false;
        uint transferIndex = 0;
        for (uint i = 0; i < transferRequests.length; i++) {
            if(transferRequests[i].id == id) {
                hasBeenFound = true;
                break;
            }
             transferIndex++;
        }
        string memory ticker = transferRequests[transferIndex].ticker;
        require(transferRequests[transferIndex].sender == msg.sender, "Only the transfer creator can cancel");
        require(hasBeenFound, "Transfer request does not exist");

        balance[walletAddress][msg.sender][ticker] += transferRequests[transferIndex].amount;

        transferRequests[transferIndex] = transferRequests[transferRequests.length - 1];

        emit transferCancelled(
            ticker,
            msg.sender,
            transferRequests[transferIndex].receiver,
            transferRequests[transferIndex].amount,
            transferRequests[transferIndex].id,
            transferRequests[transferIndex].approvals,
            transferRequests[transferIndex].timeOfTransaction);

        transferRequests.pop();
    }

    function approveTransferRequest(uint id, address walletAddress) public payable onlyOwners(walletAddress) {

        bool hasBeenFound = false;
        uint transferIndex = 0;
        for (uint i = 0; i < transferRequests.length; i++) {
            if(transferRequests[i].id == id) {
                hasBeenFound = true;
                break;
            }
             transferIndex++;
        }
        string memory ticker = transferRequests[transferIndex].ticker;
        require(hasBeenFound, "Tx not found");
        require(approvals[msg.sender][id] == false, "Cannot approve the same transfer twice");
        require(transferRequests[transferIndex].sender != msg.sender, "Transfer creator cannot approve");

        approvals[msg.sender][id] = true;
        transferRequests[transferIndex].approvals++;

        emit transferApproved(
            ticker,
            msg.sender,
            transferRequests[transferIndex].receiver,
            transferRequests[transferIndex].amount,
            transferRequests[transferIndex].id,
            transferRequests[transferIndex].approvals,
            transferRequests[transferIndex].timeOfTransaction);

        uint limit = getApprovalLimit(walletAddress);
        if (transferRequests[transferIndex].approvals == limit) {

            transferFunds(ticker, transferIndex, walletAddress);
        }
    }

    function transferFunds(string memory ticker, uint id, address walletAddress) private {

        balance[walletAddress][transferRequests[id].receiver][ticker] += transferRequests[id].amount;

        if(keccak256(bytes(ticker)) == keccak256(bytes("ETH"))) {

            transferRequests[id].receiver.transfer(transferRequests[id].amount);
        }
        else {
            IERC20(tokenMapping[ticker].tokenAddress).transfer(transferRequests[id].receiver, transferRequests[id].amount);
        }

        emit fundsTransfered(ticker, msg.sender, transferRequests[id].receiver, transferRequests[id].amount, transferRequests[id].id, transferRequests[id].approvals, transferRequests[id].timeOfTransaction);

        transferRequests[id] = transferRequests[transferRequests.length - 1];
        transferRequests.pop();
    }

    function getApprovals(uint id) public view returns(bool) {

        return approvals[msg.sender][id];
    }

    function getTransferRequests() public view returns(Transfer[] memory) {

        return transferRequests;
    }

    function getAccountTransactions() public view returns(Account[] memory) {

        return accountTransactions;
    }

    function getBalance(string memory ticker, address walletAddress) public view tokenExists(ticker) returns(uint) {
        MultiSigFactory factory = MultiSigFactory(factoryContractAddress);
        uint walletBalance;
        MultiSigFactory.WalletUsers[] memory walletOwners = factory.getWalletOwners(walletAddress);
        for (uint i = 0; i < walletOwners.length; i++) {
                walletBalance += balance[walletAddress][walletOwners[i].owners][ticker];

            }
        return walletBalance;
    }

    function getWalletDetails(address walletAddress) public view returns(uint[] memory) {
        uint256[] memory walletDetails = new uint256[](tokenList.length);

        MultiSigFactory factory = MultiSigFactory(factoryContractAddress);
        MultiSigFactory.WalletUsers[] memory walletOwners = factory.getWalletOwners(walletAddress);


        for (uint j = 0; j< tokenList.length; j++)
        {
          uint walletBalance;
          for (uint i = 0; i < walletOwners.length; i++) {
              walletBalance += balance[walletAddress][walletOwners[i].owners][tokenList[j]];
            }
            walletDetails[j] = walletBalance;
        }


        return walletDetails;
    }

    function getApprovalLimit(address walletAddress) public view returns (uint) {
        MultiSigFactory factory = MultiSigFactory(factoryContractAddress);

        return factory.getWalletOwners(walletAddress).length - 1;
    }

    function getContractETHBalance() public view returns(uint) {

        return address(this).balance;
    }

    function getContractERC20Balance(string memory ticker, address walletAddress) public view tokenExists(ticker) returns(uint) {

        return balance[walletAddress][address(this)][ticker];
    }

    function getTokenList() public view returns(string[] memory) {

        return tokenList;
    }

}
