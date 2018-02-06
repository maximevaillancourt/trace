pragma solidity ^0.4.19;

import "./PassageMethodModifiers.sol";

contract PassageMainContract is PassageMethodModifiers {
    
    event SpawnProduct();
    
    event EditProduct(uint _productId);
    
    event MarkProductAsSold(uint _productId);
    
    struct Product {
        //id / rfid / qrCode
        uint id;
        string slug;
        string description;
        //currentLocation
        //certifications
        //...
    }
    
    struct IndustryExpert {
        uint id;
        string name;
        string location; //Address, may be seperated (more costly)
        //...
    }
    
    struct Official {
        uint id;
        string name;
        string location;
        //...
    }
    
    function spawnProduct() {
        
    }

    function editProduct(uint _productId) {
        
    }

    function getProductPublicDataById(uint _productId) {
        
    }

    function markProductAsSold(uint _productId) {
        
    }
}