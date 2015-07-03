/**
 * John Eargle (mailto: jeargle at gmail.com)
 * 2007-2015
 * aljabr
 */

require 'set'

/**
 * This class holds the elements of a multiplication table.
 * The table only contains ints or null; the ints are indices
 * into an ElementSet array.
 * OperatorTables are generic so they may be used for Groups,
 * Rings, Fields, etc.  No validation is done in this class
 * for element placement, that happens in the corresponding
 * Builder classes.
 */
aljabr.OperatorTable = {
    /**
     * The +new+ class method initializes the class.
     * @param order - number of rows (and columns) in the table
     */
    initialize: function(order) {
        'use strict';
        var model, i;

        model = this;
        model.order = order;
        model.emptyCellCount = model.order * model.order;
        model.table = Array.new(model.order);
        _.each([0..model.order-1], function(i) {
            model.table[i] = Array.new(model.order);
        });
    },
    /**
     * Number of Elements in the OperatorTable.
     */
    order: function() {
        'use strict';
        return this.order;
    },
    /**
     * Set the element for a given position in the table.
     * @param i - row
     * @param j - column
     * @param element - value to set the element to (int)
     */
    set_element: function(i, j, element) {
        'use strict';
        var model;

        model = this;
        
        if 0 <= i && i < model.order && 0 <= j && j < model.order && 0 <= element && element < model.order {
            if model.table[i][j] === null {
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
     * @returns 
     */
    get_element: function(i, j) {
        'use strict';
        
        return this.table[i][j];
    },
    /**
     * Remove an element index from the table.
     * @param i - row
     * @param j - column
     */
    remove_element: function(i, j) {
        'use strict';
        this.table[i][j] = null;
    },
    /**
     * @returns 
     */
    isComplete: function() {
        'use strict';
        return this.emptyCellCount === 0;
    }
};


/**
 * Symbol representation of an element.
 */
aljabr.Element = {
    /**
     * The +new+ class method initializes the class.
     * @param symbol - string representation of an element
     */
    initialize: function(symbol) {
        'use strict';
        this.symbol = symbol;
    },
    /**
     * Return the string representation.
     * @returns 
     */
    symbol: function() {
        'use strict';
        return this.symbol;
    },
    toStr: function() {
        'use strict';
        return this.symbol;
    }
};


/**
 * XXX - is this class really needed?
 * Immutable array holding a set of Elements.
 * Mapping from 0-indexed integers to Elements.
 */
aljabr.ElementSet = {
    /**
     * The +new+ class method initializes the class.
     * @param elementArray - array of Elements
     */
    initialize: function(elementArray) {
        'use strict';
        this.elementArray = elementArray;
    },
    /**
     *  Number of Elements in the ElementSet.
     */
    order: function() {
        'use strict';
        return this.elementArray.length;
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
};



/**
 * Immutable, validated Group.
 */
aljabr.Group = {
    elements: null,
    order: 0,
    table: null,
    /**
     * The +new+ class method initializes the class.
     * @param elements - ElementSet with all the group elements
     */
    initialize: function(elements, table) {
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
    get_identity: function() {
        'use strict';
        return this.table.get_element(0, 0);
    },
    /**
     * Get a specific element.
     * @param i - row
     * @param j - column
     * @returns the element at position (i, j)
     */
    get_element: function(i, j) {
        'use strict';
        return this.table.get_element(i, j);
    },
    /**
     * Get the order of an element.
     * @param el - element index
     * @returns order of the element
     */
    elementOrder: function(el) {
        'use strict';
        var model, order, el_power;

        model = this;
            
        if (el === 0) {
            return 1;
        }
        else if (el >= model.order) {
            console.log("Error: element index too large");
            return 0;
        }

        order = 1;
        el_power = el;
        // Loop through powers of el
        while (el_power !== null and el_power !== 0) {
            el_power = model.table.get_element(el_power, el);
            order += 1;
        }

        if (el_power === null) {
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

        order = elementOrder(el);
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
        var model, columnWidth, outString, i, j;
        
        model = this;
        
        // Set column width to size of largest element symbol
        columnWidth = 0;
        for (i in [0..model.order-1]) {
            if (columnWidth < model.elements.element(i).symbol.length) {
	        columnWidth = model.elements.element(i).symbol.length;
            }
        }
        
        outString = " #{" ".rjust(columnWidth)} |";
        for (i in [0..model.order-1]) {
            outString += " #{model.elements.element(i).symbol.rjust(columnWidth)} |";
        }
        outString += "\n";

        for (i in [0..model.order]) {
            outString += "-#{"-".rjust(columnWidth, "-")}-|";
        }
        outString += "\n";

        for (i in [0..model.order-1]) {
            outString += " #{model.elements.element(i).symbol.rjust(columnWidth)} |";
            for (j in [0..model.order-1]) {
                // outString += " #{model.elements.element(model.table.get_element(i, j)).symbol.rjust(columnWidth)} |"
                if (model.table.get_element(i, j) === null) {
	            outString += " #{'.'.rjust(columnWidth)} |";
                }
                else {
	            outString += " #{model.elements.element(model.table.get_element(i, j)).symbol.rjust(columnWidth)} |";
                }
            }
            outString += "\n";
        }
        
        return outString;
    }
};


/**
 * This class holds an intermediate representation for a Group that
 * has not been fully built.  It should allow for the placement
 * of Elements in an OperatorTable as long as they maintain the
 * possibility of creating a valid Group.
 */
aljabr.GroupBuilder = {
    order: 0,
    /**
     * The +new+ class method initializes the class.
     * @param elements - ElementSet with all the group elements
     */
    initialize: function(elements) {
        'use strict';
        var model;
        
        model = this;
        model.elements = elements;
        model.order = model.elements.order;
        model.table = OperatorTable.new(model.order);
        
        // Table with bool arrays showing which elements are allowed in a cell
        model.openTable = Array.new(model.order)
        _.each([-0..model.order-1], function(i) {
            model.openTable[i] = Array.new(model.order);
        });
        _.each([0..model.order-1], function(j) {
            model.openTable[i][j] = (0..model.order-1).to_set;
        });

        // Table with associations that declare pairs of cells equal
        model.associationTable = Array.new(model.order);
        model.associationTable = Array.new(model.order);
        _.each([0..model.order-1], function(i) {
            model.associationTable[i] = Array.new(model.order);
        });

        // Set first column and row to identity
        set_element(0, 0, 0);

        // Last element is automatically set by set_element()
        _.each([1..model.order-2], function(i) {
            set_element(0, i, i);
            set_element(i, 0, i);
        });
    },
    /**
     * Get a specific element.
     * @param i - row
     * @param j - column
     * @returns the element at position (i, j)
     */
    get_element: function(i, j) {
        'use strict';
        return this.table.get_element(i, j);
    },
    /**
     * Set a specific element.
     * XXX - can an element be overwritten or just set once?
     * @param i - row
     * @param j - column
     * @param element - Element to assign to (i, j)
     */
    set_element: function(i, j, element) {
        'use strict';
        var model, markQueue, row, col, el;

        model = this;
        // console.log("set_element(#{i}, #{j}, #{element})\n");
        if (0 <= i && i < model.order &&
            0 <= j && j < model.order &&
            0 <= element && element < model.order) {

            if (model.openTable[i][j].size === 0) {
                if (element !== model.table.get_element(i, j)) {
                    console.log("Error: cannot change (#{i}, #{j}): #{model.table.get_element(i, j)} to #{element}\n");
                }
                else {
                    // console.log("Already set\n");
                }
                return null;
            }
      
            // Is this element still allowed to be placed here?
            if (!model.openTable[i][j].include?(element)) {
                console.log("Error: element #{element} is not allowed at (#{i}, #{j})\n");
                console.log("model.openTable[i][j]:");
                _.each(model.openTable[i][j], function(x) {
                    console.log("#{x} ");
                });
                console.log("\n");
                return null;
            }
      
            markQueue = [];
            markQueue.push([i, j, element]);
            while (markQueue.length > 0) {
                row, col, el = markQueue.shift;
                check_associativity_rules(row, col);
                model.table.set_element(row, col, el);
                add_associativity_rules(row, col, el);
                
                // Remove element from other cells in this row and column
                model.openTable[row][col].clear();
                for (x in (0..model.order-1)) {
                    // Remove from column
                    if (model.openTable[x][col].include?(el)) {
                        model.openTable[x][col].delete(el);
                        if (model.openTable[x][col].size === 1) {
                            _.each(model.openTable[x][col], function(lastEl) {
                                markQueue.push([x, col, lastEl]);
                            });
                        }
                    }
                    // Remove from row
                    if (model.openTable[row][x].include?(el)) {
                        model.openTable[row][x].delete(el);
                        if (model.openTable[row][x].size === 1) {
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
        var order, el_power;
        
        if (el === 0) {
            return 1;
        }
        else if (el >= model.order) {
            console.log("Error: element index too large");
            return 0;
        }

        order = 1;
        el_power = el;
        // Loop through powers of el
        while (el_power !== null and el_power !== 0) {
            el_power = model.table.get_element(el_power, el);
            order += 1;
        }

        if (el_power === null) {
            return 0;
        }

        return order;
    },
    /**
     * Get a table showing where an element can be placed.
     * @param el - element index
     * @returns table - boolean mask of openTable showing open positions
     */
    openPositions: function(el) {
        'use strict';
        var model;

        model = this;
        // Table with bool arrays showing which elements are allowed in a cell
        open = Array.new(model.order);
        _.each([0..model.order-1], function(i) {
            open[i] = Array.new(model.order, false);
            _.each([0..model.order-1], function(j) {
                if (model.openTable[i][j].size > 0 and model.openTable[i][j].member?(el)) {
                    open[i][j] = true;
                }
            });
        });
        
        return open;
    },
    /**
     * Check associativity rules for this position.
     * @param i - row
     * @param j - column
     */
    check_associativity_rules: function(row, col) {
        if (this.associationTable[row][col] !== null) {
            // console.log("Association rule: #{this.associationTable[row][col]}\n");
        }
    },
    /**
     * Add any new associativity rules that result from the addition
     * of this element ad this position.
     * @param i - row
     * @param j - column
     * @param el - element index to assign to (i, j)
     */
    add_associativity_rules: function(row, col, el) {
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
            if (el === model.table.get_element(row, col)) {
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
        return this.table.isComplete;
    },
    /**
     * Validate and build a corresponding Group.
     */
    build_group: function() {
        'use strict';
        var model;

        model = this;
        // Identity was set in initialize()
        // Inverses guaranteed by e in every column and every row
        // Associativity guaranteed by association checks
        
        // Must have full OperatorTable
        if (isComplete) {
            return Group.new(model.elements, model.table);
        }
    },
    /**
     * Create a String representation of the current (maybe incomplete) table.
     * @returns string representation of the operator table
     */
    toStr: function() {
        'use strict';
        var model;

        model = this;
        
        // Set column width to size of largest element symbol
        columnWidth = 0
        _.each([0..model.order-1], function(i) {
            if (columnWidth < model.elements.element(i).symbol.length) {
	        columnWidth = model.elements.element(i).symbol.length;
            }
        });
        outString = " #{" ".rjust(columnWidth)} |";
        _.each([0..model.order-1], function(i) {
            outString += " #{model.elements.element(i).symbol.rjust(columnWidth)} |";
        });
        outString += "\n";
        _.each([0..model.order], function(i) {
            outString += "-#{"-".rjust(columnWidth, "-")}-|";
        });
        outString += "\n";
        _.each([0..model.order-1], function(i) {
            outString += " #{model.elements.element(i).symbol.rjust(columnWidth)} |";
            _.each([0..model.order-1], function(j) {
                if (model.table.get_element(i, j) === null) {
	            outString += " #{'.'.rjust(columnWidth)} |";
                }
                else {
	            outString += " #{model.elements.element(model.table.get_element(i, j)).symbol.rjust(columnWidth)} |";
                }
            });
            outString += "\n";
        });
        return outString;
    },
    /**
     *
     */
    print_openTable: function() {
        'use strict';
        var model;

        model = this;
        
        _.each([0..model.order-1], function(i) {
            console.log("row #{i}\n");
            _.each([0..model.order-1], function(j) {
                console.log("   col #{j}\n");
                console.log("      ");
                // console.log("openTable[#{i}][#{j}].class: #{model.openTable[i][j].class}\n");
                // console.log("openTable[#{i}][#{j}].size: #{model.openTable[i][j].size}\n");
                // console.log("openTable[0][0].size: #{model.openTable[0][0].size}\n");
                _.each(model.openTable[i][j], function(el) {
                    // console.log("#{el.class} ");
                    console.log("#{el} ");
                });
                console.log("\n");
            });
        });
    }
};


/**
 * Permutation representation of a group element from the symmetric group.
 */
aljabr.Permutor = {
    /**
     * The +new+ class method initializes the class.
     * @param actionArray - permutor representation
     */
    initialize: function(actionArray) {
        'use strict';
        var i;

        // Validate actionArray
        // actionArray must be an array of integers from 0..actionArray.length-1
        // each integer appears only once
        // the array is a map from integer i to the integer actionArray[i]
        for (i in [0..(actionArray.length-1)]) {
            if (!actionArray.include?(i)) {
                console.log('Error: bad actionArray');
            }
        }
        this.actionArray = actionArray;
    },
    /**
     * Equality (was "===")
     * @param permutor - permutor to compare against
     */
    eq: function(permutor) {
        'use strict';
        return (toStr() === permutor.toStr());
    },
    /**
     * 
     * @param permutor - 
     */
    operate: function(permutor) {
        'use strict';

        if (order !== permutor.order) {
            return null;
        }
        tempActionArray = Array.new(this.actionArray.length);
        for (i in [0..(tempActionArray.length-1)]) {
            tempActionArray[i] = op(permutor.op(i));
        }
        return Permutor.new(tempActionArray);
    },
    /**
     * Return an element of actionArray.
     * @param num - index into actionArray
     */
    op: function(num) {
        'use strict';

        //puts "op num: " + num.toStr()
        return this.actionArray[num];
    },
    /**
     * Size of actionArray.
     */
    order: function() {
        'use strict';
        return this.actionArray.length;
    },
    /**
     * Return a string representation of actionArray.
     */
    toStr2: function() {
        'use strict';
        var str, i;

        str = "[";
        for (i in this.actionArray) {
            str += i.toStr() + " ";
        }

        str = str.chop;
        str += "]";
        return str;
    },
    /**
     * Return a string representation of actionArray.
     */
    toStr: function() {
        'use strict';
        var str, markArray, i, j;

        str = "";
        markArray = Array.new(this.actionArray.length);

        for (i in [0..(this.actionArray.length-1)]) {
            if (!markArray[i] && this.actionArray[i] !== i) {
                markArray[i] = 1;
                str += "(" + i.toStr() + " ";
                j = this.actionArray[i];
                str += j.toStr() + " ";
                while (!markArray[j] && this.actionArray[j] !== i) {
                    markArray[j] = 1;
                    j = this.actionArray[j];
                    str += j.toStr() + " ";
                }
                markArray[j] = 1;
                str = str.chop + ") ";
            }
        }

        // Identity element represented as 'e'
        str = str.chop;
        if (str.length === 0) {
            return "e";
        }

        return str;
    }
};


aljabr.PermutationGroupBuilder = {
    /**
     * The +new+ class method initializes the class.
     * Pass in array of Permutors
     * @param generators - array of generators represented as +Permutors+
     */
    initialize: function(generators) {
        'use strict';
        var model;

        model = this;

        model.generators = generators;
        model.permutors = Array.new();
        model.group = null;
        // XXX - get_valid_generators
        model.permutorOrder = model.generators[0].order;
    },
    /**
     * Return a hash from generators to booleans (whether they're valid or not)
     *   A generator is valid if it has the largest order of a set of conflicting
     *   generators (e.g. r is valid compared with r^2 and r^3).
     */
    get_valid_generators: function() {
        'use strict';
        
    },
    /**
     * Create a list of all elements with which to build the Group
     *   Breadth-first search using the generators and starting with the identity
     *   element.
     */
    find_elements: function() {
        'use strict';
        // Walk each generator down the Permutor array, multiplying by the current
        // permutor and adding any new results to the end of the array.
        identityActionArray = Array.new();
        for (i in [0..this.permutorOrder-1]) {
            identityActionArray.push(i);
        }
        this.permutors.push(Permutor.new(identityActionArray));

        for (i in this.permutors) {
            for (j in this.generators) {
	        tempPermutor = j.operate(i)
                if (!this.permutors.include?(tempPermutor)) {
                    this.permutors.push(tempPermutor);
                }
            }
        }
    },
    /**
     * Build a group from a set of permutor generators.
     */
    build_group: function() {
        'use strict';
        var model;

        model = this;
        if (model.permutors.length === 0) {
            find_elements;
        }

        // Create ElementSet corresponding to permutors
        elementArray = Array.new();
        for (i in [(0..model.permutors.length-1)]) {
            elementArray.push(Element.new("#{i}"));
        }
        elements = ElementSet.new(elementArray);

        // Loop through elements and fill out GroupBuilder
        groupBuilder = GroupBuilder.new(elements);
        for (i in [(1..model.permutors.length-1)]) {
            for (j in [1..model.permutors.length-1]) {
                groupBuilder.set_element(i, j, model.permutors.index(model.permutors[j].operate(model.permutors[i])));
                if (groupBuilder.isComplete) {
                    // console.log("COMPLETE\n");
                    break;
                }
            }
            if (groupBuilder.isComplete) {
                // console.log("COMPLETE\n");
                break;
            }
        }
        // puts "group:";
        // puts groupBuilder;
        if (!groupBuilder.isComplete) {
            console.log("Error: groupBuilder is not complete");
        }

        model.group = groupBuilder.build_group;
        return model.group;
    },
    /**
     * Retrieve the current group.
     * @returns Group
     */
    get_group: function() {
        'use strict';
        var model;

        model = this;
        if (model.group === null) {
            model.build_group();
        }
        return model.group;
    },
    /**
     * Print the permutors that generate the group.
     */
    print_permutors: function() {
        'use strict';
        var model, i;

        model = this;
        
        for (i in [0..model.permutors.length-1]) {
            console.log("#{i}: #{model.permutors[i]}\n");
        }
    }
};



/**
 * Build a cyclic group.
 * @param order - order of the group
 * @returns built cyclic group
 */
aljabr.build_cyclic_group = function(order) {
    'use strict';
  
    if (order <= 0) {
        return null;
    }

    cycleActionArray = Array.new(order);
    if (order === 1) {
        cycleActionArray[0] = 0;
    }
    else {
        for (i in cycleActionArray) {
            cycleActionArray[i] = i+1;
        }
        cycleActionArray[order-1] = 0;
    }
    cycle = Permutor.new(cycleActionArray);
    cyclicGroupBuilder = PermutationGroupBuilder.new([cycle]);

    return cyclicGroupBuilder.get_group;
};


/**
 * Build a dihedral group.
 * @param degree - half of the order of the group
 * @returns built dihedral group
 */
aljabr.build_dihedral_group = function(degree) {
    'use strict';

    if (degree <= 0) {
        return null;
    }

    dihedralActionArray1 = Array.new(degree+2);
    dihedralActionArray2 = Array.new(degree+2);

    // XXX - should throw an exception; no Dih1 or Dih2
    if (degree === 1 || degree === 2) {
        return build_cyclic_group(degree);
    }
    else {
        for (i in dihedralActionArray1) {
            dihedralActionArray1[i] = i+1;
        }
        dihedralActionArray1[degree-1] = 0;
        dihedralActionArray1[degree] = degree;
        dihedralActionArray1[degree+1] = degree+1;
        for (i in dihedralActionArray2) {
            dihedralActionArray2[i] = i;
        }
        dihedralActionArray2[degree] = degree+1;
        dihedralActionArray2[degree+1] = degree;
    }
    dihed1 = Permutor.new(dihedralActionArray1);
    dihed2 = Permutor.new(dihedralActionArray2);
    dihedralGroupBuilder = PermutationGroupBuilder.new([dihed1, dihed2]);
    
    return dihedralGroupBuilder.get_group;
};


/**
 * Build a symmetry group.
 * XXX - using WAY more generators than are needed
 * @param degree - order of the group is degree!
 * @returns built symmetry group
 */
aljabr.build_symmetry_group = function(degree) {
    'use strict';

    if (degree <= 0) {
        return null;
    }

    if (degree === 1 || degree === 2) {
        return build_cyclic_group(degree);
    }

    numActionArrays = (degree**2 - degree)/2;
    symmetryActionArrays = Array.new(numActionArrays);
    // Build actionArrays like [0, 1, 2, ...] then switch
    // elements at indices num1 and num2
    num1 = 0;
    num2 = 1;
    for (i in symmetryActionArrays) {
        symmetryActionArrays[i] = Array.new(degree);
        for (j in symmetryActionArrays[i]) {
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
  
    transpositions = Array.new(numActionArrays);
    for (i in transpositions) {
        transpositions[i] = Permutor.new(symmetryActionArrays[i]);
    }

    symmetryGroupBuilder = PermutationGroupBuilder.new(transpositions);

    return symmetryGroupBuilder.get_group;
};


/**
 * Build an alternating group.
 * XXX - using WAY more generators than are needed
 * @param degree - order of the group is degree!/2
 * @returns built alternating group
 */
aljabr.build_alternating_group = function(degree) {
    'use strict';

    if (degree <= 1) {
        return null;
    }

    if (degree === 2) {
        return build_cyclic_group(degree);
    }

    // Number generators = choose(degree, 3)
    numActionArrays = degree * (degree-1) * (degree-2) / 6;
    alternatingActionArrays = Array.new(numActionArrays);

  // Build actionArrays like [0, 1, 2, ...]
    for (i in alternatingActionArrays) {
        alternatingActionArrays[i] = Array.new(degree);
        for (j in alternatingActionArrays[i]) {
            alternatingActionArrays[i][j] = j;
        }
    }

    // Switch elements at indices num1, num2, and num3
    arrayCount = 0;
    for (i in [0..degree-3]) {
        for (j in [i+1..degree-2]) {
            for (k in [j+1..degree-1]) {
	        alternatingActionArrays[arrayCount][i] = j;
	        alternatingActionArrays[arrayCount][j] = k;
	        alternatingActionArrays[arrayCount][k] = i;
	        arrayCount += 1;
            }
        }
    }
  
    transpositions = Array.new(numActionArrays);
    for (i in transpositions) {
        transpositions[i] = Permutor.new(alternatingActionArrays[i]);
    }

    alternatingGroupBuilder = PermutationGroupBuilder.new(transpositions);

    return alternatingGroupBuilder.get_group;
};


/**
 * Build the direct product group of two existing groups.
 * @param group1 - first group
 * @param group2 - second group
 * @returns direct product of group1 and group2
 */
aljabr.build_product_group = function(group1, group2) {
    'use strict';
    var elArray, elCount, backMap, backMap2, elements, productBuilder, el1, el2;
    
    elArray = [];
    elCount = 0;
    backMap = Array.new(group1.order);
    backMap2 = [];
    // Create new ElementSet
    for (i in [0..group1.order-1]) {
        backMap[i] = Array.new(group2.order);
        for (j in [0..group2.order-1]) {
            elArray.push(Element.new("(#{group1.elements.element(i).symbol},#{group2.elements.element(j).symbol})"));
            backMap[i][j] = elCount;
            elCount += 1;
            backMap2.push([i, j]);
        }
    }

    elements = ElementSet.new(elArray);
    productBuilder = GroupBuilder.new(elements);

    // Loop through Groups
    for (i in [0..productBuilder.order-1]) {
        for (j in [0..productBuilder.order-1]) {
            el1 = group1.get_element(backMap2[i][0], backMap2[j][0]);
            el2 = group2.get_element(backMap2[i][1], backMap2[j][1]);
            productBuilder.set_element(i, j, backMap[el1][el2]);
        }
    }
  
    return productBuilder.build_group;
};
