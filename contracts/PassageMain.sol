pragma solidity ^0.4.19;

import "./PassageHelper.sol";

contract PassageMain is PassageHelper {
    
    event ProductCreated(uint newProductId, string name, string description, string location);

    // event OwnershipTransferRequest(uint productId, address indexed currentOwner, address indexed newRequestedOwner);
    
    event ProductDetailsUpdated(uint productId);
    
    event ProductMarkedAsSold(uint productId);

    struct Actor {
        string name;
        string physicalAddress; // Physical address, may be separated (more costly)
        string accountAddress; // Ethereum address
        string actorType; // Actor type (industry expert, governmental agency, etc.). Should be a uint16 and reference another struct maybe?
    }

    struct Certification {
        string name;
        uint16 deliveringActor; // Agency/company behind the certification
    }
    
    struct Product {
        string name;
        string description;
        //string qrCode; // base64 representation of the QR code?
        string location;
        //Certification[] certifications;
    }

    Actor[] public actors;
    Certification[] public certifications;
    Product[] public products;

    mapping (uint => uint[]) public initialProductToSubsequentVersions;
    // map uint to array of uints : {1 => [1, 4, 8, ]}

    function createProduct(string _name, string _description, string _location) public {
        uint newProductId = products.push(Product(_name, _description, _location)) - 1;
        ProductCreated(newProductId, _name, _description, _location);
    }

    function getProductById(uint index) external view returns(string, string, string) {
        return (products[index].name, products[index].description, products[index].location);
    }

    function _editProduct(uint _productId) {
        
    }

    function _getProductPublicDataById(uint _productId) {
        
    }

    function _markProductAsSold(uint _productId) {
        
    }

    /*
    function _requestOwnershipTransfer(uint index, address _newOwnerAddress){
      product[index].nextAuthorizedOwnerAddress = _newOwnerAddress;

    }
    */
}