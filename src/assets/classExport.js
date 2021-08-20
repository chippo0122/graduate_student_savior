class Node {
    constructor(id, item) {
        this.id = id;
        this.value = item;
        this.next = null;
    }
}

class List {
    constructor() {
        this.head = null
    }

    insert(id, item) {
        let node = new Node(id, item);
        let current = this.head,
            prev;

        if (this.head === null) {
            this.head = node;
            return;
        } else {
            while (!this.compare(current, node) && current.next !== null) {
                prev = current;
                current = current.next;
            }

            node.next = current;
            if(prev) {
                prev.next = node;
            } else {
                this.head = node;
            }
            return;
        }
    }

    compare(originItem, newItem) {
        let index = 0;
        return this.compareRecursive(index, originItem, newItem);
    }

    compareRecursive(index, originItem, newItem) {
        let originLeng = originItem.value.length,
            newLeng = newItem.value.length;

        if (originItem.value[index] > newItem.value[index]) {
            //if the new element smaller than oringinal one, return true, means need to switch position
            return true
        } else if (originItem.value[index] === newItem.value[index] && (originLeng >= index && newLeng >= index)) {
            index++
            return this.compareRecursive(index, originItem, newItem);
        } else if (index + 1 === originLeng || index + 1 === newLeng) {
            return originLeng > newLeng ? true : false;
        }

        return false
    }

    traversal() {
        let current = this.head;
        let keyList = []
        while (current !== null) {
            keyList.push(current.id);
            current = current.next;
        };

        return keyList
    }

    clear() {
        this.head = null;
    }
}

class Dictionary {
    constructor() {
        this.items = {}
    }

    set(key, value) {
        this.items[key] = value;
    }

    getItem(key) {
        return this.items.hasOwnProperty(key) ? this.items[key] : null;
    }

    clear() {
        this.items = {};
    }

    remove(key) {
        if (this.items.hasOwnProperty(key)) {
            delete this.items[key];
            return true
        } else {
            return false
        }
    }
}

let SortList = new List(),
    DataStorage = new Dictionary();

export {SortList, DataStorage};
