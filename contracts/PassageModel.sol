pragma solidity ^0.4.19;


contract PassageModel {

    /***********************
      STRUCT DEFINITIONS
    ***********************/
    struct Actor {
        string name;
        string physicalAddress; // Physical address, may be separated (more costly)
        address accountAddress; // Ethereum address
        // Actor type (industry expert, governmental agency, etc.). 
        //Should be a uint16 and reference another struct maybe?
        string actorType;
    }

    struct Certification {
        string name;
        uint16 deliveringActor; // Agency/company behind the certification
    }

    struct ProductVersion {
        bytes32 versionId;
        bytes32 previousVersionId;
        uint creationDate;
        address owner;

        // all data fields below are editable
        string name;
        string description;
        string latitude;
        string longitude;
        //string customJsonData;
        //Certification[] certifications;
    }
    
    struct Product {
        // Product data that never changes should be specified below
        bytes32 productId;
        bytes32 latestVersionId;
        bytes32[] versions;
        bool exists; // always true (used to know if it exists; kinda hackish but it works)
        address owner;
        address nextAuthorizedOwnerAddress;
    }
    
    /***********************
      MAPPINGS & STORAGE
    ***********************/
    mapping (bytes32 => Product) public productIdToProductStruct; // used to access a product struct directly from an ID
    bytes32[] public productIds; // used to access all product IDs

    mapping (bytes32 => ProductVersion) public versionIdToVersionStruct; // used to access a version struct directly from a version ID
    bytes32[] public productVersionIds; // used to access all version IDs

    mapping (address => bytes32[]) public ownerToProductsId; // used to access an account's products

    mapping (address => Actor) public actorAddressToActorStruct; // access an actor struct from its Eth address
    address[] public actorAddresses; // used to access all actor addresses

    mapping (bytes32 => bytes32[]) public nodeToParents; // access a combined product's parents

    mapping (bytes32 => bytes32[]) public nodeToChildren; // access a divided product's children

    // TODO: list of god accounts (mapping? array?)
    // TODO: handle certifying actors addresses
    // (see https://etherscan.io/address/0x06012c8cf97bead5deae237070f9587f8e7a266d#code)

}