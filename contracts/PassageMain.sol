pragma solidity ^0.4.19;

import "./PassageHelper.sol";


contract PassageMain is PassageHelper {


    function createProduct(string _name, string _description, string _location) public {
    
        // Generate a pseudo-random product ID
        // from the current time and the sender's address
        bytes32 newProductId = keccak256(now, msg.sender);

        // Create product
        var product = productIdToProductStruct[newProductId];

        // Define product
        product.productId = newProductId;
        product.latestVersionId = 0; // temporary value that gets replaced in addProductVersion()
        product.versions = new bytes32[](0); // empty array at first
        product.exists = true;
        product.owner = msg.sender;
        // TODO? add to ownerToProductsId

        // Add new product ID
        productIds.push(newProductId);

        // Create initial product version
        addProductVersion(newProductId, _name, _description, _location);

        // Fire an event to announce the creation of the product
        ProductCreated(newProductId, msg.sender);
    }

    function addProductVersion(bytes32 _productId, string _name, string _description, string _location) 
    public productIdExists(_productId) noChildren(_productId) {
        // TODO: add ownerOf modifier (causes 'revert' error when added, let's try to debug and fix that)
        // TODO: check if msg.sender == product owner OR if msg.sender is god

        // Generate a pseudo-random product ID
        // from the current time, the sender's address, and the productId
        bytes32 newVersionId = keccak256(now, msg.sender, _productId);

        // Create product version
        var version = versionIdToVersionStruct[newVersionId];

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
        Product storage product = productIdToProductStruct[_productId];

        // Add new version ID to product
        product.versions.push(newVersionId);

        // Set ID as product's latest version
        product.latestVersionId = newVersionId;
    }

    function getProductById(bytes32 _productId) external view productIdExists(_productId) 
    returns (string name, string description, string location) {
      
        // Get the requested product from storage
        Product storage product = productIdToProductStruct[_productId];

        // Get the latest product version
        ProductVersion storage latestVersion = versionIdToVersionStruct[product.latestVersionId];

        // Return the requested data
        return (latestVersion.name, latestVersion.description, latestVersion.location);
    }

    function saveProductChildren(bytes32 _originalProductId, bytes32[] _newProductIds) public 
    productIdExists(_originalProductId) productIdsExist(_newProductIds) {
      
        /* 
        UI:
        - Scan a product (view)
        - Split product (button)
        - Number of different products to split into (number input)
        - Generate X number of rows to create products (quantity for each row)
        - Create those products and their IDs
        - Call this method with the IDs to store children in mapping
        */
        for (uint i = 0; i < _newProductIds.length; ++i) {
            nodeToChildren[_originalProductId].push(_newProductIds[i]);
        }
    }

    // TODO: combineProduct
}
