/*global console: false, aljabr: false, _: false */

/**
 * John Eargle (mailto: jeargle at gmail.com)
 * 2007-2016
 * aljabr
 */


var aljabr = aljabr || {};

/**
 * OO-style class that provides a constructor.
 * @param methods
 * @returns a class equipped with a constructor
 */
aljabr.Class = function(methods) {
    'use strict';
    var obj, i;
    
    obj = function() {    
        this.init.apply(this, arguments);          
    };  
    
    for (i in methods) { 
        obj.prototype[i] = methods[i];
    }

    // Default constructor
    if (!obj.prototype.init) {
        obj.prototype.init = function(){};
    }
    
    return obj;    
};


/**
 * Build an alphabet using latin characters where 'e' is the identity
 * element.
 * @param order - number of elements.
 */
aljabr.alphaElements = function(order) {
    'use strict';
    var i, alpha, elements;

    if (order > 26) {
        console.warn('Error - order larger than 26');
        return null;
    }
    
    alpha = ['e', 'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k',
             'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
             'w', 'x', 'y', 'z'];
    elements = alpha.slice(0,order);

    return elements;
};


/**
 * Build an alphabet using integers where 0 or 1 is the identity
 * element.
 * @param order - number of elements.
 * @param identityOne - set identity to 1 (default false)
 */
aljabr.numElements = function(order, identityOne) {
    'use strict';
    var i, elements, identity;

    if (identityOne === undefined) {
        identityOne = false;
    }

    if (identityOne) {
        identity = 1;
        order += 1;
    }
    else {
        identity = 0;
    }
    
    elements = [];
    for (i=identity; i<order; i++) {
        elements.push(toString(i));
    }

    return elements;
};


/**
 * This class holds the elements of a multiplication table.
 * The table only contains ints or null; the ints are indices
 * into an ElementSet array.
 * OperatorTables are generic so they may be used for Groups,
 * Rings, Fields, etc.  No validation is done in this class
 * for element placement, that happens in the corresponding
 * Builder classes.
 */
aljabr.OperatorTable = aljabr.Class({
    order: 0,
    emptyCellCount: 0,
    table: undefined,
    /**
     * Initialize the class.
     * @param order - number of rows (and columns) in the table
     */
    init: function(order) {
        'use strict';
        var model, i, j;
        
        model = this;
        model.order = order;
        model.emptyCellCount = model.order * model.order;
        model.table = [];
        for (i=0; i<model.order; i++) {
            model.table[i] = [];
            for (j=0; j<model.order; j++) {
                model.table[i][j] = null;
            }
        }
    },
    /**
     * Set the element for a given position in the table.
     * @param i - row
     * @param j - column
     * @param element - value to set the element to (int)
     */
    setElement: function(i, j, element) {
        'use strict';
        var model;
        
        model = this;
        
        if (0 <= i && i < model.order &&
            0 <= j && j < model.order &&
            0 <= element && element < model.order) {
            if (model.table[i][j] === null) {
                model.emptyCellCount -= 1;
            }
            model.table[i][j] = element;
        }
        // XXX - else throw exception
    },
    /**
     * Get element index from the table.
     * @param i - row
     * @param j - column
     * @returns element at (i,j) in the table
     */
    getElement: function(i, j) {
        'use strict';
        
        return this.table[i][j];
    },
    /**
     * Remove an element index from the table.
     * @param i - row
     * @param j - column
     */
    removeElement: function(i, j) {
        'use strict';
        
        this.table[i][j] = null;
    },
    /**
     * @returns whether the table is filled out or not
     */
    isComplete: function() {
        'use strict';
        
        return this.emptyCellCount === 0;
    }
});


/**
 * Immutable, validated Group.
 */
aljabr.Group = aljabr.Class({
    cls: 'Group',
    elements: null,   // array of strings
    order: 0,
    table: null,
    /**
     * Initialize the class.
     * @param elements - list of strings representing group elements
     * @param table - OperatorTable for the Group
     */
    init: function(elements, table) {
        'use strict';
        var model;

        model =  this;
        model.elements = elements;
        model.order = model.elements.length;
        model.table = table;
    },
    /**
     * Get the identity element.
     * @returns the identity element
     */
    getIdentity: function() {
        'use strict';
        return this.table.getElement(0, 0);
    },
    /**
     * Get a specific element.
     * @param i - row
     * @param j - column
     * @returns the element at position (i, j)
     */
    getElement: function(i, j) {
        'use strict';
        return this.table.getElement(i, j);
    },
    /**
     * Get the order of an element.
     * @param el - element index
     * @returns order of the element
     */
    elementOrder: function(el) {
        'use strict';
        var model, order, elPower;

        model = this;
            
        if (el === 0) {
            return 1;
        }
        else if (el >= model.order) {
            console.log("Error: element index too large");
            return 0;
        }

        order = 1;
        elPower = el;
        // Loop through powers of el
        while (elPower !== null && elPower !== 0) {
            elPower = model.table.getElement(elPower, el);
            order += 1;
        }

        if (elPower === null) {
            console.warn('Error - element order is broken for element ' +
                         model.elements[el]);
            return 0;
        }

        return order;
    },
    /**
     * Get the group index of an element.
     * @param el - index into element array
     * @returns index of the element
     */
    elementIndex: function(el) {
        'use strict';
        var model, order;

        model = this;
        if (el === 0) {
            return model.order;
        }
        else if (el >= model.order) {
            console.log("Error: element index too large");
            return 0;
        }

        order = model.elementOrder(el);
        if (order === 0) {
            console.log("Error: element order is 0");
        }

        return model.order/order;
    },
    /**
     * Get the set of elements in the subgroup generated by
     * the provided element.
     * @param {number} el - index into element array
     * @returns array of elements
     */
    elementSubgroup: function(el) {
        'use strict';
        var model, nextEl, elements;

        model = this;
        nextEl = 0;
        elements = [];

        // Loop through powers of el
        do {
            elements.push(nextEl);
            nextEl = model.table.getElement(nextEl, el);
        } while (nextEl !== null && nextEl !== 0)

        return elements;
    },
    /**
     * Get the cosets for the subgroup generated by the provided
     * element.
     * @param {number} el - index into element array
     * @param {boolean} left - true left, false right; default true
     * @returns array of elements
     */
    cosets: function(el, left) {
        'use strict';
        var model, elements, index, cosets, multElements, cosetElements, i, multiplier, coset, tempEl;

        model = this;
        if (left === undefined) {
            left = true;
        }
        elements = model.elementSubgroup(el);
        index = model.order/elements.length;
        cosets = [elements];

        // Track elements used as the left multiplier
        // and elements already in a known coset
        multElements = [];
        cosetElements = [];
        for (i=0; i<model.order; i++) {
            multElements.push(true);
            cosetElements.push(true);
        }

        // Remove elements already in the base coset
        for (i=0; i<elements.length; i++) {
            multElements[elements[i]] = false;
            cosetElements[elements[i]] = false;
        }

        multiplier = 0;
        while (cosets.length < index && multiplier < model.order) {
            coset = [];
            // Get next multiplier
            while (!multElements[multiplier]) {
                multiplier += 1;
            }
            multElements[multiplier] = false;
            for (i=0; i<elements.length; i++) {
                if (left) {
                    tempEl = model.table.getElement(elements[i], multiplier);
                }
                else {
                    tempEl = model.table.getElement(multiplier, elements[i]);
                }
                if (cosetElements[tempEl]) {
                    coset.push(tempEl);
                    cosetElements[tempEl] = false;
                }
                else {
                    break;
                }
            }
            if (coset.length === elements.length) {
                cosets.push(coset);
            }
        }

        return cosets;
    },
    /**
     * Create a String representation of the current operator table.
     * @returns string representation of the operator table
     */
    toStr: function() {
        'use strict';
        var model, colWidth, outString, i, j;

        console.log('Group.toStr()');
        
        model = this;
        
        // Set column width to size of largest element symbol
        colWidth = 0;
        for (i=0; i<model.order; i++) {
            if (colWidth < model.elements[i].length) {
	        colWidth = model.elements[i].length;
            }
        }

        outString = ' ' + aljabr.rJust(' ', colWidth) + ' |';
        for (i=0; i<model.order; i++) {
            outString += ' ' +
                aljabr.rJust(model.elements[i],
                             colWidth) +
                ' |';
        }
        outString += '\n';

        for (i=0; i<=model.order; i++) {
            outString += '-' + aljabr.rJust('-', colWidth, '-') + '-|';
        }
        outString += '\n';

        for (i=0; i<model.order; i++) {
            outString += ' ' +
                aljabr.rJust(model.elements[i],
                             colWidth) +
                ' |';
            for (j=0; j<model.order; j++) {
                // outString += ' #{model.elements.element(model.table.getElement(i, j)).symbol.aljabr.rJust(colWidth)} |'
                if (model.table.getElement(i, j) === null) {
	            outString += ' ' + aljabr.rJust('.', colWidth) + ' |';
                }
                else {
	            outString += ' ' +
                        aljabr.rJust(
                            model.elements[model.table.getElement(i, j)],
                            colWidth) +
                        ' |';
                }
            }
            outString += '\n';
        }
        
        return outString;
    }
});


/**
 * Immutable, validated Field.
 */
aljabr.Field = aljabr.Class({
    cls: 'Field',
    elements: null,   // array of strings
    order: 0,
    table: null,
    /**
     * Initialize the class.
     * @param elements - list of strings representing Field elements
     * @param addGroup - additive Group
     * @param multGroup - multiplicative Group
     */
    init: function(elements, addGroup, multGroup) {
        'use strict';
        var model;

        model =  this;
        model.elements = elements;
        model.order = model.elements.length;
        model.addGroup = addGroup;
        model.multGroup = multGroup;
    },
    /**
     * Get the identity element for a given table.
     * @param tableType {string} - '+' or '*'
     * @returns the identity element
     */
    getIdentity: function(tableType) {
        'use strict';
        var model, identity;

        model = this;
        
        if (tableType === '+') {
            identity = model.addGroup.getIdentity();
        }
        else if (tableType === '*') {
            identity = model.multGroup.getIdentity();
        }
        
        return identity;
    },
    /**
     * Get a specific element from the additive table.
     * @param i - row
     * @param j - column
     * @param tableType {string} - '+' or '*'
     * @returns the element at position (i, j)
     */
    getElement: function(i, j, tableType) {
        'use strict';
        var model, el;

        model = this;

        if (tableType === '+') {
            el = model.addGroup.getElement(i, j);
        }
        else if (tableType === '*') {
            el = model.multGroup.getElement(i, j);
        }
        
        return el;
    },
    /**
     * Get the order of an element.
     * @param elIdx - element index
     * @param tableType {string} - '+' or '*'
     * @returns order of the element
     */
    elementOrder: function(elIdx, tableType) {
        'use strict';
        var model, order;

        model = this;
        
        if (tableType === '+') {
            order = model.addGroup.elementOrder(elIdx);
        }
        else if (tableType === '*') {
            order = model.multGroup.elementOrder(elIdx);
        }

        return order;
    },
    /**
     * Get the Field index of an element.
     * @param el - index into element array
     * @param tableType {string} - '+' or '*'
     * @returns index of the element
     */
    elementIndex: function(elIdx, tableType) {
        'use strict';
        var model, index;

        model = this;

        if (tableType === '+') {
            index = model.addGroup.elementIndex(elIdx);
        }
        else if (tableType === '*') {
            index = model.multGroup.elementIndex(elIdx);
        }

        return index;
    },
    /**
     * Create a String representation of the current operator table.
     * @returns string representation of the operator table
     */
    toStr: function() {
        'use strict';
        var model, colWidth, outString, i, j;

        console.log('Field.toStr()');
        
        model = this;

        outString = model.addGroup.toStr();
        outString += '\n';
        outString += model.multGroup.toStr();
        
        return outString;
    }
});


/**
 * This class holds information about positions in an OperatorTable
 * that are still available for specific elements.  It does not
 * perform any automatic pruning of the table.  All changes must
 * be initiated by GroupBuilder.
 */
aljabr.OpenTable = aljabr.Class({
    cls: 'OpenTable',
    order: 0,
    table: undefined,    // [row][col][index] = allowedElement
    openPos: undefined,  // [element][row][col] = true or false
    nextPos: null,       // {el: el, row: row, col: col}: next position to close
    /**
     * Initialize the class.
     * @param order {number} - size of underlying group
     */
    init: function(order) {
        'use strict';
        var model, i, j, k;

        model = this;
        model.order = order;

        // Table with bool arrays showing which elements are allowed in a cell
        model.table = [];
        model.openPos = [];
        for (i=0; i<model.order; i++) {
            model.table[i] = [];
            model.openPos[i] = [];
            for (j=0; j<model.order; j++) {
                model.table[i][j] = [];
                model.openPos[i][j] = [];
                for (k=0; k<model.order; k++) {
                    model.table[i][j][k] = k;
                    model.openPos[i][j][k] = true;
                }
            }
        }

    },
    /**
     * Whether or not an element is a possibility for the given
     * position.
     * @param row {number} - row index
     * @param col {number} - column index
     * @param element {number} - element index
     * @returns true or false
     */
    isAllowed: function(row, col, element) {
        'use strict';

        if (this.table[row][col].indexOf(element) === -1) {
            return false;
        }
        
        return true;
    },
    /**
     * Return a list of remaining possible elements for a given
     * position.
     * @param row {number} - row index
     * @param col {number} - column index
     * @returns list of available elements
     */
    allowedList: function(row, col) {
        'use strict';

        return this.table[row][col];
    },
    /**
     * Remove all remaining elements as a possible options for a given
     * position.
     * @param row {number} - row index
     * @param col {number} - column index
     */
    clear: function(row, col) {
        'use strict';
        var model, i;

        model = this;
        model.table[row][col] = [];

        for (i=0; i<model.order; i++) {
            model.openPos[i][row][col] = false;
        }

        if (model.nextPos !== null &&
            model.nextPos.row === row &&
            model.nextPos.col === col) {
            console.warn('cleared nextPos');
            model.nextPos = null;
        }
        
        return;
    },
    /**
     * Remove element as a possible option for a given position.
     * @param row {number} - row index
     * @param col {number} - column index
     * @param element {number} - element index
     */
    remove: function(row, col, element) {
        'use strict';
        var model, elIndex;

        model = this;
        
        elIndex = model.table[row][col].indexOf(element);
        if (elIndex > -1) {
            model.table[row][col].splice(elIndex, 1);
        }
        
        model.openPos[element][row][col] = false;

        if (model.nextPos !== null &&
            model.nextPos.el === element &&
            model.nextPos.row === row &&
            model.nextPos.col === col) {
            console.warn('removed nextPos');
            model.nextPos = null;
        }
        
        return;
    },
    /**
     * Get a table showing where an element can be placed.
     * @param element - element index
     * @returns boolean mask of table showing open positions
     */
    openPositions: function(element) {
        'use strict';

        return this.openPos[element];
    },
    /**
     * Go through open positions to find any cases where an element
     * has only one available open position in a row or column.
     */
    findNextPos: function() {
        'use strict';
        var model, el, row, col;

        model = this;
        if (model.nextPos !== null) {
            return null;
        }
        
        for (el=0; el<model.order; el++) {
            for (row=0; row<model.order; row++) {
                col = model.openPos[el][row].indexOf(true);
                if (col === -1) {
                    continue;
                }
                if (model.openPos[el][row].indexOf(true) === -1) {
                    model.nextPos = {el: el, row: row, col: col};
                    return model.nextPos;
                }
            }
        }

        return null;
    },
    /**
     * Print out a table showing which elements can be placed in which
     * open positions in the operator table.
     */
    printOpenTable: function() {
        'use strict';
        var model, i, j;

        model = this;
        
        for (i=0; i<model.order; i++) {
            console.log('row ' + i + '\n');
            for (j=0; j<model.order; j++) {
                console.log('   col ' + j + '\n');
                console.log('      ');
                // console.log('table[' + i + '][' + j + '].class: ' + model.table[i][j].class + '\n');
                // console.log('table[' + i + '][' + j + '].length: ' + model.table[i][j].length + '\n');
                // console.log('table[0][0].length: ' + model.table[0][0].length + '\n');
                _.each(model.table[i][j], function(el) {
                    // console.log(el.class + ' ');
                    console.log(el + ' ');
                });
                console.log('\n');
            }
        }
    }
});


/**
 * This class holds information about positions in an OperatorTable
 * that are still available for specific elements.
 */
aljabr.AssociationTable = aljabr.Class({
    cls: 'AssociationTable',
    order: 0,
    table: undefined,   // [row][col][index] = allowedElement
    builder: undefined, // GroupBuilder
    /**
     * Initialize the class.
     */
    init: function(order, builder) {
        'use strict';
        var model, i, j, k;

        model = this;
        model.order = order;
        model.builder = builder;

        model.table = [];
        for (i=0; i<model.order; i++) {
            model.table[i] = [];
            for (j=0; j<model.order; j++) {
                model.table[i][j] = {};
            }
        }
    },
    /**
     * Get association rules for a given position
     * @param row - row
     * @param col - column
     */
    rules: function(row, col) {
        'use strict';
        
        return this.table[row][col];
    },
    /**
     * Check associativity rules for this position.
     * @param row - row
     * @param col - column
     */
    checkAssociativityRules: function(row, col) {
        'use strict';
        var model, r, firstFlag;

        model = this;
        firstFlag = true;

        if (model.table[row][col].length !== 0) {
            for (r in model.table[row][col]) {
                if (firstFlag) {
                    console.log('(' + row + ', ' + col + ') =');
                    firstFlag = false;
                }
                console.log('  (' + r + ', ' + model.table[row][col][r] + ')');
            }
        }
    },
    /**
     * Add any new associativity rules that result from the addition
     * of this element at this position.
     * @param i - row
     * @param j - column
     * @param el - element index to assign to (i, j)
     */
    addAssociativityRules: function(row, col, el) {
        'use strict';
        var model, builder, tempEl1, tempEl2;

        model = this;
        builder = model.builder;

        if (row === col) {
            // row: a, col: a, el: b
            // a(aa) = (aa)a
            // aa = b
            // => ab = ba
            if (row !== el) {
                model.table[row][el][el] = row;
                model.table[el][row][row] = el;
            }
        }
        else {
            if (el === builder.getElement(row, col) &&
                el === builder.getElement(col, row)) {
                // row: a, col: b, el: c
                // a(ba) = (ab)a
                // ba = c, ab = c (a and b commute)
                // => ac = ca, bc = cb
                if (el !== row) {
                    model.table[row][el][el] = row;
                    model.table[el][row][row] = el;
                }
                if (el !== col) {
                    model.table[col][el][el] = col;
                    model.table[el][col][col] = el;
                }
            }
            else {
                // b(aa) = (ba)a, a(ab) = (aa)b
                // aa = c, ba = d, ab = f
                // => bc = da, af = cb
                // row: a, col: b, el: f, tempEl1: c, tempEl2: d
                tempEl1 = builder.getElement(row, row);
                tempEl2 = builder.getElement(col, row);
                if (tempEl1 !== null && tempEl2 !== null) {
                    // bc = da
                    model.table[col][tempEl1][tempEl2] = row;
                    model.table[tempEl2][row][col] = tempEl1;
                    // af = cb
                    model.table[row][el][tempEl1] = col;
                    model.table[tempEl1][col][row] = el;
                }

                // row: b, col: a, el: d, tempEl1: c, tempEl2: f
                tempEl1 = builder.getElement(col, col);
                tempEl2 = builder.getElement(col, row);
                if (tempEl1 !== null && tempEl2 !== null) {
                    // bc = da
                    model.table[row][tempEl1][el] = col;
                    model.table[el][col][row] = tempEl1;
                    // af = cb
                    model.table[col][tempEl2][tempEl1] = row;
                    model.table[tempEl1][row][col] = tempEl2;
                }
            }
            
            // a(ba) = (ab)a, b(ab) = (ba)b
            // ba = c, ab = d
            // => ac = da, bd = cb
            
            // Most general case
            // c(ba) = (cb)a
            // ba = d, cb = f
            // cd = fa
        }
    }
});

/**
 * This class holds an intermediate representation for a Group that
 * has not been fully built.  It should allow for the placement
 * of Elements in an OperatorTable as long as they maintain the
 * possibility of creating a valid Group.
 */
aljabr.GroupBuilder = aljabr.Class({
    cls: 'GroupBuilder',
    elements: undefined,
    order: 0,
    elementOrders: undefined,
    table: undefined,
    openTable: undefined,
    associationTable: undefined,
    factors: undefined,  // array of prime factors
    /**
     * Initialize the class.
     * @param elements - ElementSet with all the group elements
     */
    init: function(elements) {
        'use strict';
        var model, i, j, k;
        
        model = this;
        model.elements = elements;
        model.order = model.elements.length;
        model.table = new aljabr.OperatorTable(model.order);
        model.factors = _.uniq(aljabr.factors(model.order));
        console.log('factors:');
        console.log(model.factors);

        model.elementOrders = {left: [], right: []}
        model.elementOrders.left[0] = 1;
        model.elementOrders.right[0] = 1;
        for (i=1; i<model.order; i++) {
            model.elementOrders.left[i] = -1;
            model.elementOrders.right[i] = -1;
        }

        // Table with bool arrays showing which elements are allowed in a cell
        model.openTable = new aljabr.OpenTable(model.order);
        // Remove bad identity slots
        if (model.factors.indexOf(2) === -1) {
            for (i=1; i<model.order; i++) {
                model.openTable.remove(i, i, 0);
            }
        }

        // Table with associations that declare pairs of cells equal
        model.associationTable = new aljabr.AssociationTable(model.order, model);

        // Set first column and row to identity
        model.setElement(0, 0, 0);

        // Last element is automatically set by setElement()
        for (i=1; i<model.order-1; i++) {
            model.setElement(0, i, i);
            model.setElement(i, 0, i);
        }
    },
    /**
     * Get a specific element.
     * @param i - row
     * @param j - column
     * @returns the element at position (i, j)
     */
    getElement: function(i, j) {
        'use strict';
        return this.table.getElement(i, j);
    },
    /**
     * Set a specific element.
     * @param i - row
     * @param j - column
     * @param element - Element to assign to (i, j)
     */
    setElement: function(i, j, element) {
        'use strict';
        var model, openTable, openList, assTable, tempEl, markQueue, head, row, col, el, x, assRules, assRow, assCol, assEl, nextPos, error;

        // console.log('GroupBuilder.setElement(' + i + ', ' + j + ', ' + element + ')');

        model = this;
        openTable = model.openTable;
        assTable = model.associationTable;

        tempEl = model.getElement(i, j);
        if (tempEl !== null) {
            if (tempEl === element) {
                console.log('element already exists at this position');
            }
            else {
                console.warn('Error: element already set to ' +
                             'another value, (' + i + ', ' + j +
                             ') = ' + tempEl);
            }
            return null;
        }
        
        // console.log('setElement(#{i}, #{j}, #{element})\n');
        if (0 <= i && i < model.order &&
            0 <= j && j < model.order &&
            0 <= element && element < model.order) {

            if (openTable.allowedList(i, j).length === 0) {
                if (element !== model.table.getElement(i, j)) {
                    console.warn('Error: cannot change (' + i +
                                 ', ' + j + '): ' +
                                 model.table.getElement(i, j) +
                                 ' to ' + element);
                }
                else {
                    console.warn('Error: already set');
                }
                return null;
            }
      
            // Is this element still allowed to be placed here?
            if (!openTable.isAllowed(i, j, element)) {
                error = 'Error: element ' + element +
                    ' is not allowed at (' + i + ', ' + j + ')\n';
                error += '  openTable[' + i + '][' + j + ']: ';
                _.each(openTable.allowedList(i, j), function(x) {
                    error += x + ' ';
                });
                console.warn(error);
                return null;
            }

            // markQueue: queue of elements to add to the OperatorTable
            markQueue = [[i, j, element]];
            while (markQueue.length > 0) {
                head = markQueue.splice(0, 1)[0];
                row = head[0];
                col = head[1];
                el = head[2];
                model.table.setElement(row, col, el);
                // model.checkAssociativityRules(row, col);

                // Add any elements required by associativity rules
                assRules = assTable.rules(row, col);
                if (assRules.length !== 0) {
                    for (assRow in assRules) {
                        assCol = assRules[assRow];
                        assEl = model.getElement(assRow, assCol);
                        if (assEl === null) {
                            markQueue.push([assRow, assCol, el]);
                        }
                        else if (assEl !== el) {
                            error = 'Error: associativity broken\n'
                            error += '  (' + row + ', ' + col + '): ' +
                                el + '\n';
                            error += '  (' + assRow + ', ' + assCol +
                                '): ' + assEl;
                            console.warn(error);
                        }
                    }
                }

                assTable.addAssociativityRules(row, col, el);
                
                // Remove element from other cells in this row and column;
                //   the if() clauses need to be separate
                openTable.clear(row, col);
                for (x=0; x<model.order; x++) {
                    // Remove from column
                    openTable.remove(x, col, el);
                    openList = openTable.allowedList(x, col);
                    if (openList.length === 1) {
                        markQueue.push([x, col, openList[0]]);
                    }
                    // Remove from row
                    openTable.remove(row, x, el);
                    openList = openTable.allowedList(row, x);
                    if (openList.length === 1) {
                        markQueue.push([row, x, openList[0]]);
                    }
                }

                // Check for single open positions
                nextPos = openTable.findNextPos();
                if (nextPos !== null) {
                    markQueue.push([nextPos.row, nextPos.col, nextPos.el])
                }
            }
        }
        else {
            console.log('Error: parameter exceeds group order ' + model.order);
            console.log('  setElement(' + i + ', ' + j + ', ' + element + ')');
        }
    },
    /**
     * TODO - return all known subsequences of powers starting with
     *   smallest element index
     * Get the order of an element.
     * @param el - element index
     * @param rightSide - whether or not multiplication is on right side; default true
     * @returns [order of the element (negative if order is not complete), last valid power]
     */
    elementOrder: function(el, rightSide) {
        'use strict';
        var model, order, seqs, i;

        model = this;
        
        if (el === 0) {
            return 1;
        }
        else if (el >= model.order) {
            console.log('Error: element index too large');
            return 0;
        }

        if (rightSide === undefined) {
            rightSide = true;
        }

        order = -1;
        seqs = model.subsequences(el, rightSide);
        if (seqs.length > 0) {
            for (i=0; i<seqs.length; i++) {
                if (seqs[i].length > order) {
                    order = seqs[i].length;
                }
            }
        }

        if (rightSide) {
            model.elementOrders.right[el] = -order;
        }
        else {
            model.elementOrders.left[el] = -order;
        }
        
        return -order;
    },
    /**
     * Get all subsequences for powers of the given element.
     * @param el - element index
     * @param rightSide - whether or not multiplication is on right side (col traversal); default true
     * @returns array of subsequences
     */
    subsequences: function(el, rightSide) {
        'use strict';
        var model, subseqs, starts, i, product;

        model = this;
        subseqs = [];

        if (rightSide === undefined) {
            rightSide = true;
        }

        starts = [];
        for (i=0; i<model.order; i++) {
            starts.push(true);
        }

        for (i=0; i<model.order; i++) {
            if (rightSide) {
                product = model.table.getElement(i, el);
            }
            else {
                product = model.table.getElement(el, i);
            }
            
            if (product === null) {
                starts[i] = false;
            }
            else {
                starts[product] = false;
            }
        }
        
        for (i=0; i<starts.length; i++) {
            if (starts[i]) {
                subseqs.push(model.subsequence(el, i, rightSide));
            }
        }

        return subseqs;
    },
    /**
     * Get the subsequence for powers of element1 starting at element2.
     * @param el1 - element index
     * @param el2 - element index
     * @param rightSide - whether or not multiplication is on right side (col traversal); default true
     * @returns array of elements from el2 to first null factor
     */
    subsequence: function(el1, el2, rightSide) {
        'use strict';
        var model, subseq, elPower, prevPower;

        model = this;
        subseq = [];
        
        if (el1 === 0) {
            return [0];
        }
        else if (el1 >= model.order) {
            console.log('Error: element index too large');
            return [0];
        }

        if (rightSide === undefined) {
            rightSide = true;
        }

        subseq.push(el2);
        // Loop through powers of el
        if (rightSide) {
            elPower = model.table.getElement(el2, el1);
            console.log('elPower: ' + elPower);
            while (elPower !== null && elPower !== el2) {
                subseq.push(elPower);
                elPower = model.table.getElement(elPower, el1);
            }
        }
        else {
            elPower = model.table.getElement(el1, el2);
            while (elPower !== null && elPower !== el2) {
                subseq.push(elPower);
                elPower = model.table.getElement(el1, elPower);
            }
        }

        return subseq;
    },
    /**
     * Get a table showing where an element can be placed.
     * @param element - element index
     * @returns boolean mask of openTable showing open positions
     */
    openPositions: function(element) {
        'use strict';
        
        return this.openTable.openPositions(element);
    },
    /**
     * Whether the operator table is completely filled out or not
     */
    isComplete: function() {
        'use strict';
        return this.table.isComplete();
    },
    /**
     * Validate and build a corresponding Group.
     */
    buildGroup: function() {
        'use strict';
        var model;

        model = this;
        // Identity was set in initialize()
        // Inverses guaranteed by e in every column and every row
        // Associativity guaranteed by association checks
        
        // Must have full OperatorTable
        if (model.isComplete()) {
            return new aljabr.Group(model.elements, model.table);
        }
    },
    /**
     * Create a String representation of the current (maybe incomplete) table.
     * @returns string representation of the operator table
     */
    toStr: function() {
        'use strict';
        var model, elements, colWidth, i, j, outStr;

        model = this;
        elements = model.elements;
        
        // Set column width to size of largest element symbol
        colWidth = 0;
        for (i=0; i<model.order; i++) {
            if (colWidth < elements[i].length) {
	        colWidth = elements[i].length;
            }
        }
        outStr = ' ' + aljabr.rJust(' ', colWidth) + ' |';

        for (i=0; i<model.order; i++) {
            outStr += ' ' +
                aljabr.rJust(elements[i], colWidth) +
                ' |';
        }
        outStr += '\n';

        for (i=0; i<=model.order; i++) {
            outStr += '-' + aljabr.rJust('-', colWidth, '-') + '-|';
        }
        outStr += '\n';

        for (i=0; i<model.order; i++) {
            outStr += ' ' +
                aljabr.rJust(elements[i], colWidth) +
                ' |';
            for (j=0; j<model.order; j++) {
                if (model.table.getElement(i, j) === null) {
	            outStr += ' ' + aljabr.rJust('.', colWidth) + ' |';
                }
                else {
	            outStr += ' ' +
                        aljabr.rJust(
                            elements[model.table.getElement(i, j)],
                            colWidth
                        ) +
                        ' |';
                }
            }
            outStr += '\n';
        }

        return outStr;
    },
    /**
     * Print out a table showing which elements can be placed in which
     * open positions in the operator table.
     */
    printOpenTable: function() {
        'use strict';

        this.openTable.printOpenTable();
    }
});


/**
 * Permutation representation of a group element from the symmetric group.
 */
aljabr.Permutor = aljabr.Class({
    actionArray: undefined,
    order: 0,
    /**
     * Initialize the class.
     * @param actionArray - permutor representation
     */
    init: function(actionArray) {
        'use strict';
        var model, i;

        // console.log('Permutor.init()');

        model = this;
        model.order = actionArray.length;
        
        // Validate actionArray
        // actionArray must be an array of integers from 0..actionArray.length-1
        // each integer appears only once
        // the array is a map from integer i to the integer actionArray[i]
        for (i=0; i<model.order; i++) {
            if (actionArray.indexOf(i) === -1) {
                console.log('Error: bad actionArray');
            }
        }
        model.actionArray = actionArray;
    },
    /**
     * Equality (was '===')
     * @param permutor - permutor to compare against
     */
    eq: function(permutor) {
        'use strict';
        return (this.toStr() === permutor.toStr());
    },
    /**
     * 
     * @param permutor - 
     */
    operate: function(permutor) {
        'use strict';
        var model, tempActionArray, i, perm;
        
        model = this;
        
        if (model.order !== permutor.order) {
            return null;
        }
        tempActionArray = [];
        for (i=0; i<model.actionArray.length; i++) {
            tempActionArray[i] = model.op(permutor.op(i));
        }
        perm = new aljabr.Permutor(tempActionArray);
        
        return perm;
    },
    /**
     * Return an element of actionArray.
     * @param num - index into actionArray
     */
    op: function(num) {
        'use strict';
        
        //puts 'op num: ' + num.toStr()
        return this.actionArray[num];
    },
    /**
     * Return a string representation of actionArray.
     */
    toStr2: function() {
        'use strict';
        var model, str, i;
        
        model = this;
        str = '[';
        for (i=0; i<model.actionArray.length; i++) {
            str += model.actionArray[i] + ' ';
        }
        
        str = str.trimRight();
        str += ']';
        
        return str;
    },
    /**
     * Return a string representation of actionArray.
     */
    toStr: function() {
        'use strict';
        var model, str, markArray, i, j;
        
        model = this;
        str = '';
        markArray = [];
        
        for (i=0; i<model.actionArray.length; i++) {
            if (!markArray[i] && model.actionArray[i] !== i) {
                markArray[i] = 1;
                str += '(' + i + ' ';
                j = model.actionArray[i];
                str += j + ' ';
                while (!markArray[j] && model.actionArray[j] !== i) {
                    markArray[j] = 1;
                    j = model.actionArray[j];
                    str += j + ' ';
                }
                markArray[j] = 1;
                str = str.trimRight() + ') ';
            }
        }
        
        // Identity element represented as 'e'
        str = str.trimRight();
        if (str.length === 0) {
            return 'e';
        }
        
        return str;
    }
});


aljabr.PermutationGroupBuilder = aljabr.Class({
    generators: undefined,
    permutors: undefined,
    group: undefined,
    permutorOrder: 0,
    /**
     * Initialize the class.
     * Pass in array of Permutors
     * @param generators - array of generators represented as +Permutors+
     */
    init: function(generators) {
        'use strict';
        var model;

        // console.log('PermutationGroupBuilder.init()');
        
        model = this;

        model.generators = generators;
        model.permutors = [];
        model.group = null;
        // XXX - getValidGenerators
        model.permutorOrder = model.generators[0].order;
    },
    /**
     * Return a hash from generators to booleans (whether they're valid or not)
     * A generator is valid if it has the largest order of a set of conflicting
     * generators (e.g. r is valid compared with r^2 and r^3).
     */
    getValidGenerators: function() {
        'use strict';
        
    },
    /**
     * Create a list of all elements with which to build the Group
     * Breadth-first search using the generators and starting with the identity
     * element.
     */
    findElements: function() {
        'use strict';
        var model, identityActionArray, i, j, tempPermutor;

        model = this;

        // Walk each generator down the Permutor array, multiplying by the current
        // permutor and adding any new results to the end of the array.
        identityActionArray = [];
        for (i=0; i<model.permutorOrder; i++) {
            identityActionArray.push(i);
        }
        model.permutors.push(new aljabr.Permutor(identityActionArray));

        for (i=0; i<model.permutors.length; i++) {
            for (j=0; j<model.generators.length; j++) {
	        tempPermutor = model.generators[j].operate(model.permutors[i]);
                if (model.permutorIndex(tempPermutor) === -1) {
                    model.permutors.push(tempPermutor);
                }
            }
        }
    },
    /**
     * Build a group from a set of permutor generators.
     */
    buildGroup: function() {
        'use strict';
        var model, elementArray, elements, groupBuilder, i, j;

        model = this;
        if (model.permutors.length === 0) {
            model.findElements();
        }

        // Create ElementSet corresponding to permutors
        elementArray = [];
        for (i=0; i<model.permutors.length; i++) {
            elementArray.push(i.toString());
        }
        elements = elementArray;

        // Loop through elements and fill out GroupBuilder
        groupBuilder = new aljabr.GroupBuilder(elements);
        for (i=0; i<model.permutors.length; i++) {
            for (j=0; j<model.permutors.length; j++) {
                groupBuilder.setElement(i, j,
                                        model.permutorIndex(
                                            model.permutors[j].operate(model.permutors[i])
                                        ));
                // model.permutors.index(model.permutors[j].operate(model.permutors[i])));
                if (groupBuilder.isComplete()) {
                    // console.log('COMPLETE\n');
                    break;
                }
            }
            if (groupBuilder.isComplete()) {
                // console.log('COMPLETE\n');
                break;
            }
        }
        // puts 'group:';
        // puts groupBuilder;
        if (!groupBuilder.isComplete()) {
            console.log('Error: groupBuilder is not complete');
        }

        model.group = groupBuilder.buildGroup();
        return model.group;
    },
    /**
     * Retrieve the current group.
     * @returns Group
     */
    getGroup: function() {
        'use strict';
        var model;

        model = this;
        if (model.group === null) {
            model.buildGroup();
        }
        return model.group;
    },
    /**
     * Print the permutors that generate the group.
     */
    printPermutors: function() {
        'use strict';
        var model, i;

        model = this;
        
        for (i=0; i<model.permutors.length; i++) {
            console.log(i + ': ' + model.permutors[i].toStr());
        }
    },
    /**
     * Find the index of permutor in model.permutors
     */
    permutorIndex: function(permutor) {
        'use strict';
        var model, index, i;

        model = this;
        index = -1;

        for (i=0; i<model.permutors.length; i++) {
            if (permutor.eq(model.permutors[i])) {
                index = i;
                break;
            }
        }

        return index;
    }
});



aljabr.ArithmeticGroupBuilder = aljabr.Class({
    elements: undefined,
    operator: undefined,
    group: undefined,
    modulo: 1,
    /**
     * Initialize the class.
     * Pass in the list of elements (integers) and the operation used
     * to build the Group.
     * @param elements {list} - array of elements
     * @param operator {string} - '+' or '*'
     */
    init: function(elements, operator, modulo) {
        'use strict';
        var model;

        // console.log('ArithmeticGroupBuilder.init()');
        
        model = this;

        model.elements = elements;
        model.modulo = modulo;
        model.group = null;
        
        if (operator === '+') {
            model.operator = function(x, y) {
                return x+y;
            };
        }
        else if (operator === '*') {
            model.operator = function(x, y) {
                return x*y;
            };
        }
        else {
            console.error('Error - unknown operator: ' + operator);
        }
    },
    /**
     * Build a group from a set of integers and an arithmetic operator.
     */
    buildGroup: function() {
        'use strict';
        var model, elements, numElements, elementSet, elementIdxs, groupBuilder, i, j;

        model = this;
        elements = model.elements;
        numElements = model.elements.length;

        // Loop through elements and fill out GroupBuilder
        elementSet = [];
        elementIdxs = {};
        for (i=0; i<numElements; i++) {
            elementSet.push(elements[i].toString());
            elementIdxs[elements[i]] = i;
        }
        groupBuilder = new aljabr.GroupBuilder(elementSet);
        
        for (i=1; i<numElements; i++) {
            for (j=1; j<numElements; j++) {
                groupBuilder.setElement(
                    i, j, elementIdxs[model.operator(elements[i], elements[j])%model.modulo]
                );
                if (groupBuilder.isComplete()) {
                    console.log('COMPLETE\n');
                    break;
                }
            }
            if (groupBuilder.isComplete()) {
                console.log('COMPLETE\n');
                break;
            }
        }

        if (!groupBuilder.isComplete()) {
            console.log('Error: groupBuilder is not complete');
        }

        model.group = groupBuilder.buildGroup();
        
        return model.group;
    },
    /**
     * Retrieve the current group.
     * @returns Group
     */
    getGroup: function() {
        'use strict';
        var model;

        model = this;
        if (model.group === null) {
            model.buildGroup();
        }
        return model.group;
    }
});



/**
 * Build a cyclic group.
 * @param order - order of the group
 * @returns built cyclic group
 */
aljabr.buildCyclicGroup = function(order) {
    'use strict';
    var cycleActionArray, i, cycle, cyclicGroupBuilder;
  
    if (order <= 0) {
        return null;
    }

    cycleActionArray = [];
    for (i=0; i<order; i++) {
        cycleActionArray[i] = null;
    }
    
    if (order === 1) {
        cycleActionArray[0] = 0;
    }
    else {
        for (i=0; i<order; i++) {
            cycleActionArray[i] = i+1;
        }
        cycleActionArray[order-1] = 0;
    }
    cycle = new aljabr.Permutor(cycleActionArray);
    cyclicGroupBuilder = new aljabr.PermutationGroupBuilder([cycle]);

    return cyclicGroupBuilder.getGroup();
};


/**
 * Build a dihedral group.
 * @param degree - half of the order of the group
 * @returns built dihedral group
 */
aljabr.buildDihedralGroup = function(degree) {
    'use strict';
    var dihedralActionArray1, dihedralActionArray2, i, dihed1, dihed2, dihedralGroupBuilder;

    if (degree <= 0) {
        return null;
    }

    dihedralActionArray1 = [];
    dihedralActionArray2 = [];

    // XXX - should throw an exception; no Dih1 or Dih2
    if (degree === 1 || degree === 2) {
        return aljabr.buildCyclicGroup(degree);
    }
    else {
        for (i=0; i<degree+2; i++) {
            dihedralActionArray1[i] = i+1;
            dihedralActionArray2[i] = i;
        }
        dihedralActionArray1[degree-1] = 0;
        dihedralActionArray1[degree] = degree;
        dihedralActionArray1[degree+1] = degree+1;
        dihedralActionArray2[degree] = degree+1;
        dihedralActionArray2[degree+1] = degree;
    }

    dihed1 = new aljabr.Permutor(dihedralActionArray1);
    dihed2 = new aljabr.Permutor(dihedralActionArray2);
    dihedralGroupBuilder = new aljabr.PermutationGroupBuilder([dihed1, dihed2]);
    
    return dihedralGroupBuilder.getGroup();
};


/**
 * Build a symmetry group.
 * XXX - using WAY more generators than are needed
 * @param degree - order of the group is degree!
 * @returns built symmetry group
 */
aljabr.buildSymmetryGroup = function(degree) {
    'use strict';
    var numActionArrays, symmetryActionArrays, num1, num2, i, j, transpositions, symmetryGroupBuilder;

    if (degree <= 0) {
        return null;
    }

    if (degree === 1 || degree === 2) {
        return aljabr.buildCyclicGroup(degree);
    }

    numActionArrays = (degree*degree - degree)/2;
    symmetryActionArrays = [];
    for (i=0; i<numActionArrays; i++) {
        symmetryActionArrays[i] = null;
    }

    // Build actionArrays like [0, 1, 2, ...] then switch
    // elements at indices num1 and num2
    num1 = 0;
    num2 = 1;
    for (i=0; i<numActionArrays; i++) {
        symmetryActionArrays[i] = [];
        for (j=0; j<degree; j++) {
            symmetryActionArrays[i][j] = j;
        }
        symmetryActionArrays[i][num1] = num2;
        symmetryActionArrays[i][num2] = num1;
        num2 += 1;
        if (num2 === degree) {
            num1 += 1;
            num2 = num1 + 1;
        }
    }
  
    transpositions = [];
    for (i=0; i<numActionArrays; i++) {
        transpositions[i] = new aljabr.Permutor(symmetryActionArrays[i]);
    }

    symmetryGroupBuilder = new aljabr.PermutationGroupBuilder(transpositions);

    return symmetryGroupBuilder.getGroup();
};


/**
 * Build an alternating group.
 * XXX - using WAY more generators than are needed
 * @param degree - order of the group is degree!/2
 * @returns built alternating group
 */
aljabr.buildAlternatingGroup = function(degree) {
    'use strict';
    var numActionArrays, alternatingActionArrays, i, j, k, arrayCount, transpositions, alternatingGroupBuilder;

    if (degree <= 1) {
        // return null;
        return aljabr.buildCyclicGroup(degree);
    }

    if (degree === 2) {
        return aljabr.buildCyclicGroup(degree);
    }

    // Number generators = choose(degree, 3)
    numActionArrays = degree * (degree-1) * (degree-2) / 6;
    alternatingActionArrays = [];

    // Build actionArrays like [0, 1, 2, ...]
    for (i=0; i<numActionArrays; i++) {
        alternatingActionArrays[i] = [];
        for (j=0; j<degree; j++) {
            alternatingActionArrays[i][j] = j;
        }
    }

    // Switch elements at indices num1, num2, and num3
    arrayCount = 0;
    for (i=0; i<degree-2; i++) {
        for (j=i+1; j<degree-1; j++) {
            for (k=j+1; k<degree; k++) {
	        alternatingActionArrays[arrayCount][i] = j;
	        alternatingActionArrays[arrayCount][j] = k;
	        alternatingActionArrays[arrayCount][k] = i;
	        arrayCount += 1;
            }
        }
    }
  
    transpositions = [];
    for (i=0; i<numActionArrays; i++) {
        transpositions[i] = new aljabr.Permutor(alternatingActionArrays[i]);
    }

    alternatingGroupBuilder = new aljabr.PermutationGroupBuilder(transpositions);

    return alternatingGroupBuilder.getGroup();
};


/**
 * Build the direct product group of two existing groups.
 * @param group1 - first group
 * @param group2 - second group
 * @returns direct product of group1 and group2
 */
aljabr.buildProductGroup = function(group1, group2) {
    'use strict';
    var elArray, elCount, backMap, backMap2, i, j, elements, productBuilder, el1, el2;
    
    elArray = [];
    elCount = 0;
    backMap = [];
    backMap2 = [];
    // Create new ElementSet
    for (i=0; i<group1.order; i++) {
        backMap[i] = [];
        for (j=0; j<group2.order; j++) {
            elArray.push('(' +
                         group1.elements[i] +
                         ',' +
                         group2.elements[j] +
                         ')');
            backMap[i][j] = elCount;
            elCount += 1;
            backMap2.push([i, j]);
        }
    }

    elements = elArray;
    productBuilder = new aljabr.GroupBuilder(elements);

    // Loop through Groups
    for (i=0; i<productBuilder.order; i++) {
        for (j=0; j<productBuilder.order; j++) {
            el1 = group1.getElement(backMap2[i][0], backMap2[j][0]);
            el2 = group2.getElement(backMap2[i][1], backMap2[j][1]);
            productBuilder.setElement(i, j, backMap[el1][el2]);
        }
    }
  
    return productBuilder.buildGroup();
};


/**
 * Build a finite Field.
 * @param order - order of the Field
 * @returns built Field
 */
aljabr.buildField = function(order) {
    'use strict';
    var i, elements1, elements2, agb1, group1, agb2, group2, field;
  
    if (order <= 0) {
        return null;
    }

    elements1 = [];
    for (i=0; i<order; i++) {
        elements1.push(i);
    }
    
    elements2 = [];
    for (i=1; i<order; i++) {
        elements2.push(i);
    }

    agb1 = new aljabr.ArithmeticGroupBuilder(elements1, '+', 5);
    group1 = agb1.buildGroup();

    agb2 = new aljabr.ArithmeticGroupBuilder(elements2, '*', 5);
    group2 = agb2.buildGroup();

    field = new aljabr.Field(elements1, group1, group2);
    return field;
};


/**
 * Right justify.
 * @param inStr - string to justify
 * @param justLen - column width in characters
 * @param fillChar - character used for padding; default: ' '
 * @returns justified string
 */
aljabr.rJust = function(inStr, justLen, fillChar) {
    'use strict';
    var outStr, i;

    outStr = inStr;

    if (typeof fillChar !== 'string' ||
        fillChar.length !== 1) {
        fillChar = ' ';
    }

    for (i=inStr.length; i<justLen; i++) {
        outStr = fillChar + outStr;
    }

    return outStr;
};


/**
 * Find all integer factors for a given number.
 * @param num - number to factor
 * @returns - sorted list of integer factors
 */
aljabr.factors = function(num) {
    'use strict';
    var primeFactors, factor, primeCount, i, powers, factors;

    primeFactors = aljabr.primeFactors(num);

    primeCount = {};
    for (i=0; i<primeFactors.length; i++) {
        factor = primeFactors[i];
        if (primeCount[factor] === undefined) {
            primeCount[factor] = 1;
        }
        else {
            primeCount[factor]++;
        }
    }

    powers = [];
    for (i in primeCount) {
        powers.push(aljabr.powers(i, primeCount[i]));
    }

    factors = [];
    if (powers.length > 0) {
        factors = powers[0].slice();
        for (i=1; i<powers.length; i++) {
            factors = factors.concat(aljabr.cartProduct(factors, powers[i]));
            factors = factors.concat(powers[i]);
        }
        factors.sort(aljabr.numCompare);
    }
    
    return factors;
};

/**
 * Prime factorization.
 * @param num - number to factor
 * @param factors - temporary list of calculated prime factors
 * @returns - list of prime factors
 */
aljabr.primeFactors = function(num, factors) {
    'use strict';
    var root, x;
    
    root = Math.sqrt(num);
    if (factors === undefined) {
        factors = [];
    }
    x = 2; 
  
    if (num % x) {
        x = 3;
        while ((num % x) && ((x = x + 2) < root)) {}
    }
    
    x = (x <= root) ? x : num;
    factors.push(x);
    
    return (x === num) ? factors : aljabr.primeFactors(num/x, factors);
};

/**
 * Get list of powers for a given number.
 * @param {number} num - number to multiply by itself
 * @param {number} count - number of powers to calculate
 * @returns array of powers
 */
aljabr.powers = function(num, count) {
    'use strict';
    var i, powers, tempNum;

    powers = [];
    tempNum = 1;
    for (i=0; i<count; i++) {
        tempNum *= num;
        powers.push(tempNum);
    }
    
    return powers;
};


/**
 * Get all pairwise products between two lists of elements.
 * @param nums1 - list of numbers
 * @param nums2 - list of numbers
 * @returns all pairwise products
 */
aljabr.cartProduct = function(nums1, nums2) {
    'use strict';
    var products, i, j;

    products = [];
    for (i=0; i<nums1.length; i++) {
        for (j=0; j<nums2.length; j++) {
            products.push(nums1[i] * nums2[j]);
        }
    }
    
    return products;
};


/**
 * Comparison function for sorting arrays of numbers.
 * @param {number} a
 * @param {number} b
 * @returns a-b
 */
aljabr.numCompare = function(a, b) {
    'use strict';
    return a-b;
};


/**
 * Take the factorial of a number.
 * @param {number} num
 * @returns num!
 */
aljabr.factorial = function(num) {
    'use strict';
    var result, i;
    
    result = 1;
    for (i=2; i<=num; i++)
        result = result * i;
    return result;
}


//----------------------------
// Namespacing
//----------------------------

/**
 * Parse dot-separated namespace strings,
 * create corresponding nested namespaces,
 * and add to an existing top-level namespace.
 * ns_string is the namespace extension so to get
 * myApp.models.model1 use:
 *   extend(myApp, 'models.model1');
 * @param ns
 * @param nsString
 */
function extend(ns, nsString) {  
    'use strict';
    var parts, parent, pl, i;

    parts = nsString.split('.');
    parent = ns;
    pl = parts.length;

    for (i = 0; i < pl; i++) {
        // create a property if it doesnt exist
        if (parent[parts[i]] === undefined) {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}
