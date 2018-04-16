pragma solidity ^0.4.19;

import "./PassageEvents.sol";

contract PassageHelper is PassageEvents {

    // TODO:
    // OnlyPassageTeam
    // OnlyIndustry
    // OnlyPublic
    // OnlyGovernment

    modifier ownerOf(bytes32 _productId) {
        require(msg.sender == productIdToProductStruct[_productId].owner);
        _;
    }

    modifier productIdsExist(bytes32[] _productIds) {
        bool allIdsExist = true;
        for (uint i = 0; i < _productIds.length; i++) {
            if (!productIdToProductStruct[_productIds[i]].exists) {
                allIdsExist = false;
                break;
            }
        }
        require(allIdsExist);
        _;
    }

    modifier productIdExists(bytes32 _productId) {
        require(productIdToProductStruct[_productId].exists);
        _;
    }

    modifier noChildren(bytes32 _productId) {
        require(nodeToChildren[_productId].length == 0);
        _;
    }

    // list of "god" users, who can add their own certifications to any product
    modifier onlyGod() {
        require(msg.sender == godUser);
        _;
    }
    
    // request to transfer *product* ownership
    function requestOwnershipTransfer(bytes32 _productId, address _newOwnerAddress) public {
        require(msg.sender == productIdToProductStruct[_productId].owner);
        productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = _newOwnerAddress;
    }

    // accept a *product* ownership transfer
    function acceptOwnershipTransfer(bytes32 _productId) public {
        require(newOwnerStruct.accountAddress == productIdToProductStruct[_productId].nextAuthorizedOwnerAddress);
        Actor storage newOwnerStruct = actorAddressToActorStruct[msg.sender];
        productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = 0;
        productIdToProductStruct[_productId].owner = newOwnerStruct.accountAddress;
    }
}
