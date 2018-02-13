pragma solidity ^0.4.19;

import "./PassageHelper.sol";
import "./StringLib.sol";

contract PassageMain is PassageHelper {
    
    event ProductCreated(uint newProductId, string name, string description, string location);

    // event OwnershipTransferRequest(uint productId, address indexed currentOwner, address indexed newRequestedOwner);
    
    event ProductDetailsUpdated(uint productId);
    
    event ProductMarkedAsSold(uint productId);

    struct Actor {
        string name;
        string physicalAddress; // Physical address, may be separated (more costly)
        string accountAddress; // Ethereum address
        // Actor type (industry expert, governmental agency, etc.). 
        //Should be a uint16 and reference another struct maybe?
        string actorType;
    }

    struct Certification {
        string name;
        uint16 deliveringActor; // Agency/company behind the certification
    }

    struct ProductIteration {
        uint iterationId;
        uint creationDate;
        uint lastIterationId;
        string name;
        string description;
        string location;
        //string notes;
        //string customJsonData;
        //int latitude; // 6 last digits are decimals (numeric type not supported in solidity)
        //int longitude;
        //Certification[] certifications;
    }
    
    struct Product {
        uint productId; // can be used to generate qrcode
        uint latestIterationId;
        ProductIteration[] iterations;
        // Informations that don't change will be added here.

        //address owner; needed?
        //address nextAuthorizedOwner; needed?
    }
    
    Actor[] public actors;
    Certification[] public certifications;

    //Product[] public products;
    mapping (uint => Product) public products;
    mapping (uint => address) public productToOwner;
    mapping (address => uint) public ownerProductCount;
    mapping (uint => uint[]) public initialProductToSubsequentVersions;
    // map uint to array of uints : {1 => [1, 4, 8, ]}

    function createProduct(string _name, string _description, string _location) public returns (uint) {
        // ^ More iteration informations to be added here
        // Generate a pseudo-random productId
        uint generatedProductId = uint(keccak256(_description));
        products[generatedProductId].productId = generatedProductId;
        // Create its first iteration and assign ids
        uint initialIterationId = products[generatedProductId].iterations.push(
            ProductIteration(0, now, 0, _name, _description, _location));
        products[generatedProductId].latestIterationId = initialIterationId;
        products[generatedProductId].iterations[initialIterationId].iterationId = initialIterationId;
        products[generatedProductId].iterations[initialIterationId].lastIterationId = initialIterationId;

        productToOwner[generatedProductId] = msg.sender;
        ownerProductCount[msg.sender]++;
        ProductCreated(generatedProductId, _name, _description, _location);

        // User will generate QRCode from this value
        return generatedProductId;
    }

    function getProductById(uint index) external view returns(string, string, string) {
        //return (products[index].name, products[index].description, products[index].location);
    }

    function addProductIteration(uint _productId, string _name, string _description, string _location) public {
        // ^ More iteration informations to be added here
        // ^ Implement onlyOwner logic
        // ^ _productId is the QRCode value (generated at the moment of creation)
        Product storage product = products[_productId];
        if (product.productId == 0) return; // Product doesn't exist. Exit now.
        uint newIterationId = product.iterations.push(
            ProductIteration(0, now, product.latestIterationId, _name, _description, _location));
        product.iterations[newIterationId].iterationId = newIterationId;
        product.latestIterationId = newIterationId;
    }

    function _editProduct(uint _productId) private {
        // Still needed?
    }

    function _getProductPublicDataById(uint _productId) public {
        
    }

    function _markProductAsSold(uint _productId) private {
        
    }

    /*
    function _requestOwnershipTransfer(uint index, address _newOwnerAddress){
      product[index].nextAuthorizedOwnerAddress = _newOwnerAddress;

    }
    */
}