pragma solidity ^0.4.19;


contract PassageModel {

    /***********************
      STRUCT DEFINITIONS
    ***********************/
    struct Actor {
        bytes32 actorId;
        string name;
        address accountAddress; // Ethereum address
        string physicalAddress; // Physical address, may be separated (more costly)
        // TODO: actor certification? ISO:9001?
    }

    struct Certification {
        bytes32 certificationId;
        string name;
        string imageUrl;
        // TODO: certification expiration date
        //bytes32 certificationActorId; // agency/company behind the certification
    }

    struct ProductVersion {
        bytes32 versionId;
        bytes32 previousVersionId;
        uint creationDate;
        address owner; // used to keep track of who owned the product at that version (could be a "bytes32 actorId")
        string latitude;
        string longitude;
        string customJsonData;
    }
    
    struct Product {
        bool exists; // always true! (used to check if the product exists)
        bool archived; // set to true when product gets merged/split

        bytes32 productId;
        bytes32 latestVersionId;
        bytes32[] versions;
        bytes32[] certificationsIds;
        
        address owner;
        address nextAuthorizedOwnerAddress;

        // TODO: standard product categories/descriptions
        // TODO: allow users to set favourite categories based on their industry
        // TODO: UPC/EAN codes, GS1 categories https://www.gs1.org/gpc/latest

        string name;
        string description;
    }
    
    /***********************
      MAPPINGS & STORAGE
    ***********************/
    mapping (bytes32 => Product) public productIdToProductStruct; // access a product struct directly from an ID
    bytes32[] public productIds; // access all product IDs

    mapping (bytes32 => ProductVersion) public versionIdToVersionStruct; // access a version struct from a version ID
    bytes32[] public productVersionIds; // access all version IDs

    mapping (address => bytes32[]) public ownerToProductsId; // access an account's products

    mapping (address => Actor) public actorAddressToActorStruct; // access an actor struct from its Eth address
    address[] public actorAddresses; // access all actor addresses

    mapping (bytes32 => Certification) public certificationIdToCertificationStruct; // access a version struct from a version ID
    bytes32[] public certificationIds; // access all version IDs

    mapping (bytes32 => bytes32[]) public nodeToParents; // access a combined product's parents

    mapping (bytes32 => bytes32[]) public nodeToChildren; // access a divided product's children

    // TODO: list of god accounts (mapping? array?)
    address public godUser;
    address[] public certifingUsers;

    // TODO: handle certifying actors' addresses
    // (see https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code)
    mapping (address => bytes32[]) certifiersAddressToCertificationIds; // Certifing Actors to their certifications IDs
}
