// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./MultiSigWallet.sol";

contract MultiSigFactory {

    struct UserWallets{

        address walletAddress;
    }

    struct WalletUsers{

        address owners;
    }

    UserWallets[] userWallets;
    WalletUsers[] walletUsers;
    MultiSigWallet[] multisigWalletIntances;

    mapping(address => UserWallets[]) ownersWallets;
    mapping(address => WalletUsers[]) walletOwners;

    event WalletCreated(address createdBy, address newWalletContractAddress, uint timeOfTransaction);

    function createNewWallet() public {

        MultiSigWallet newMultisigWalletContract = new MultiSigWallet(address(this));
        multisigWalletIntances.push(newMultisigWalletContract);

        UserWallets[] storage newWallet = ownersWallets[msg.sender];
        newWallet.push(UserWallets(address(newMultisigWalletContract)));

        WalletUsers[] storage newOwner = walletOwners[address(newMultisigWalletContract)];
        newOwner.push(WalletUsers(msg.sender));

        emit WalletCreated(msg.sender, address(newMultisigWalletContract), block.timestamp);

    }

    function addNewWalletInstance(address owner, address walletAddress) external {

        UserWallets[] storage newWallet = ownersWallets[owner];
        newWallet.push(UserWallets(walletAddress));

        WalletUsers[] storage newOwner = walletOwners[walletAddress];
        newOwner.push(WalletUsers(owner));

    }

    function removeNewWalletInstance(address _owner, address _walletAddress) external {

        UserWallets[] storage newWallet = ownersWallets[_owner];
        WalletUsers[] storage newOwner = walletOwners[_walletAddress];

        bool walletHasBeenFound = false;
        uint walletIndex;
        bool ownerHasBeenFound = false;
        uint ownerIndex;
        for (uint i = 0; i < newWallet.length; i++) {

            if(newWallet[i].walletAddress == _walletAddress) {

                walletHasBeenFound = true;
                walletIndex = i;
                break;
            }

        }

        for (uint i = 0; i < newOwner.length; i++) {

            if(newOwner[i].owners == _owner) {

                ownerHasBeenFound = true;
                ownerIndex = i;
                break;
            }

        }

        require(walletHasBeenFound);
        require(ownerHasBeenFound);

        newWallet[walletIndex] = newWallet[newWallet.length - 1];
        newOwner[ownerIndex] = newOwner[newOwner.length - 1];

        newOwner.pop();
        newWallet.pop();


    }

    function getOwnerWallets(address owner) public view returns(UserWallets[] memory) {

        return ownersWallets[owner];
    }

    function getWalletOwners(address walletAddress) public view returns(WalletUsers[] memory) {

        return walletOwners[walletAddress];
    }

}
