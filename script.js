// class Node {
//     constructor(value) {
//         this.current = value;
//         this.left = null;
//         this.right = null;
//     }
// }

// class BinarySearchTree {
//     constructor() {
//         this.head = null;
//     }
// }

// const BSTManager = (function(){
//     let binaryTree = new BinarySearchTree();

//     const add = (value, currentNode = binaryTree.head) => {
//         let newNode = new Node(value);

//         if (!currentNode) {
//             binaryTree.head = newNode;
//             return;
//         };

//         if(newNode.current < currentNode.current) {
//             if(!currentNode.left) {
//                 currentNode.left = newNode;
//                 return;
//             };
//             currentNode = currentNode.left;
//             add(value, currentNode);
//         } else if(newNode.current > currentNode.current){
//             if(!currentNode.right) {
//                 currentNode.right = newNode;
//                 return;
//             };
//             currentNode = currentNode.right;
//             add(value, currentNode);
//         } else return;

//         console.log('head:');
//         console.log(binaryTree);
//     }

//     const search = (value, currentNode = binaryTree.head) => {
//         if (!currentNode) return undefined;

//         if(value < currentNode.current) {
//             currentNode = currentNode.left;
//             return search(value, currentNode);
//         } else if(value > currentNode.current){
//             currentNode = currentNode.right;
//             return search(value, currentNode);
//         } else {
//             console.log('value found: ' + value);
//             return currentNode;
//         }
//     }

//     const removalProcess = (head) => {
//         if(!head.left && !head.right) return head;

//         //first delve into left side of the head
        

//         // delve into right side of the head if condition wasnt met
//     }

//     const remove = (value) => {
//         let searchNode = search(value);
//         if(searchNode) {
//             // removalProcess(searchNode);
//             var leftSideHead = searchNode.left;
//             var rightSideHead = searchNode.right;
//             var previousNode = searchNode;
//             var replacementNode = null;

//             while(leftSideHead && leftSideHead.right) {
//                 previousNode = leftSideHead;
//                 leftSideHead = leftSideHead.right;
//             };

//             if(leftSideHead && !leftSideHead.left && !leftSideHead.right) {
//                 if(previousNode === searchNode) {
//                     previousNode.left = null;
//                 } else previousNode.right = null;
//                 replacementNode = leftSideHead;

//             } else {
//                 while(rightSideHead && rightSideHead.left) {
//                     previousNode = rightSideHead;
//                     rightSideHead = rightSideHead.left;
//                 };
    
//                 if(rightSideHead && !rightSideHead.left && !rightSideHead.right) {
//                     if(previousNode === searchNode) {
//                         previousNode.right = null;
//                     } else previousNode.left = null;
//                     replacementNode = rightSideHead;
//                 }
//             };
            
//             searchNode.current = replacementNode.current;
//             console.log('head:');
//             console.log(binaryTree);
//         };
//     }

//     return {
//         add,
//         search,
//         remove
//     }

// })();

// BSTManager.add(5);
// BSTManager.add(2);
// BSTManager.add(7);
// BSTManager.add(3);
// BSTManager.add(2);
// console.log(BSTManager.search(3));
// // console.log(BSTManager.search(6));
// BSTManager.remove(2);
// // BSTManager.remove(6);

const externalBinaryArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(root) {
        this.root = root;
    }
}

const TreeManager = (function(){

    const buildTree = (arr) => {
        if(arr.length === 1) return arr;
        var mediumIndex = arr.length / 2;
        if(/\./gm.test(mediumIndex)) mediumIndex = Math.floor(mediumIndex);
        let treeNode = new Node(mediumIndex);
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
    }

    var binaryTree = new Tree(buildTree(externalBinaryArray));
    console.log('the tree:');
    console.log(binaryTree);

    // return {
    //     prettyPrint
    // }

})();