pragma solidity ^0.4.19;

import "./PassageHelper.sol";
import "./Dictionary.sol";

contract PassageMain is PassageHelper {
        
    using DictionaryBytes32Uint for DictionaryBytes32Uint.Data;
    DictionaryBytes32Uint.Data private dic;    

    function PassageMain() public {
      // Creator of the contract is default God
      godUser = msg.sender;
    }
    
    function createProduct(
      string _name,
      string _description,
      string _latitude,
      string _longitude,
      bytes32[] _certificationsIds,
      string _customJsonData
    ) public returns (bytes32 productId) {
    
        // Generate a pseudo-random product ID
        // from the current time and the sender's address
        bytes32 newProductId = keccak256(now, msg.sender);

        // Create product
        var product = productIdToProductStruct[newProductId];

        // Define product
        product.productId = newProductId;
        product.latestVersionId = "0"; // temporary value that gets replaced in updateProduct()
        product.versions = new bytes32[](0); // empty array at first
        product.exists = true;
        product.archived = false;
        product.owner = msg.sender;

        product.name = _name;
        product.description = _description;
        product.certificationsIds = _certificationsIds;

        // Add new product ID
        productIds.push(newProductId);

        // Add product ID to account
        ownerToProductsId[msg.sender].push(newProductId);

        // Create initial product version
        updateProduct(newProductId, _latitude, _longitude, _customJsonData);

        // Fire an event to announce the creation of the product
        ProductCreated(newProductId, msg.sender);

        return newProductId;
    }

    function updateProduct(
      bytes32 _productId, 
      string _latitude, 
      string _longitude,
      string _customJsonData
    ) public productIdExists(_productId) noChildren(_productId) {
        // TODO: add ownerOf modifier (causes 'revert' error when added, let's try to debug and fix that)
        // TODO: check if msg.sender == product owner OR if msg.sender is god

        // Get base product from storage
        Product storage product = productIdToProductStruct[_productId];

        // Generate a pseudo-random product ID
        // from the current time, the sender's address, and the productId
        bytes32 newVersionId = keccak256(now, msg.sender, _productId);

        // Create product version
        var version = versionIdToVersionStruct[newVersionId];

        // Define new version
        version.versionId = newVersionId;
        version.creationDate = now;
        version.previousVersionId = product.latestVersionId;
        version.owner = product.owner;

        version.latitude = _latitude;
        version.longitude = _longitude;
        version.customJsonData = _customJsonData;

        // Save new product version ID
        productVersionIds.push(newVersionId);

        // Add new version ID to product
        product.versions.push(newVersionId);

        // Set ID as product's latest version
        product.latestVersionId = newVersionId;
    }

    function getProductById(bytes32 _productId, bytes32 specificVersionId) external view productIdExists(_productId)
    returns (string name, string description, string _latitude, string _longitude, uint versionCreationDate, bytes32[] versions, bytes32[] certificationsIds) {

      // Get the requested product from storage
      Product storage product = productIdToProductStruct[_productId];

      // Initialize a variable that will hold the requested product version struct
      ProductVersion storage requestedVersion;

      if (specificVersionId == "latest") {
        // Get the latest product version
        requestedVersion = versionIdToVersionStruct[product.latestVersionId];

      } else {
        // Get the requested product version
        requestedVersion = versionIdToVersionStruct[specificVersionId];
      }

      // Return the requested data
      return (product.name, product.description, requestedVersion.latitude, requestedVersion.longitude, requestedVersion.creationDate, product.versions, product.certificationsIds);

      // TODO: return the product versions using another function (i.e. getProductVersions(_productId))
      // instead of directly (as above)
    }

    function getProductCustomDataById(bytes32 _productId, bytes32 specificVersionId) external view productIdExists(_productId)
    returns (string customJsonData) {

        // Get the requested product from storage
        Product storage product = productIdToProductStruct[_productId];

        // Initialize a variable that will hold the requested product version struct
        ProductVersion storage requestedVersion;

        if (specificVersionId == "latest") {
          // Get the latest product version
          requestedVersion = versionIdToVersionStruct[product.latestVersionId];

        } else {
          // Get the requested product version
          requestedVersion = versionIdToVersionStruct[specificVersionId];
        }

        // Return the requested data
        return (requestedVersion.customJsonData);

        // TODO: return the product versions using another function (i.e. getProductVersions(_productId))
        // instead of directly (as above)
    }

    function saveProductChildren(bytes32 _originalProductId, bytes32[] _newProductIds) public 
    productIdExists(_originalProductId) productIdsExist(_newProductIds) {
      
        /* 
        // TODO in the UI:
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

    function combineProducts(bytes32[] _parts, string _name, string _description, string _latitude, string _longitude) public 
    returns (bytes32 newProductId) {

        bytes32[] memory finalCertificationIds = mergeCertifications(_parts);

        var createdProductId = createProduct(_name, _description, _latitude, _longitude, finalCertificationIds, "");
        for (uint i = 0; i < _parts.length; ++i) {
            nodeToParents[createdProductId].push(_parts[i]);
            productIdToProductStruct[_parts[i]].archived = true;
        }

        return createdProductId;
    }

    function mergeCertifications(bytes32[] parts) private returns (bytes32[] certificationsIds) {
        
        // Add all used certifications to dictionary
        for (uint i = 0; i < parts.length; ++i) {
            var product = productIdToProductStruct[parts[i]];
            bytes32[] memory partCerts = product.certificationsIds;
            for (uint j = 0; j < partCerts.length; ++j) {
                dic.increment(partCerts[j]);
            }
        }

        // Keep certifications that are used by every part
        uint nbCertsCombined = 0;
        bytes32[] memory dicKeys = dic.keys();
        bytes32[] memory certsIds = new bytes32[](parts.length * 5); // Hardcoded limits for current POF
        for (uint k = 0; k < dicKeys.length; ++k) {
            if (dic.get(dicKeys[k]) == parts.length) {
                certsIds[k] = dicKeys[k];
                nbCertsCombined++;
            }
            dic.remove(dicKeys[k]);
        }

        // Prepare return values
        bytes32[] memory returnedCerts = new bytes32[](nbCertsCombined);
        for (uint index = 0; index < nbCertsCombined; ++index) {
            returnedCerts[index] = certsIds[index];
        }

        return returnedCerts;
    }

    function getOwnerProducts() external view returns (bytes32[] productsIds) {

        bytes32[] memory ownedProductsIds = ownerToProductsId[msg.sender];
        bytes32[] memory activeProducts = new bytes32[](ownedProductsIds.length);

        for (uint i = 0; i < ownedProductsIds.length; ++i) {
            if (!productIdToProductStruct[ownedProductsIds[i]].archived) {
                activeProducts[i] = ownedProductsIds[i];
            }
        }

        return activeProducts;
    }

    function createCertification(
        string _name,
        string _imageUrl,
        address _certificationOwner
    ) public returns (bytes32 certificationId) {
    
        // Generate a pseudo-random certification ID
        // from the current time, the certification name, and the sender's address
        bytes32 newCertificationId = keccak256(now, _name, msg.sender);

        // Create certification
        var certification = certificationIdToCertificationStruct[newCertificationId];

        // Define certification
        certification.certificationId = newCertificationId;
        certification.name = _name;
        certification.imageUrl = _imageUrl;

        // Add new certification ID
        certificationIds.push(newCertificationId);

        // Add certifiction to certifier
        certifiersAddressToCertificationIds[_certificationOwner == address(0) ? msg.sender : _certificationOwner].push(newCertificationId);

        return newCertificationId;
    }

    function getAllCertificationsIds() external view returns (bytes32[] certificationsIds) {
        return certificationIds;
    }

    function getActorCertificationsIds() external view returns (bytes32[] certificationsIds) {
        return certifiersAddressToCertificationIds[msg.sender];
    }

    function getCertificationById(bytes32 _certificationId) external view returns (string name, string imageUrl) {

        // Get the requested certification from storage
        Certification storage certification = certificationIdToCertificationStruct[_certificationId];

        // Return the requested data
        return (certification.name, certification.imageUrl);
    }

    function getVersionLatLngById(bytes32 _versionId) external view returns (string latitude, string longitude) {

        // Get the requested version from storage
        ProductVersion storage version = versionIdToVersionStruct[_versionId];

        // Return the requested data
        return (version.latitude, version.longitude);
    }

    // modify the god user
    function updateGodUser(address _newGodAddress) public onlyGod {
        require(_newGodAddress != address(0));
        godUser = _newGodAddress;
    }

    function isUserGod() external view returns (bool) {
        return godUser == msg.sender;
    }
}
