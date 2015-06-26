/**
 * Author:: John Eargle (mailto: jeargle at gmail.com)
 * 2007-2015
 * :title: OperatorTable
 */

require_relative 'Group'
require 'set'

/**
 * This class holds the elements of a multiplication table.
 * The table only contains ints or nil; the ints are indices
 * into an ElementSet array.
 * OperatorTables are generic so they may be used for Groups,
 * Rings, Fields, etc.  No validation is done in this class
 * for element placement, that happens in the corresponding
 * Builder classes.
 */
aljabr.OperatorTable = {
    /**
     * The +new+ class method initializes the class.
     * === Parameters
     * _order_ = number of rows (and columns) in the table
     */
    initialize: function(order) {
        'use strict';
        var model;

        model = this;
        model.order = order;
        model.emptyCellCount = model.order*model.order;
        model.table = Array.new(model.order);
        _.each([0..model.order-1], function(i) {
            model.table[i] = Array.new(model.order)
        });
    },
    /**
     * Number of Elements in the OperatorTable.
     */
    order: function() {
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
            if model.table[i][j] == nil {
                model.emptyCellCount -= 1
            }
            model.table[i][j] = element
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
        this.table[i][j] = nil;
    },
    /**
     * @returns 
     */
    complete?: function() {
        'use strict';
        return this.emptyCellCount == 0
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
    to_s: function() {
        'use strict';
        return this.symbol;
    }
}


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
 * This class holds an intermediate representation for a Group that
 * has not been fully built.  It should allow for the placement
 * of Elements in an OperatorTable as long as they maintain the
 * possibility of creating a valid Group.
 */
aljabr.GroupBuilder = {
    attr_reader :order,
    /**
     * The +new+ class method initializes the class.
     * @param elements - ElementSet with all the group elements
     */
    initialize: function(elements) {
        'use strict';
        var model;
        
        model = this;
        model.elements = elements
        model.order = model.elements.order
        model.table = OperatorTable.new(model.order)
        
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
     * === Parameters
     * _i_ = row
     * _j_ = column
     * _element_ = Element to assign to (i, j)
     */
    set_element: function(i, j, element) {
        'use strict';
        var model;

        model = this;
        // print "set_element(#{i}, #{j}, #{element})\n"
        if (0 <= i && i < model.order &&
            0 <= j && j < model.order &&
            0 <= element && element < model.order) {

            if (model.openTable[i][j].size == 0) {
                if (element != model.table.get_element(i, j)) {
                    print "Error: cannot change (#{i}, #{j}): #{model.table.get_element(i, j)} to #{element}\n";
                }
                else {
                    // print "Already set\n"
                }
                return nil
            }
      
            // Is this element still allowed to be placed here?
            if (!model.openTable[i][j].include?(element)) {
                print "Error: element #{element} is not allowed at (#{i}, #{j})\n"
                print "model.openTable[i][j]:"
                _.each(model.openTable[i][j], function(x) {
                    print "#{x} ";
                });
                print "\n"
                return nil
            }
      
            markQueue = []
            markQueue.push([i, j, element])
            while (markQueue.length > 0) {
                row, col, el = markQueue.shift;
                check_associativity_rules(row, col);
                model.table.set_element(row, col, el);
                add_associativity_rules(row, col, el);
                
                // Remove element from other cells in this row and column
                model.openTable[row][col].clear()
                for (x in (0..model.order-1)) {
                    // Remove from column
                    if (model.openTable[x][col].include?(el)) {
                        model.openTable[x][col].delete(el);
                        if (model.openTable[x][col].size == 1) {
                            _.each(model.openTable[x][col], function(lastEl) {
                                markQueue.push([x, col, lastEl]);
                            });
                        }
                    }
                    // Remove from row
                    if (model.openTable[row][x].include?(el)) {
                        model.openTable[row][x].delete(el);
                        if (model.openTable[row][x].size == 1) {
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
    element_order?: function(el) {
        'use strict';
        
        if (el == 0) {
            return 1;
        }
        else if (el >= model.order) {
            print "Error: element index too large";
            return 0;
        }

        order = 1;
        el_power = el;
        // Loop through powers of el
        while (el_power != nil and el_power != 0) {
            el_power = model.table.get_element(el_power, el);
            order += 1;
        }

        if (el_power == nil) {
            return 0;
        }

        return order;
    },
    /**
     * Get a table showing where an element can be placed.
     * @param el - element index
     * @returns table - boolean mask of @openTable showing open positions
     */
    open_positions?: function(el) {
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
        if (@associationTable[row][col] != nil) {
            // print "Association rule: #{@associationTable[row][col]}\n";
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
        if (row == col) {
            // a(aa) = (aa)a
            // aa = b
            // => ab = ba
            model.associationTable[row][el] = [el, row]
            model.associationTable[el][row] = [row, el]
        }
        else {
            if (el == model.table.get_element(row, col)) {
                // a(ba) = (ab)a
                // ba = c, ab = c (a and b commute)
                // => ac = ca, bc = cb
                model.associationTable[row][el] = [el, row]
                model.associationTable[el][row] = [row, el]
                model.associationTable[col][el] = [el, col]
                model.associationTable[el][col] = [col, el]
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
    complete?: function() {
        return this.table.complete?;
    },
    /**
     * Validate and build a corresponding Group.
     */
    build_group: function() {
        // Identity was set in initialize()
        // Inverses guaranteed by e in every column and every row
        // Associativity guaranteed by association checks
        
        // Must have full OperatorTable
        if (complete?) {
            return Group.new(@elements, @table);
        }
    },
    /**
     * Create a String representation of the current (maybe incomplete) table.
     * === Return
     * _s_ = string representation of the operator table
     */
    to_s: function() {
        // Set column width to size of largest element symbol
        columnWidth = 0
        _.each([0..@order-1], function(i) {
            if (columnWidth < @elements.element(i).symbol.length) {
	        columnWidth = @elements.element(i).symbol.length;
            }
        });
        outString = " #{" ".rjust(columnWidth)} |";
        _.each([0..@order-1], function(i) {
            outString += " #{@elements.element(i).symbol.rjust(columnWidth)} |";
        });
        outString += "\n";
        _.each([0..@order], function(i) {
            outString += "-#{"-".rjust(columnWidth, "-")}-|";
        });
        outString += "\n";
        _.each([0..@order-1], function(i) {
            outString += " #{@elements.element(i).symbol.rjust(columnWidth)} |";
            _.each([0..@order-1], function(j) {
                if (@table.get_element(i, j) == nil) {
	            outString += " #{'.'.rjust(columnWidth)} |";
                }
                else {
	            outString += " #{@elements.element(@table.get_element(i, j)).symbol.rjust(columnWidth)} |";
                }
            });
            outString += "\n";
        });
        return outString;
    },
    print_openTable: function() {
        _.each([0..@order-1], function(i) {
            print "row #{i}\n";
            _.each([0..@order-1], function(j) {
                print "   col #{j}\n";
                print "      ";
                // print "openTable[#{i}][#{j}].class: #{@openTable[i][j].class}\n";
                // print "openTable[#{i}][#{j}].size: #{@openTable[i][j].size}\n";
                // print "openTable[0][0].size: #{@openTable[0][0].size}\n";
                _.each(@openTable[i][j], function(el) {
                    // print "#{el.class} ";
                    print "#{el} ";
                });
                print "\n";
            });
        });
    }
}


/**
 * Build a cyclic group.
 * === Parameters
 * _order_ = order of the group
 * === Return
 * _cyclicGroup_ = built cyclic group
 */
build_cyclic_group(order)
  
  if order <= 0
    return nil
  }

  cycleActionArray = Array.new(order)
  if order == 1
    cycleActionArray[0] = 0
  else
    cycleActionArray.each_index function(i) {
      cycleActionArray[i] = i+1
    }
    cycleActionArray[order-1] = 0
  }
  cycle = Permutor.new(cycleActionArray)
  cyclicGroupBuilder = PermutationGroupBuilder.new([cycle])
  return cyclicGroupBuilder.get_group
  
}


/**
 *  Build a dihedral group.
 * === Parameters
 * _degree_ = half of the order of the group
 * === Return
 * _dihedralGroup_ = built dihedral group
 */
build_dihedral_group(degree)

  if degree <= 0
    return nil
  }

  dihedralActionArray1 = Array.new(degree+2)
  dihedralActionArray2 = Array.new(degree+2)

  // XXX - should throw an exception; no Dih1 or Dih2
  if degree == 1 || degree == 2
    return build_cyclic_group(degree)
  else
    dihedralActionArray1.each_index function(i) {
      dihedralActionArray1[i] = i+1
    }
    dihedralActionArray1[degree-1] = 0
    dihedralActionArray1[degree] = degree
    dihedralActionArray1[degree+1] = degree+1
    dihedralActionArray2.each_index function(i) {
      dihedralActionArray2[i] = i
    }
    dihedralActionArray2[degree] = degree+1
    dihedralActionArray2[degree+1] = degree
  }
  dihed1 = Permutor.new(dihedralActionArray1)
  dihed2 = Permutor.new(dihedralActionArray2)
  dihedralGroupBuilder = PermutationGroupBuilder.new([dihed1, dihed2])
  return dihedralGroupBuilder.get_group

}


/**
 * Build a symmetry group.
 * XXX - using WAY more generators than are needed
 * === Parameters
 * _degree_ = order of the group is degree!
 * === Return
 * _symmetryGroup_ = built symmetry group
 */
aljabr.build_symmetry_group = function(degree) {
    'use strict';

    if (degree <= 0) {
        return nil;
    }

    if (degree == 1 || degree == 2) {
        return build_cyclic_group(degree);
    }

    numActionArrays = (degree**2 - degree)/2;
    symmetryActionArrays = Array.new(numActionArrays);
    // Build actionArrays like [0, 1, 2, ...] then switch
    // elements at indices num1 and num2
    num1 = 0;
    num2 = 1;
    symmetryActionArrays.each_index function(i) {
    symmetryActionArrays[i] = Array.new(degree)
    symmetryActionArrays[i].each_index function(j) {
      symmetryActionArrays[i][j] = j
    }
    symmetryActionArrays[i][num1] = num2
    symmetryActionArrays[i][num2] = num1
    num2 += 1
    if num2 == degree
      num1 += 1
      num2 = num1 + 1
    }
  }
  
  transpositions = Array.new(numActionArrays)
  transpositions.each_index function(i) {
    transpositions[i] = Permutor.new(symmetryActionArrays[i])
  }

  symmetryGroupBuilder = PermutationGroupBuilder.new(transpositions)

  return symmetryGroupBuilder.get_group
}


/**
 * Build an alternating group.
 * XXX - using WAY more generators than are needed
 * === Parameters
 * _degree_ = order of the group is degree!/2
 * === Return
 * _alternatingGroup_ = built alternating group
 */
build_alternating_group = function(degree) {
    'use strict';

  if degree <= 1
    return nil
  }

  if degree == 2
    return build_cyclic_group(degree)
  }

  // Number generators = choose(degree, 3)
  numActionArrays = degree * (degree-1) * (degree-2) / 6
  alternatingActionArrays = Array.new(numActionArrays)

  // Build actionArrays like [0, 1, 2, ...]
  alternatingActionArrays.each_index function(i) {
    alternatingActionArrays[i] = Array.new(degree)
    alternatingActionArrays[i].each_index function(j) {
      alternatingActionArrays[i][j] = j
    }
  }

  // Switch elements at indices num1, num2, and num3
  arrayCount = 0
  (0..degree-3).each function(i) {
    (i+1..degree-2).each function(j) {
      (j+1..degree-1).each do |k|
	alternatingActionArrays[arrayCount][i] = j
	alternatingActionArrays[arrayCount][j] = k
	alternatingActionArrays[arrayCount][k] = i
	arrayCount += 1
      }
    }
  }
  
  transpositions = Array.new(numActionArrays)
  transpositions.each_index function(i) {
    transpositions[i] = Permutor.new(alternatingActionArrays[i])
  }

  alternatingGroupBuilder = PermutationGroupBuilder.new(transpositions)

  return alternatingGroupBuilder.get_group
}


/**
 * Build the direct product group of two existing groups.
 * === Parameters
 * _group1_ = first group
 * _group2_ = second group
 * === Return
 * _directProduct_ = direct product of group1 and group2
 */
build_product_group = function(group1, group2) {

  elArray = []
  elCount = 0
  backMap = Array.new(group1.order)
  backMap2 = []
  // Create new ElementSet
  for i in (0..group1.order-1)
    backMap[i] = Array.new(group2.order)
    for j in (0..group2.order-1)
      elArray.push(Element.new("(#{group1.elements.element(i).symbol},#{group2.elements.element(j).symbol})"))
      backMap[i][j] = elCount
      elCount += 1
      backMap2.push([i, j])
    }
  }

  elements = ElementSet.new(elArray)
  productBuilder = GroupBuilder.new(elements)

  // Loop through Groups
  for i in (0..productBuilder.order-1)
    for j in (0..productBuilder.order-1)
      el1 = group1.get_element(backMap2[i][0], backMap2[j][0])
      el2 = group2.get_element(backMap2[i][1], backMap2[j][1])
      productBuilder.set_element(i, j, backMap[el1][el2])
    }
  }
  
  return productBuilder.build_group
}
