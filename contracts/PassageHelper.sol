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

    //function productIdExists(bytes32 _productId) public constant returns(bool isIndeed) {
    //  return productIdToProductStruct[_productId].exists;
    //}

    modifier productIdExists(bytes32 _productId) {
      require(productIdToProductStruct[_productId].exists);
      _;
    }

    // TODO: require no children to add a new version to a product
    // if a product has children, revert()

    // TODO: require IsGod
    // liste de god accounts qui peuvent ajouter *leurs* certifications à n'importe quel produit

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