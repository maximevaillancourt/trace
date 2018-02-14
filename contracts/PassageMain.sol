pragma solidity ^0.4.19;

import "./PassageHelper.sol";
import "./StringLib.sol";

contract PassageMain is PassageHelper {

    /***********************
      EVENT DEFINITIONS
    ***********************/
    event ProductCreated(uint newProductId);
    // event OwnershipTransferRequest(uint productId, address indexed currentOwner, address indexed newRequestedOwner);
    // event ProductDetailsUpdated(uint productId);
    // event ProductMarkedAsSold(uint productId);

    /***********************
      STRUCT DEFINITIONS
    ***********************/
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

    struct ProductVersion {
        uint versionId;
        uint creationDate;
        uint lastVersionId;
        address owner;

        // all data fields below are editable
        string name;
        string description;
        string location;
        //string customJsonData;
        //string latitude; // 6 last digits are decimals (numeric type not supported in solidity)
        //string longitude;
        //Certification[] certifications;
    }
    
    struct Product {
        // Product data that never changes should be specified below
        uint productId;
        uint latestVersionId;
        uint[] versions;
        bool exists; // always true (used to know if it exists; kinda hackish but it works)
        address owner;
        //address nextAuthorizedOwner;
    }
    
    /***********************
      MAPPINGS & STORAGE
    ***********************/
    mapping (uint => Product) public products; // used to access a product struct directly from an ID
    uint[] public productIds; // used to access all product IDs

    mapping (uint => ProductVersion) public productVersions; // used to access a version struct directly from a version ID
    uint[] public productVersionIds; // used to access all version IDs
    
    /***********************
      HELPERS (move to PassageHelper & refactor contract inheritance)
    ***********************/
    modifier ownerOf(uint _productId) {
      require(msg.sender == products[_productId].owner);
      _;
    }

    function productIdExists(uint _productId) public constant returns(bool isIndeed) {
      return products[_productId].exists;
    }

    /***********************
      METHODS
    ***********************/
    function createProduct(string _name, string _description, string _location) public {
    
        // Generate a product ID
        uint newProductId = productIds.length;

        // Instead, we could generate a pseudo-random product ID
        // from the current time and the sender's address
        //uint newProductId = uint(keccak256(now, msg.sender));

        // Create product
        var product = products[newProductId];

        // Define product
        product.productId = newProductId;
        product.latestVersionId = 0; // temporary value that gets replaced in addProductVersion()
        product.versions = new uint[](0); // empty array at first
        product.exists = true;
        product.owner = msg.sender;

        // Add new product ID
        productIds.push(newProductId);

        // Create initial product version
        addProductVersion(newProductId, _name, _description, _location);

        // Fire an event to announce the creation of the product
        ProductCreated(newProductId);
    }

    function addProductVersion(uint _productId, string _name, string _description, string _location) public {
        // ^ TODO: add ownerOf modifier (causes 'revert' error when added, let's try to debug and fix that)

        // Generate a version ID
        uint newVersionId = productVersionIds.length;

        // Instead, we could generate a pseudo-random product ID
        // from the current time, the sender's address, and the productId
        // uint newVersionId = uint(keccak256(now, msg.sender, _productId));

        // Create product version
        var version = productVersions[newVersionId];

        // Define new version
        version.versionId = newVersionId;
        version.creationDate = now;
        version.lastVersionId = product.latestVersionId;
        version.owner = product.owner;

        version.name = _name;
        version.description = _description;
        version.location = _location;

        // Save new product version ID
        productVersionIds.push(newVersionId);

        // Get base product from storage
        Product storage product = products[_productId];

        // Add new version ID to product
        product.versions.push(newVersionId);

        // Set ID as product's latest version
        product.latestVersionId = newVersionId;
    }

    function getProductById(uint _productId) external view returns (string name, string description, string location) {

      if(!productIdExists(_productId)){
        revert();
      }
      
      // Get the requested product from storage
      Product storage product = products[_productId];

      // Get the latest product version
      ProductVersion storage latestVersion = productVersions[product.latestVersionId];

      // Return the requested data
      return (latestVersion.name, latestVersion.description, latestVersion.location);
    }

    // TODO: implement this
    /*
    function requestOwnershipTransfer(uint _productId, address _newOwnerAddress){
      product[index].nextAuthorizedOwnerAddress = _newOwnerAddress;
    }
    */
}