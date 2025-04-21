// sorts an unsorted array
function mergeSort(arr) {
    if(arr.length === 1) return arr;
    var mediumIndex = arr.length / 2;
    if(/\./gm.test(mediumIndex)) mediumIndex = Math.floor(mediumIndex);
    let leftArr = mergeSort(arr.slice(0, mediumIndex));
    let rightArr = mergeSort(arr.slice(mediumIndex, arr.length));

    var finalArr = [];
    [i, j] = [0, 0];
    while((i !== leftArr.length) && (j !== rightArr.length)) {
        if (leftArr[i] < rightArr[j]) {
            finalArr.push(leftArr[i]);
            i++;
        } else {
            finalArr.push(rightArr[j]);
            j++;
        };
    };
    if(i === leftArr.length) finalArr = finalArr.concat(rightArr.slice(j, rightArr.length));
    if(j === rightArr.length) finalArr = finalArr.concat(leftArr.slice(i, leftArr.length));

    return finalArr;

};

// class that makes node instances of number inputs
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
};

// factory function that creates and manages Self-Sorting Binary Trees
const AVLManager = (function(){

    // avl variable holds the tree
    var avl;

    // array for storing roots to iterate through in Level-order iteration 
    let queue = [null];

    // array for storing balance factors of all tree nodes
    let bfArr = [];

    // arrays that store nodes of a tree in a specific order
    [levelOrderArr, inOrderArr, preOrderArr, postOrderArr] = [[], [], [], []];

    // function that sorts an unsorted array using merge sort function, 
    // then creates the tree with creeateAVLTree function and stores it in the avl variable
    // removes duplicates of a value
    const sortArray = (array) => {
        const sortedArr = mergeSort(array);
        console.log(sortedArr);
        for(let i = 0; i < sortedArr.length; i++) {
            if(sortedArr[i] === sortedArr[i + 1]) sortedArr.splice(i, 1);
        };
        console.log(sortedArr);
        avl = createAVLTree(sortedArr);
    };

    // creates nodes from all array items and sorts them into a self-balanced binary tree using recursion
    const createAVLTree = (array, start = 0, end = array.length - 1) => {
        if(end === -1) return null;
        var mid = (start + end) / 2;
        if(/\./gm.test(mid)) mid = Math.floor(mid);
        let root = new Node(array[mid]);
        root.left = createAVLTree(array.slice(0, mid));
        root.right = createAVLTree(array.slice(mid + 1, array.length));
        return root;
    };

    // creates a node and places it in the tree using recursion
    // does nothing if the given value already exists in the tree
    const insert = (value, currentNode = avl) => {
        if (!currentNode) return;

        if(value < currentNode.value) {
            if(!currentNode.left) {
                currentNode.left = new Node(value);
                return;
            };
            currentNode = currentNode.left;
            insert(value, currentNode);
        } else if(value > currentNode.value){
            if(!currentNode.right) {
                currentNode.right = new Node(value); ;
                return;
            };
            currentNode = currentNode.right;
            insert(value, currentNode);
        } else if(value === currentNode.value) return;
    };

    // checks if the value entered exists in the tree using recursion, 
    // if not returns null, if so, returns the full node
    const search = (value, currentNode = avl) => {
        if (!currentNode) {
            console.log(`${value} not found`);
            return undefined;
        };

        if(value < currentNode.value) {
            currentNode = currentNode.left;
            return search(value, currentNode);
        } else if(value > currentNode.value){
            currentNode = currentNode.right;
            return search(value, currentNode);
        } else return currentNode;
    };

    // finds the parent node of a leaf node using recursion, 
    // used only when balancing the tree after removing leaf nodes
    const findParentNode = (node, currentNode = avl) => {
        if (!currentNode) {
            console.log(`${node.value}'s parent not found`);
            return undefined;
        };

        if (node.value < currentNode.value) {
            if (currentNode.left === node) return {
                parent: currentNode,
                side: 'left'
            };
            return findParentNode(node, currentNode.left);
        } else if (node.value > currentNode.value){
            if (currentNode.right === node) return {
                parent: currentNode,
                side: 'right'
            };
            return findParentNode(node, currentNode.right);
        } else return {
            parent: null,
            side: 'root'
        };
    };

    // checks if given value exists, if not returns null, if so, removes the node from the tree
    // works with the root node too
    // returns null if the tree only consists of root node and we wanna delete it
    const remove = (value) => {
        console.log(`removing ${value}`);
        let searchNode = search(value);
        if(searchNode) { 
            var leftSideHead = searchNode.left;
            var rightSideHead = searchNode.right;
            var previousNode = searchNode;
            var replacementNode = null;

            while(leftSideHead && leftSideHead.right) {
                previousNode = leftSideHead;
                leftSideHead = leftSideHead.right;
            };

            if(leftSideHead && !leftSideHead.left && !leftSideHead.right) {
                if(previousNode === searchNode) {
                    previousNode.left = null;
                } else previousNode.right = null;
                replacementNode = leftSideHead;

            } else {
                while(rightSideHead && rightSideHead.left) {
                    previousNode = rightSideHead;
                    rightSideHead = rightSideHead.left;
                };
    
                if(rightSideHead && !rightSideHead.left && !rightSideHead.right) {
                    if(previousNode === searchNode) {
                        previousNode.right = null;
                    } else previousNode.left = null;
                    replacementNode = rightSideHead;
                };
            };
        
            if(replacementNode) {
                searchNode.value = replacementNode.value;
            } else {
                var parentNode = findParentNode(searchNode);
                if(parentNode.parent) {
                    if(parentNode.side === 'right') {
                        parentNode.parent.right = null;
                    } else parentNode.parent.left = null;
                } else avl = null;
            };
        };
    };

    // Level-order tree traversal using iteration
    // object that contains queue array storing nodes that are yet to be traversed in last-in-first-out order
    // contains array that prints out numbers in level-order array
    // and three functions that parse, push and display the nodes
    const levelOrderIteration = {
        queue: [],
        printArr: [],

        parser() {
            this.queue.push(avl);
            while(this.queue[0]) {
                if(this.queue[0].left) this.queue.push(this.queue[0].left);
                if(this.queue[0].right) this.queue.push(this.queue[0].right);
                this.noter(this.queue[0].value);
                this.queue = this.queue.slice(1);
            };
            this.displayLevelOrder();
        },

        noter(value) {
            this.printArr.push(value);
        },

        displayLevelOrder() {
            console.log('level order done with iteration:');
            console.log(this.printArr);
        }
    };

    // does the same thing as previous function but with recursion and two additional function that
    // push and display the printed nodes order
    const levelOrderRecursion = (callback) => {
        if(callback == undefined) throw new Error('No callback provided (callback is required)');
        if(queue.length === 0) {
            displayOrder('Level order (breadth-first level order) sorting', levelOrderArr);
            return queue = [null];
        };

        if(queue[0] === null) {
            queue = queue.slice(1);
            queue.push(avl);
        };
        if(queue[0].left) queue.push(queue[0].left);
        if(queue[0].right) queue.push(queue[0].right);
        callback(queue[0].value, levelOrderArr);
        queue = queue.slice(1);
        levelOrderRecursion(callback);
    };

    // function that traverses the tree in in-order fashion
    // using a callback function pushes nods into inOrder array and returns it
    const inOrder = (callback, temp = avl) => {
        if(callback == undefined) throw new Error('No callback provided (callback is required)');
        if(!temp) return;

        inOrder(callback, temp.left);
        callback(temp.value, inOrderArr);
        inOrder(callback, temp.right);

        return inOrderArr;
    };

    // function that traverses the tree in pre-order fashion
    // using a callback function pushes nods into preOrder array and returns it
    const preOrder = (callback, temp = avl) => {
        if(callback == undefined) throw new Error('No callback provided (callback is required)');
        if(!temp) return;

        callback(temp.value, preOrderArr);
        preOrder(callback, temp.left);
        preOrder(callback, temp.right);

        return preOrderArr;
    };

    // function that traverses the tree in post-order fashion
    // using a callback function pushes nods into postOrder array and returns it
    const postOrder = (callback, temp = avl) => {
        if(callback == undefined) throw new Error('No callback provided (callback is required)');
        if(!temp) return;

        postOrder(callback, temp.left);
        postOrder(callback, temp.right);
        callback(temp.value, postOrderArr);

        return postOrderArr;
    };
    
    // function that pushes a given value into a given array and returns the array
    // used with order traversal functions
    const noter = (value, arr) => {
        arr.push(value);
        return arr;
    };

    // function that displays a given array with specificed order 
    // resets all the order traversal arrays so that when they are written into again they don't contain
    // old values
    // used with order traversal functions
    const displayOrder = (word, arr) => {
        console.log(`${word} done with recursion:`);
        console.log(arr);
        [levelOrderArr, inOrderArr, preOrderArr, postOrderArr] = [[], [], [], []];
    };

    // confirms if the given value exists as a node, if not returns null, if yes
    // finds the height of the node containing the given value
    const height = (value, root = search(value)) => {
        if(!root) return null;

        let counter = 0;
        let tempL = height(value, root.left);
        let tempR = height(value, root.right);

        if(!tempL && !tempR) {
            counter++;
        } else if(tempL && tempR) {
            if(tempL > tempR) {
                counter = tempL + 1
            } else if(tempL < tempR) {
                counter = tempR + 1;
            } else if(tempL === tempR) counter = tempL + 1;
        } else if(tempL && !tempR) {
            counter = tempL + 1;
        } else if(tempR && !tempL) {
            counter = tempR + 1;
        };

        return counter;
    };

    // returns the depth of the node containing the given value using code similar to search function
    const depth = (value, currentNode = avl, counter = 0) => {
        if(!currentNode) return null;

        if(value < currentNode.value) {
            currentNode = currentNode.left;
            counter++;
            return depth(value, currentNode, counter);
        } else if(value > currentNode.value){
            currentNode = currentNode.right;
            counter++;
            return depth(value, currentNode, counter);
        } else return counter;
    }

    // checks if the tree is balanced by checking the balance condition for every node in the tree
    // it also pushes the balance factors of all the nodes into an array to be displayed
    const BalanceFactor = (root = avl) => {
        if (!root) return 0;

        let counter = 0;
        let tempL = BalanceFactor(root.left);
        let tempR = BalanceFactor(root.right);

        if(!tempL && !tempR) {
            counter++;
        } else if(tempL && tempR) {
            if(tempL > tempR) {
                counter = tempL + 1
            } else if(tempL < tempR) {
                counter = tempR + 1;
            } else if(tempL === tempR) counter = tempL + 1;
        } else if(tempL && !tempR) {
            counter = tempL + 1;
        } else if(tempR && !tempL) {
            counter = tempR + 1;
        }; 
        bfArr.push(tempR - tempL);
        return counter;
    };

    // displays height and depth of the given value
    const displayHeightDepth = (value) => {
        let nodeHeight = height(value);
        if(nodeHeight) {
            console.log(`Node of value ${value} has height: ${nodeHeight}`);
        } else console.log(nodeHeight);

        console.log(`Node of value ${value} has depth: ${depth(value)}`);
    };

    // displays the balance factors of all the nodes of the tree, including the tree
    // resets balance factor array to empty to be reused again
    const displayBF = () => {
        BalanceFactor();
        console.log(`Balance Factor of the tree: ${bfArr[bfArr.length - 1]}`);
        console.log('Balance Factors of all elements:');
        console.log(bfArr);
        bfArr = [];
    };

    // rebalances an unbalanced tree by using in-order traversal method to provide the new array to the 
    // createAVLTree function that rebalances the tree and recreates it
    // it calls printOUtTree function to display the newly balanced tree and resets the inOrderArr 
    const rebalance = () => {
        avl = createAVLTree(inOrder(AVLManager.noter));
        printOutTree();
        inOrderArr = [];
    };

    // prints out the AVL tree in linked list fashion and in visual style by calling prettyPrint funciton
    const printOutTree = () => {
        console.log('tree:');
        console.log(avl);
        prettyPrint(avl);
    };

    // visually creates provided AVL tree by its root node
    const prettyPrint = (node, prefix = "", isLeft = true) => {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.left !== null) {
            prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };

    return {
        sortArray,
        insert,
        search,
        remove,
        levelOrderIteration,
        levelOrderRecursion,
        inOrder,
        preOrder,
        postOrder,
        noter,
        displayOrder,
        displayHeightDepth,
        displayBF,
        rebalance,
        printOutTree,
    }

})();

// EXAMPLE #1
// Creating and displaying the AVL tree
// const randomArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
// AVLManager.sortArray(randomArr);
// AVLManager.printOutTree();

// Inserting new values into the tree and displaying it
// AVLManager.insert(6);
// AVLManager.insert(322);
// AVLManager.insert(0);
// AVLManager.insert(-1);
// AVLManager.insert(8);
// AVLManager.printOutTree();

// Searching for some values
// AVLManager.search(-2);
// AVLManager.search(6);

// Removing everything to check if removing a lone root results in null tree
// AVLManager.remove(324);
// AVLManager.remove(67);
// AVLManager.remove(9);
// AVLManager.remove(6345);
// AVLManager.remove(23);
// AVLManager.remove(4);
// AVLManager.remove(1);
// AVLManager.remove(3);
// AVLManager.remove(5);
// AVLManager.remove(7);
// AVLManager.printOutTree();

// Traversion the tree with all four ways
// AVLManager.levelOrderIteration.parser();
// AVLManager.levelOrderRecursion(AVLManager.noter);
// AVLManager.displayOrder('In-order (depth-first level order) sorting', AVLManager.inOrder(AVLManager.noter));
// AVLManager.displayOrder('Pre-order (depth-first level order) sorting', AVLManager.preOrder(AVLManager.noter));
// AVLManager.displayOrder('Post-order (depth-first level order) sorting', AVLManager.postOrder(AVLManager.noter));

// Displaying the height and depth of different values
// Testing if non-existing values will return null;
// AVLManager.displayHeightDepth(13);
// AVLManager.displayHeightDepth(3);
// AVLManager.displayHeightDepth(5);
// AVLManager.displayHeightDepth(67);
// AVLManager.displayHeightDepth(8);

// Displaying the BF of the tree
// AVLManager.displayBF();


// EXAMPLE #2
// Creating and displaying the AVL tree with values 0 - 100
const randomArr1 = [3, 7, 4, 23, 8, 91, 4, 30, 5, 27, 9, 67, 44, 13];
AVLManager.sortArray(randomArr1);
AVLManager.printOutTree();

// Displaying the BF of the tree
AVLManager.displayBF();

// Traversion the tree with all four ways
AVLManager.displayOrder('In-order (depth-first level order) sorting', AVLManager.inOrder(AVLManager.noter));
AVLManager.displayOrder('Pre-order (depth-first level order) sorting', AVLManager.preOrder(AVLManager.noter));
AVLManager.displayOrder('Post-order (depth-first level order) sorting', AVLManager.postOrder(AVLManager.noter));

// Unbalancing the tree by inserting values that are greater than 100
AVLManager.insert(322);
AVLManager.insert(400);
AVLManager.insert(6944);
AVLManager.insert(2000);

// Displaying the BF of the tree and the tree itself
AVLManager.displayBF();
AVLManager.printOutTree();

// rebalancing the tree and displaying it
console.log('rebalanced tree:');
AVLManager.rebalance();

// Displaying the BF of the tree and the tree itself
AVLManager.displayBF();

// Traversion the tree with all four ways
AVLManager.displayOrder('In-order (depth-first level order) sorting', AVLManager.inOrder(AVLManager.noter));
AVLManager.displayOrder('Pre-order (depth-first level order) sorting', AVLManager.preOrder(AVLManager.noter));
AVLManager.displayOrder('Post-order (depth-first level order) sorting', AVLManager.postOrder(AVLManager.noter));