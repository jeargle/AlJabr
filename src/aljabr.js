/*global console: false, aljabr: false, _: false */

/**
 * John Eargle (mailto: jeargle at gmail.com)
 * 2007-2015
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
     * The +new+ class method initializes the class.
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
 * Symbol representation of an element.
 */
aljabr.Element = aljabr.Class({
    /**
     * The +new+ class method initializes the class.
     * @param symbol - string representation of an element
     */
    init: function(symbol) {
        'use strict';

        if (typeof symbol === 'string') {
            this.symbol = symbol;
        }
        else {
            this.symbol = symbol.toString();
        }
    },
    /**
     * Return the string representation.
     * @returns the symbol
     */
    symbol: function() {
        'use strict';
        return this.symbol;
    },
    /**
     *
     * returns string representation of the symbol
     */
    toStr: function() {
        'use strict';
        return this.symbol;
    }
});


/**
 * XXX - is this class really needed?
 * Immutable array holding a set of Elements.
 * Mapping from 0-indexed integers to Elements.
 */
aljabr.ElementSet = aljabr.Class({
    elementArray: undefined,
    order: 0,
    /**
     * The +new+ class method initializes the class.
     * @param elementArray - array of Elements
     */
    init: function(elementArray) {
        'use strict';
        var model;

        model = this;
        
        model.elementArray = elementArray;
        model.order = model.elementArray.length;
    },
    /**
     * Retrieve the Element at a given index.
     * @param i - index
     */
    element: function(i) {
        'use strict';
        return this.elementArray[i];
    }
    // XXX - defined in structures that have identity elements.
    // Get identity Element.
    // identity
    //   return @elementArray[@identity_index]
    // }
});



/**
 * Immutable, validated Group.
 */
aljabr.Group = aljabr.Class({
    elements: null,
    order: 0,
    table: null,
    /**
     * The +new+ class method initializes the class.
     * @param elements - ElementSet with all the group elements
     */
    init: function(elements, table) {
        'use strict';
        var model;

        model =  this;
        model.elements = elements;
        model.order = model.elements.order;
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
     * Create a String representation of the current operator table.
     * @returns string representation of the operator table
     */
    toStr: function() {
        'use strict';
        var model, colWidth, outString, i, j;
        
        model = this;
        
        // Set column width to size of largest element symbol
        colWidth = 0;
        for (i=0; i<model.order; i++) {
            if (colWidth < model.elements.element(i).symbol.length) {
	        colWidth = model.elements.element(i).symbol.length;
            }
        }
        
        outString = ' ' + aljabr.rJust(' ', colWidth) + ' |';
        for (i=0; i<model.order; i++) {
            outString += ' ' +
                aljabr.rJust(model.elements.element(i).symbol,
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
                aljabr.rJust(model.elements.element(i).symbol,
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
                            model.elements.element(
                                model.table.getElement(i, j)
                            ).symbol,
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
 * This class holds an intermediate representation for a Group that
 * has not been fully built.  It should allow for the placement
 * of Elements in an OperatorTable as long as they maintain the
 * possibility of creating a valid Group.
 */
aljabr.GroupBuilder = aljabr.Class({
    elements: undefined,
    order: 0,
    table: undefined,
    openTable: undefined,
    /**
     * The +new+ class method initializes the class.
     * @param elements - ElementSet with all the group elements
     */
    init: function(elements) {
        'use strict';
        var model, i, j, k;
        
        model = this;
        model.elements = elements;
        model.order = model.elements.order;
        model.table = new aljabr.OperatorTable(model.order);
        
        // Table with bool arrays showing which elements are allowed in a cell
        model.openTable = [];
        for (i=0; i<model.order; i++) {
            model.openTable[i] = [];
            for (j=0; j<model.order; j++) {
                model.openTable[i][j] = [];
                // model.openTable[i][j] = (0..model.order-1).to_set();
                for (k=0; k<model.order; k++) {
                    model.openTable[i][j][k] = k;
                }
            }
        }

        // Table with associations that declare pairs of cells equal
        model.associationTable = [];
        for (i=0; i<model.order; i++) {
            model.associationTable[i] = [];
            for (j=0; j<model.order; j++) {
                model.associationTable[i][j] = null;
            }
        }

        // Set first column and row to identity
        model.setElement(0, 0, 0);

        // Last element is automatically set by setElement()
        for (i=0; i<model.order; i++) {
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
     * XXX - can an element be overwritten or just set once?
     * @param i - row
     * @param j - column
     * @param element - Element to assign to (i, j)
     */
    setElement: function(i, j, element) {
        'use strict';
        var model, markQueue, head, row, col, el, elIndex, x;

        model = this;
        // console.log('setElement(#{i}, #{j}, #{element})\n');
        if (0 <= i && i < model.order &&
            0 <= j && j < model.order &&
            0 <= element && element < model.order) {

            if (model.openTable[i][j].length === 0) {
                if (element !== model.table.getElement(i, j)) {
                    console.log('Error: cannot change (' + i +
                                ', ' + j + '): ' +
                                model.table.getElement(i, j) +
                                ' to ' + element + '\n');
                }
                else {
                    // console.log('Already set\n');
                }
                return null;
            }
      
            // Is this element still allowed to be placed here?
            // if (!model.openTable[i][j].include?(element)) {
            if (model.openTable[i][j].indexOf(element) === -1) {
                console.log('Error: element #{element} is not allowed at (#{i}, #{j})\n');
                console.log('model.openTable[i][j]:');
                _.each(model.openTable[i][j], function(x) {
                    console.log(x + ' ');
                });
                console.log('\n');
                return null;
            }
      
            markQueue = [];
            markQueue.push([i, j, element]);
            while (markQueue.length > 0) {
                head = markQueue.splice(0, 1)[0];
                row = head[0];
                col = head[1];
                el = head[2];
                model.checkAssociativityRules(row, col);
                model.table.setElement(row, col, el);
                model.addAssociativityRules(row, col, el);
                
                // Remove element from other cells in this row and column
                // model.openTable[row][col].clear();
                model.openTable[row][col] = [];
                for (x=0; x<model.order; x++) {
                    // Remove from column
                    // if (model.openTable[x][col].include?(el)) {
                    elIndex = model.openTable[x][col].indexOf(el);
                    if (elIndex > -1) {
                        // model.openTable[x][col].delete(el);
                        model.openTable[x][col].splice(elIndex, 1);
                        if (model.openTable[x][col].length === 1) {
                            _.each(model.openTable[x][col], function(lastEl) {
                                markQueue.push([x, col, lastEl]);
                            });
                        }
                    }
                    // Remove from row
                    // if (model.openTable[row][x].include?(el)) {
                    elIndex = model.openTable[row][x].indexOf(el);
                    if (elIndex > -1) {
                        // model.openTable[row][x].delete(el);
                        model.openTable[row][x].splice(elIndex, 1);
                        if (model.openTable[row][x].length === 1) {
                            _.each(model.openTable[row][x], function(lastEl) {
                                markQueue.push([row, x, lastEl]);
                            });
                        }
                    }
                }
            }
        }
        // XXX - else throw exception
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
            console.log('Error: element index too large');
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
            return 0;
        }

        return order;
    },
    /**
     * Get a table showing where an element can be placed.
     * @param el - element index
     * @returns boolean mask of openTable showing open positions
     */
    openPositions: function(el) {
        'use strict';
        var model, open, i, j;

        model = this;

        // Table with bool arrays showing which elements are allowed in a cell
        open = [];
        for (i=0; i<model.order; i++) {
            open[i] = [];
            for (j=0; j<model.order; j++) {
                open[i][j] = false;
                if (model.openTable[i][j].length > 0 &&
                    model.openTable[i][j].indexOf(el) >= 0) {
                    open[i][j] = true;
                }
            }
        }
        
        return open;
    },
    /**
     * Check associativity rules for this position.
     * @param i - row
     * @param j - column
     */
    checkAssociativityRules: function(row, col) {
        'use strict';

        if (this.associationTable[row][col] !== null) {
            // console.log('Association rule: #{this.associationTable[row][col]}\n');
        }
    },
    /**
     * Add any new associativity rules that result from the addition
     * of this element ad this position.
     * @param i - row
     * @param j - column
     * @param el - element index to assign to (i, j)
     */
    addAssociativityRules: function(row, col, el) {
        'use strict';
        var model;

        model = this;
        if (row === col) {
            // a(aa) = (aa)a
            // aa = b
            // => ab = ba
            model.associationTable[row][el] = [el, row];
            model.associationTable[el][row] = [row, el];
        }
        else {
            if (el === model.table.getElement(row, col)) {
                // a(ba) = (ab)a
                // ba = c, ab = c (a and b commute)
                // => ac = ca, bc = cb
                model.associationTable[row][el] = [el, row];
                model.associationTable[el][row] = [row, el];
                model.associationTable[col][el] = [el, col];
                model.associationTable[el][col] = [col, el];
            }

            // b(aa) = (ba)a, a(ab) = (aa)b
            // aa = c, ba = d, ab = f
            // => bc = da, af = cb
            
            // a(ba) = (ab)a, b(ab) = (ba)b
            // ba = c, ab = d
            // => ac = da, bd = cb
            
            // Most general case
            // c(ba) = (cb)a
            // ba = d, cb = f
            // cd = fa
        }
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
            if (colWidth < elements.element(i).symbol.length) {
	        colWidth = elements.element(i).symbol.length;
            }
        }
        outStr = ' ' + aljabr.rJust(' ', colWidth) + ' |';

        for (i=0; i<model.order; i++) {
            outStr += ' ' +
                aljabr.rJust(elements.element(i).symbol, colWidth) +
                ' |';
        }
        outStr += '\n';

        for (i=0; i<=model.order; i++) {
            outStr += '-' + aljabr.rJust('-', colWidth, '-') + '-|';
        }
        outStr += '\n';

        for (i=0; i<model.order; i++) {
            outStr += ' ' +
                aljabr.rJust(elements.element(i).symbol, colWidth) +
                ' |';
            for (j=0; j<model.order; j++) {
                if (model.table.getElement(i, j) === null) {
	            outStr += ' ' + aljabr.rJust('.', colWidth) + ' |';
                }
                else {
	            outStr += ' ' +
                        aljabr.rJust(
                            elements.element(model.table.getElement(i, j)).symbol,
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
     *
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
                // console.log('openTable[' + i + '][' + j + '].class: ' + model.openTable[i][j].class + '\n');
                // console.log('openTable[' + i + '][' + j + '].length: ' + model.openTable[i][j].length + '\n');
                // console.log('openTable[0][0].length: ' + model.openTable[0][0].length + '\n');
                _.each(model.openTable[i][j], function(el) {
                    // console.log(el.class + ' ');
                    console.log(el + ' ');
                });
                console.log('\n');
            }
        }
    }
});


/**
 * Permutation representation of a group element from the symmetric group.
 */
aljabr.Permutor = aljabr.Class({
    actionArray: undefined,
    order: 0,
    /**
     * The +new+ class method initializes the class.
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
            // if (!actionArray.include?(i)) {
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
     * The +new+ class method initializes the class.
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
            elementArray.push(new aljabr.Element(i));
        }
        elements = new aljabr.ElementSet(elementArray);

        // Loop through elements and fill out GroupBuilder
        groupBuilder = new aljabr.GroupBuilder(elements);
        for (i=0; i<model.permutors.length; i++) {
            // console.log('i: ' + i);
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
            elArray.push(
                new aljabr.Element('(' +
                                   group1.elements.element(i).symbol +
                                   ',' +
                                   group2.elements.element(j).symbol +
                                   ')')
            );
            backMap[i][j] = elCount;
            elCount += 1;
            backMap2.push([i, j]);
        }
    }

    elements = new aljabr.ElementSet(elArray);
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
