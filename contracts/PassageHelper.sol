pragma solidity ^0.4.19;

import "./PassageEvents.sol";

contract PassageHelper is PassageEvents {
    // TODO:
    // OnlyPassageTeam
    // OnlyIndustry
    // OnlyPublic
    // OnlyGovernment

    modifier ownerOf(uint _productId) {
      require(msg.sender == productIdToProductStruct[_productId].owner);
      _;
    }

    // TODO: convert to modifier
    function productIdExists(uint _productId) public constant returns(bool isIndeed) {
      return productIdToProductStruct[_productId].exists;
    }

    // TODO: require no children to add a new version to a product
    // if a product has children, revert()

    // TODO: require IsGod
    // liste de god accounts qui peuvent ajouter *leurs* certifications à n'importe quel produit

    // request to transfer *product* ownership
    function requestOwnershipTransfer(uint _productId, address _newOwnerAddress) {
      require(msg.sender == productIdToProductStruct[_productId].owner);
      productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = _newOwnerAddress;
    }

    // accept a *product* ownership transfer
    function acceptOwnershipTransfer(uint _productId) {
      require(newOwnerStruct.accountAddress == productIdToProductStruct[_productId].nextAuthorizedOwnerAddress);
      Actor storage newOwnerStruct = actorAddressToActorStruct[msg.sender];
      productIdToProductStruct[_productId].nextAuthorizedOwnerAddress = 0;
      productIdToProductStruct[_productId].owner = newOwnerStruct.accountAddress;
    }
}