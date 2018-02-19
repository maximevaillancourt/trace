pragma solidity ^0.4.19;

import "./PassageModel.sol";

contract PassageEvents is PassageModel {

    event ProductCreated(uint newProductId);
    // event OwnershipTransferRequest(uint productId, address indexed currentOwner, address indexed newRequestedOwner);
    // event ProductDetailsUpdated(uint productId);
    // event ProductMarkedAsSold(uint productId);
}
