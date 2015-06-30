

aljabr.test.test_OperatorTable = function() {
    console.log("\n\n***** OperatorTable Test *****\n");
    
    table = OperatorTable.new(2);
    console.log("table.get_element(0, 0): #{table.get_element(0, 0)}\n");
    
    table.set_element(0, 0, 0);
    table.set_element(0, 1, 1);
    table.set_element(1, 0, 1);
    table.set_element(1, 1, 0);
    console.log("table.get_element(0, 0): #{table.get_element(0, 0)}\n");
    console.log("table.get_element(0, 1): #{table.get_element(0, 1)}\n");
    console.log("table.get_element(1, 0): #{table.get_element(1, 0)}\n");
    console.log("table.get_element(1, 1): #{table.get_element(1, 1)}\n");
}


aljabr.test.test_GroupBuilder = function() {
    'use strict';
    console.log("\n\n***** GroupBuilder Test *****\n");
    e = Element.new("e");
    a = Element.new("a");
    console.log(e.symbol + "\n");
    testSet1 = ElementSet.new([e, a]);
    console.log("order: #{testSet1.order}\n");
    console.log("0: #{testSet1.element(0).symbol}\n");
    console.log("1: #{testSet1.element(1).symbol}\n");
    groupBuilder1 = GroupBuilder.new(testSet1);
    console.log("groupBuilder1:\n");
    console.log(groupBuilder1.to_s());
    groupBuilder1.set_element(1, 1, 0);
    console.log("groupBuilder1:\n");
    console.log(groupBuilder1.to_s());
    console.log("\n");
    console.log("order e: #{groupBuilder1.element_order?(0)}\n");
    console.log("order a: #{groupBuilder1.element_order?(1)}\n");
    
    b = Element.new("b");
    c = Element.new("c");
    d = Element.new("d");
    testSet2 = ElementSet.new([e, a, b, c, d]);
    groupBuilder2 = GroupBuilder.new(testSet2);
    console.log("groupBuilder2:\n");
    console.log(groupBuilder2.to_s());
    groupBuilder2.set_element(1, 1, 2);
    groupBuilder2.set_element(1, 2, 3);
    groupBuilder2.set_element(1, 3, 4);
    groupBuilder2.set_element(1, 4, 0);
    console.log("groupBuilder2:\n");
    console.log(groupBuilder2.to_s());
    console.log("open positions 1:\n");
    console.log(bool_table_to_s(groupBuilder2.open_positions?(1)));
    console.log("open positions 2:\n");
    console.log(bool_table_to_s(groupBuilder2.open_positions?(2)));
    console.log("open positions 3:\n");
    console.log(bool_table_to_s(groupBuilder2.open_positions?(3)));
    console.log("open positions 4:\n");
    console.log(bool_table_to_s(groupBuilder2.open_positions?(4)));
    groupBuilder2.set_element(2, 1, 3);
    groupBuilder2.set_element(2, 2, 4);
    groupBuilder2.set_element(2, 3, 0);
    groupBuilder2.set_element(2, 4, 1);
    groupBuilder2.set_element(3, 1, 4);
    groupBuilder2.set_element(3, 2, 0);
    groupBuilder2.set_element(3, 3, 1);
    groupBuilder2.set_element(3, 4, 2);
    groupBuilder2.set_element(4, 1, 0);
    groupBuilder2.set_element(4, 2, 1);
    groupBuilder2.set_element(4, 3, 2);
    groupBuilder2.set_element(4, 4, 3);
    console.log("groupBuilder2:\n");
    console.log(groupBuilder2.to_s());
    console.log("\n");
    console.log("order e: #{groupBuilder2.element_order?(0)}\n");
    console.log("order a: #{groupBuilder2.element_order?(1)}\n");
    console.log("order b: #{groupBuilder2.element_order?(2)}\n");
    console.log("order c: #{groupBuilder2.element_order?(3)}\n");
    console.log("order d: #{groupBuilder2.element_order?(4)}\n");

    o = Element.new("1");
    om = Element.new("-1");
    i = Element.new("i");
    im = Element.new("-i");
    j = Element.new("j");
    jm = Element.new("-j");
    k = Element.new("k");
    km = Element.new("-k");
    testSet3 = ElementSet.new([o, om, i, im, j, jm, k, km]);
    groupBuilder3 = GroupBuilder.new(testSet3);
    console.log("quaternion group:\n");
    console.log(groupBuilder3.to_s());
    groupBuilder3.set_element(1, 1, 0);
    groupBuilder3.set_element(1, 2, 3);
    groupBuilder3.set_element(2, 1, 3);
    groupBuilder3.set_element(1, 3, 2);
    groupBuilder3.set_element(3, 1, 2);
    groupBuilder3.set_element(1, 4, 5);
    groupBuilder3.set_element(4, 1, 5);
    groupBuilder3.set_element(1, 5, 4);
    groupBuilder3.set_element(5, 1, 4);
    groupBuilder3.set_element(1, 6, 7);
    groupBuilder3.set_element(6, 1, 7);
    groupBuilder3.set_element(1, 7, 6);
    groupBuilder3.set_element(7, 1, 6);
    console.log("quaternion group:\n");
    console.log(groupBuilder3.to_s());
    console.log("open positions 1:\n");
    console.log(bool_table_to_s(groupBuilder3.open_positions?(1)));
    console.log("open positions 2:\n");
    console.log(bool_table_to_s(groupBuilder3.open_positions?(2)));
    console.log("open positions 3:\n");
    console.log(bool_table_to_s(groupBuilder3.open_positions?(3)));
    console.log("open positions 4:\n");
    console.log(bool_table_to_s(groupBuilder3.open_positions?(4)));
    groupBuilder3.set_element(2, 2, 1);
    groupBuilder3.set_element(3, 3, 1);
    groupBuilder3.set_element(4, 4, 1);
    groupBuilder3.set_element(5, 5, 1);
    groupBuilder3.set_element(6, 6, 1);
    groupBuilder3.set_element(7, 7, 1);
    groupBuilder3.set_element(2, 3, 0);
    groupBuilder3.set_element(3, 2, 0);
    groupBuilder3.set_element(4, 5, 0);
    // groupBuilder3.set_element(5, 4, 0);
    // groupBuilder3.set_element(6, 7, 0);
    // groupBuilder3.set_element(7, 6, 0);
    groupBuilder3.set_element(6, 4, 2);
    groupBuilder3.set_element(4, 6, 3);
    groupBuilder3.set_element(4, 2, 6);
    groupBuilder3.set_element(2, 4, 7);
    groupBuilder3.set_element(2, 6, 4);
    groupBuilder3.set_element(6, 2, 5);
    console.log("quaternion group:\n");
    console.log(groupBuilder3.to_s());
    console.log("order 1: #{groupBuilder3.element_order?(0)}\n");
    console.log("order -1: #{groupBuilder3.element_order?(1)}\n");
    console.log("order i: #{groupBuilder3.element_order?(2)}\n");
    console.log("order -i: #{groupBuilder3.element_order?(3)}\n");
    console.log("order j: #{groupBuilder3.element_order?(4)}\n");
    console.log("order -j: #{groupBuilder3.element_order?(5)}\n");
    console.log("order k: #{groupBuilder3.element_order?(6)}\n");
    console.log("order -k: #{groupBuilder3.element_order?(7)}\n");
};


aljabr.test.test_Permutor = function() {
    'use strict;'
    console.log("\n\n***** Permutor Test *****");
    a = Permutor.new([0, 1, 2, 3, 4, 5]);
    console.log(a);
    
    console.log(a.op(1));
    console.log(a.op(5));
    
    e = Permutor.new([0, 1, 2]);
    console.log("e: " + e.to_s());
    console.log("ee: " + e.operate(e).to_s());
    console.log("eee: " + e.operate(e.operate(e)).to_s());
    
    x = Permutor.new([1, 2, 0]);
    console.log("x: " + x.to_s());
    console.log("xx: " + x.operate(x).to_s());
    console.log("xxx: " + x.operate(x.operate(x)).to_s());
    console.log('\n');
    
    y = Permutor.new([0, 2, 1])
    console.log("y: " + y.to_s());
    console.log("yy: " + y.operate(y).to_s());
    console.log('\n');
    
    console.log("yx: " + y.operate(x).to_s());
    console.log("xy: " + x.operate(y).to_s());
    console.log('\n');
    
    console.log("to_s2 (actionArray)");
    console.log("e: " + e.to_s()2);
    console.log("x: " + x.to_s()2);
    console.log("y: " + y.to_s()2);
    console.log('\n');
    
    console.log("(1 == 2): " + (1 == 2).to_s());
    console.log("(1 == 1): " + (1 == 1).to_s());
    console.log("([0, 1, 2] == [0, 1, 2]): " + ([0, 1, 2] == [0, 1, 2]).to_s());
    console.log("([0, 1, 2] == [0, 1, 2, 3]): " + ([0, 1, 2] == [0, 1, 2, 3]).to_s());
    console.log('\n');
    
    z = Permutor.new([1, 2, 0]);
    console.log("(e == e): " + (e == e).to_s());
    console.log("(e == x): " + (e == x).to_s());
    console.log("(e == y): " + (e == y).to_s());
    console.log("(x == x): " + (x == x).to_s());
    console.log("(x == y): " + (x == y).to_s());
    console.log("(x == z): " + (x == z).to_s());
    
    
    console.log("\n\n***** PermutationGroupBuilder Test *****");
    
    perm1 = Permutor.new([1, 2, 3, 4, 5, 6, 0]);
    pgb1 = PermutationGroupBuilder.new([perm1]);
    g1 = pgb1.build_group;
    pgb1.print_permutors;

    perm2 = Permutor.new([1, 0, 3, 2]);
    pgb2 = PermutationGroupBuilder.new([perm2]);
    g2 = pgb2.build_group;
    pgb2.print_permutors;
    
    perm3 = Permutor.new([1, 0, 2, 3]);
    perm4 = Permutor.new([0, 1, 3, 2]);
    pgb3 = PermutationGroupBuilder.new([perm3, perm4]);
    g3 = pgb3.build_group;
    pgb3.print_permutors;
};


aljabr.test.test_group_builders = function() {
    console.log("\n\n***** Group Builder Function Tests *****");
    
    g13 = build_cyclic_group(13);
    g7 = build_dihedral_group(7);
    g3 = build_symmetry_group(3);
    g4 = build_alternating_group(4);
    g2 = build_cyclic_group(2);
    g3 = build_cyclic_group(3);
    g2x2 = build_product_group(g2, g2);
    g2x3 = build_product_group(g2, g3);
    console.log("g13 order 1: #{g13.element_order?(1)}\n");
    console.log("g13 index 1: #{g13.element_index?(1)}\n");
    console.log(g13.to_s() + "\n");
    console.log("g7 order 1: #{g7.element_order?(1)}\n");
    console.log("g7 index 1: #{g7.element_index?(1)}\n");
    console.log(g7.to_s() + "\n");
    console.log("g3 order 1: #{g3.element_order?(1)}\n");
    console.log("g3 index 1: #{g3.element_index?(1)}\n");
    console.log(g3.to_s() + "\n");
    console.log("g4 order 1: #{g4.element_order?(1)}\n");
    console.log("g4 index 1: #{g4.element_index?(1)}\n");
    console.log(g4.to_s() + "\n");
    console.log("g2x2 order 1: #{g2x2.element_order?(1)}\n");
    console.log("g2x2 index 1: #{g2x2.element_index?(1)}\n");
    console.log(g2x2.to_s() + "\n");
    console.log("g2x3 order 1: #{g2x3.element_order?(1)}\n");
    console.log("g2x3 index 1: #{g2x3.element_index?(1)}\n");
    console.log(g2x3.to_s() + "\n");
};


aljabr.test.test_cyclic_groups = function() {
    'use strict';
    console.log("\n\n***** Cyclic Group Test *****");
    
    g1 = build_cyclic_group(1);
    g2 = build_cyclic_group(2);
    g3 = build_cyclic_group(3);
    g4 = build_cyclic_group(4);
    g5 = build_cyclic_group(5);
    g10 = build_cyclic_group(10);
    g20 = build_cyclic_group(20);
    // g30 = build_cyclic_group(30);  // order 30
    // g40 = build_cyclic_group(40);  // order 40
    console.log(g1.to_s() + "\n");
    console.log(g2.to_s() + "\n");
    console.log(g3.to_s() + "\n");
    console.log(g4.to_s() + "\n");
    console.log(g5.to_s() + "\n");
    console.log(g10.to_s() + "\n");
    console.log(g20.to_s() + "\n");
};


aljabr.test.test_dihedral_groups = function() {
    'use strict';
    console.log("\n\n***** Dihedral Group Test *****");
    
    g1 = build_dihedral_group(1)
    g2 = build_dihedral_group(2);
    g3 = build_dihedral_group(3);
    g4 = build_dihedral_group(4);
    g5 = build_dihedral_group(5);
    g6 = build_dihedral_group(6);
    g7 = build_dihedral_group(7);  // order 14
    console.log(g1.to_s() + "\n");
    console.log(g2.to_s() + "\n");
    console.log(g3.to_s() + "\n");
    console.log(g4.to_s() + "\n");
    console.log(g5.to_s() + "\n");
    console.log(g6.to_s() + "\n");
    console.log(g7.to_s() + "\n");
};


aljabr.test.test_symmetry_groups = function() {
    'use strict';
    console.log("\n\n***** Symmetry Group Test *****");
    
    g1 = build_symmetry_group(1);
    g2 = build_symmetry_group(2);
    g3 = build_symmetry_group(3);
    g4 = build_symmetry_group(4);
    // g5 = build_symmetry_group(5);  // order 120
    console.log(g1.to_s() + "\n");
    console.log(g2.to_s() + "\n");
    console.log(g3.to_s() + "\n");
    console.log(g4.to_s() + "\n");
    // console.log(g5.to_s() + "\n");
};


aljabr.test.test_alternating_groups = function() {
    'use strict';
    
    console.log("\n\n***** Alternating Group Test *****");
    
    g1 = build_alternating_group(1);
    g2 = build_alternating_group(2);
    g3 = build_alternating_group(3);
    g4 = build_alternating_group(4);
    // g5 = build_alternating_group(5);  // order 60
    console.log(g1.to_s() + "\n");
    console.log(g2.to_s() + "\n");
    console.log(g3.to_s() + "\n");
    console.log(g4.to_s() + "\n");
    // console.log(g5.to_s() + "\n");
};


aljabr.test.bool_table_to_s = function(table) {
    'use strict';
    var order, columnWidth, outString, i;
    
    // Set column width to size of largest element symbol
    order = table.length;
    columnWidth = 1;
    outString = " #{" ".rjust(columnWidth)} |";
    for (i=0; i<order; i++) {
        outString += " i |";
    }
    outString += "\n";
    for (i in [0..order]) {
        outString += "-#{"-".rjust(columnWidth, "-")}-|";
    }
    outString += "\n";
    for (i in [0..order-1]) {
        outString += " #{i} |";
        for (j in [0..order-1]) {
            if (table[i][j]) {
	        outString += " 1 |";
            }
            else {
                outString += " 0 |";
            }
        }
        outString += "\n";
    }
    return outString;
};


test_OperatorTable()
test_GroupBuilder()
test_Permutor()
test_group_builders()
test_cyclic_groups()
test_dihedral_groups()
test_symmetry_groups()
test_alternating_groups()
