pragma solidity ^0.4.17;

library DictionaryUint {
    uint constant private NULL = 0;

    struct Node {
        uint prev;
        uint next;
        bytes data;
        bool initialized;
    }

    struct Data {
        mapping(uint => Node) list;
        uint firstNodeId;
        uint lastNodeId;
        uint len;
    }

    function insertAfter(Data storage self, uint afterId, uint id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].prev = afterId;
        if (self.list[afterId].next == NULL) {
            self.list[id].next =  NULL;
            self.lastNodeId = id;
        } else {
            self.list[id].next = self.list[afterId].next;
            self.list[self.list[afterId].next].prev = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[afterId].next = id;
        self.len++;
    }

    function insertBefore(Data storage self, uint beforeId, uint id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].next = beforeId;
        if (self.list[beforeId].prev == NULL) {
            self.list[id].prev = NULL;
            self.firstNodeId = id;
        } else {
            self.list[id].prev = self.list[beforeId].prev;
            self.list[self.list[beforeId].prev].next = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[beforeId].prev = id;
        self.len++;
    }

    function insertBeginning(Data storage self, uint id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        if (self.firstNodeId == NULL) {
            self.firstNodeId = id;
            self.lastNodeId = id;
            self.list[id] = Node({ prev: 0, next: 0, data: data, initialized: true });
            self.len++;
        } else
            insertBefore(self, self.firstNodeId, id, data);
    }

    function insertEnd(Data storage self, uint id, bytes data) internal {
        if (self.lastNodeId == NULL) insertBeginning(self, id, data);
        else
            insertAfter(self, self.lastNodeId, id, data);
    }

    function set(Data storage self, uint id, bytes data) internal {
        if (exists(self, id)) {
            self.list[id].data = data;
        } else {
            insertEnd(self, id, data);
        }
    }

    function exists(Data storage self, uint id) internal view returns (bool) {
        return self.list[id].initialized;
    }

    function get(Data storage self, uint id) internal view returns (bytes) {
        return self.list[id].data;
    }

    function remove(Data storage self, uint id) internal returns (bool) {
        uint nextId = self.list[id].next;
        uint prevId = self.list[id].prev;

        if (prevId == NULL) self.firstNodeId = nextId; //first node
        else self.list[prevId].next = nextId;

        if (nextId == NULL) self.lastNodeId = prevId; //last node
        else self.list[nextId].prev = prevId;

        delete self.list[id];
        self.len--;

        return true;
    }

    function getSize(Data storage self) internal view returns (uint) {
        return self.len;
    }

    function next(Data storage self, uint id) internal view returns (uint) {
        return self.list[id].next;
    }

    function prev(Data storage self, uint id) internal view returns (uint) {
        return self.list[id].prev;
    }

    function keys(Data storage self) internal constant returns (uint[]) {
        uint[] memory arr = new uint[](self.len);
        uint node = self.firstNodeId;
        for (uint i=0; i < self.len; i++) {
            arr[i] = node;
            node = next(self, node);
        }
        return arr;
    }
}

library DictionaryBytes32 {
    bytes32 constant private NULL = 0x0;

    struct Node {
        bytes32 prev;
        bytes32 next;
        bytes data;
        bool initialized;
    }

    struct Data {
        mapping(bytes32 => Node) list;
        bytes32 firstNodeId;
        bytes32 lastNodeId;
        uint len;
    }

    function insertAfter(Data storage self, bytes32 afterId, bytes32 id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].prev = afterId;
        if (self.list[afterId].next == NULL) {
            self.list[id].next =  NULL;
            self.lastNodeId = id;
        } else {
            self.list[id].next = self.list[afterId].next;
            self.list[self.list[afterId].next].prev = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[afterId].next = id;
        self.len++;
    }

    function insertBefore(Data storage self, bytes32 beforeId, bytes32 id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].next = beforeId;
        if (self.list[beforeId].prev == NULL) {
            self.list[id].prev = NULL;
            self.firstNodeId = id;
        } else {
            self.list[id].prev = self.list[beforeId].prev;
            self.list[self.list[beforeId].prev].next = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[beforeId].prev = id;
        self.len++;
    }

    function insertBeginning(Data storage self, bytes32 id, bytes data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        if (self.firstNodeId == NULL) {
            self.firstNodeId = id;
            self.lastNodeId = id;
            self.list[id] = Node({ prev: 0, next: 0, data: data, initialized: true });
            self.len++;
        } else
            insertBefore(self, self.firstNodeId, id, data);
    }

    function insertEnd(Data storage self, bytes32 id, bytes data) internal {
        if (self.lastNodeId == NULL) insertBeginning(self, id, data);
        else
            insertAfter(self, self.lastNodeId, id, data);
    }

    function set(Data storage self, bytes32 id, bytes data) internal {
        if (exists(self, id)) {
            self.list[id].data = data;
        } else {
            insertEnd(self, id, data);
        }
    }

    function exists(Data storage self, bytes32 id) internal view returns (bool) {
        return self.list[id].initialized;
    }

    function get(Data storage self, bytes32 id) internal view returns (bytes) {
        return self.list[id].data;
    }

    function remove(Data storage self, bytes32 id) internal returns (bool) {
        bytes32 nextId = self.list[id].next;
        bytes32 prevId = self.list[id].prev;

        if (prevId == NULL) self.firstNodeId = nextId; //first node
        else self.list[prevId].next = nextId;

        if (nextId == NULL) self.lastNodeId = prevId; //last node
        else self.list[nextId].prev = prevId;

        delete self.list[id];
        self.len--;

        return true;
    }

    function getSize(Data storage self) internal view returns (uint) {
        return self.len;
    }

    function next(Data storage self, bytes32 id) internal view returns (bytes32) {
        return self.list[id].next;
    }

    function prev(Data storage self, bytes32 id) internal view returns (bytes32) {
        return self.list[id].prev;
    }

    function keys(Data storage self) internal constant returns (bytes32[]) {
        bytes32[] memory arr = new bytes32[](self.len);
        bytes32 node = self.firstNodeId;
        for (uint i=0; i < self.len; i++) {
            arr[i] = node;
            node = next(self, node);
        }
        return arr;
    }
}

library DictionaryBytes32Uint {
    bytes32 constant private NULL = 0x0;

    struct Node {
        bytes32 prev;
        bytes32 next;
        uint data;
        bool initialized;
    }

    struct Data {
        mapping(bytes32 => Node) list;
        bytes32 firstNodeId;
        bytes32 lastNodeId;
        uint len;
    }

    function insertAfter(Data storage self, bytes32 afterId, bytes32 id, uint data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].prev = afterId;
        if (self.list[afterId].next == NULL) {
            self.list[id].next =  NULL;
            self.lastNodeId = id;
        } else {
            self.list[id].next = self.list[afterId].next;
            self.list[self.list[afterId].next].prev = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[afterId].next = id;
        self.len++;
    }

    function insertBefore(Data storage self, bytes32 beforeId, bytes32 id, uint data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        self.list[id].next = beforeId;
        if (self.list[beforeId].prev == NULL) {
            self.list[id].prev = NULL;
            self.firstNodeId = id;
        } else {
            self.list[id].prev = self.list[beforeId].prev;
            self.list[self.list[beforeId].prev].next = id;
        }
        self.list[id].data = data;
        self.list[id].initialized = true;
        self.list[beforeId].prev = id;
        self.len++;
    }

    function insertBeginning(Data storage self, bytes32 id, uint data) internal {
        if (self.list[id].initialized) {
            self.list[id].data = data;
            return;
        }
        if (self.firstNodeId == NULL) {
            self.firstNodeId = id;
            self.lastNodeId = id;
            self.list[id] = Node({ prev: 0, next: 0, data: data, initialized: true });
            self.len++;
        } else
            insertBefore(self, self.firstNodeId, id, data);
    }

    function insertEnd(Data storage self, bytes32 id, uint data) internal {
        if (self.lastNodeId == NULL) insertBeginning(self, id, data);
        else
            insertAfter(self, self.lastNodeId, id, data);
    }

    function set(Data storage self, bytes32 id, uint data) internal {
        if (exists(self, id)) {
            self.list[id].data = data;
        } else {
            insertEnd(self, id, data);
        }
    }

    function increment(Data storage self, bytes32 id) internal {
        if (exists(self, id)) {
            self.list[id].data = self.list[id].data + 1;
        } else {
            insertEnd(self, id, 1);
        }
    }

    function exists(Data storage self, bytes32 id) internal view returns (bool) {
        return self.list[id].initialized;
    }

    function get(Data storage self, bytes32 id) internal view returns (uint) {
        return self.list[id].data;
    }

    function remove(Data storage self, bytes32 id) internal returns (bool) {
        bytes32 nextId = self.list[id].next;
        bytes32 prevId = self.list[id].prev;

        if (prevId == NULL) self.firstNodeId = nextId; //first node
        else self.list[prevId].next = nextId;

        if (nextId == NULL) self.lastNodeId = prevId; //last node
        else self.list[nextId].prev = prevId;

        delete self.list[id];
        self.len--;

        return true;
    }

    function getSize(Data storage self) internal view returns (uint) {
        return self.len;
    }

    function next(Data storage self, bytes32 id) internal view returns (bytes32) {
        return self.list[id].next;
    }

    function prev(Data storage self, bytes32 id) internal view returns (bytes32) {
        return self.list[id].prev;
    }

    function keys(Data storage self) internal constant returns (bytes32[]) {
        bytes32[] memory arr = new bytes32[](self.len);
        bytes32 node = self.firstNodeId;
        for (uint i=0; i < self.len; i++) {
            arr[i] = node;
            node = next(self, node);
        }
        return arr;
    }
}
