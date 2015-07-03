/* JSLint */
/*global console: false, aljabr: false */

extend(aljabr, 'test');

aljabr.test.test_OperatorTable = function() {
    'use strict';
    var table;
    
    console.log('\n\n***** OperatorTable Test *****\n');
    
    table = new aljabr.OperatorTable(2);
    console.log('table.get_element(0, 0):' + table.get_element(0, 0)});
    
    table.set_element(0, 0, 0);
    table.set_element(0, 1, 1);
    table.set_element(1, 0, 1);
    table.set_element(1, 1, 0);
    console.log('table.get_element(0, 0): ' + table.get_element(0, 0));
    console.log('table.get_element(0, 1): ' + table.get_element(0, 1));
    console.log('table.get_element(1, 0): ' + table.get_element(1, 0));
    console.log('table.get_element(1, 1): ' + table.get_element(1, 1));
};


aljabr.test.test_GroupBuilder = function() {
    'use strict';
    var e, a, testSet1, groupBuilder1, b, c, d, testSet2, groupBuilder2, o, om, i, im, j, jm, k, km, testSet3, groupBuilder3;
    
    console.log('\n\n***** GroupBuilder Test *****\n');
    e = new aljabr.Element('e');
    a = new aljabr.Element('a');
    console.log(e.symbol);
    testSet1 = new aljabr.ElementSet([e, a]);
    console.log('order: ' + testSet1.order);
    console.log('0: ' + testSet1.element(0).symbol);
    console.log('1: ' + testSet1.element(1).symbol);
    groupBuilder1 = new aljabr.GroupBuilder(testSet1);
    console.log('groupBuilder1:');
    console.log(groupBuilder1.toStr());
    groupBuilder1.set_element(1, 1, 0);
    console.log('groupBuilder1:');
    console.log(groupBuilder1.toStr());
    console.log('order e: ' + groupBuilder1.elementOrder(0));
    console.log('order a: ' + groupBuilder1.elementOrder(1));
    
    b = new aljabr.Element('b');
    c = new aljabr.Element('c');
    d = new aljabr.Element('d');
    testSet2 = new aljabr.ElementSet([e, a, b, c, d]);
    groupBuilder2 = new aljabr.GroupBuilder(testSet2);
    console.log('groupBuilder2:');
    console.log(groupBuilder2.toStr());
    groupBuilder2.set_element(1, 1, 2);
    groupBuilder2.set_element(1, 2, 3);
    groupBuilder2.set_element(1, 3, 4);
    groupBuilder2.set_element(1, 4, 0);
    console.log('groupBuilder2:');
    console.log(groupBuilder2.toStr());
    console.log('open positions 1:');
    console.log(boolTableToStr(groupBuilder2.openPositions(1)));
    console.log('open positions 2:');
    console.log(boolTableToStr(groupBuilder2.openPositions(2)));
    console.log('open positions 3:');
    console.log(boolTableToStr(groupBuilder2.openPositions(3)));
    console.log('open positions 4:');
    console.log(boolTableToStr(groupBuilder2.openPositions(4)));
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
    console.log('groupBuilder2:');
    console.log(groupBuilder2.toStr());
    console.log('order e: ' + groupBuilder2.elementOrder(0));
    console.log('order a: ' + groupBuilder2.elementOrder(1));
    console.log('order b: ' + groupBuilder2.elementOrder(2));
    console.log('order c: ' + groupBuilder2.elementOrder(3));
    console.log('order d: ' + groupBuilder2.elementOrder(4));

    o = new aljabr.Element('1');
    om = new aljabr.Element('-1');
    i = new aljabr.Element('i');
    im = new aljabr.Element('-i');
    j = new aljabr.Element('j');
    jm = new aljabr.Element('-j');
    k = new aljabr.Element('k');
    km = new aljabr.Element('-k');
    testSet3 = new aljabr.ElementSet([o, om, i, im, j, jm, k, km]);
    groupBuilder3 = new aljabr.GroupBuilder(testSet3);
    console.log('quaternion group:');
    console.log(groupBuilder3.toStr());
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
    console.log('quaternion group:');
    console.log(groupBuilder3.toStr());
    console.log('open positions 1:');
    console.log(boolTableToStr(groupBuilder3.openPositions(1)));
    console.log('open positions 2:');
    console.log(boolTableToStr(groupBuilder3.openPositions(2)));
    console.log('open positions 3:');
    console.log(boolTableToStr(groupBuilder3.openPositions(3)));
    console.log('open positions 4:');
    console.log(boolTableToStr(groupBuilder3.openPositions(4)));
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
    console.log('quaternion group:');
    console.log(groupBuilder3.toStr());
    console.log('order 1: ' + groupBuilder3.elementOrder(0));
    console.log('order -1: ' + groupBuilder3.elementOrder(1));
    console.log('order i: ' + groupBuilder3.elementOrder(2));
    console.log('order -i: ' + groupBuilder3.elementOrder(3));
    console.log('order j: ' + groupBuilder3.elementOrder(4));
    console.log('order -j: ' + groupBuilder3.elementOrder(5));
    console.log('order k: ' + groupBuilder3.elementOrder(6));
    console.log('order -k: ' + groupBuilder3.elementOrder(7));
};


aljabr.test.test_Permutor = function() {
    'use strict;'
    var a, e, x, y, z, perm1, perm2, perm3, perm4, pgb1, pgb2, pgb3, g1, g2, g3;
    
    console.log('\n\n***** Permutor Test *****');
    a = new aljabr.Permutor([0, 1, 2, 3, 4, 5]);
    console.log(a);
    
    console.log(a.op(1));
    console.log(a.op(5));
    
    e = new aljabr.Permutor([0, 1, 2]);
    console.log('e: ' + e.toStr());
    console.log('ee: ' + e.operate(e).toStr());
    console.log('eee: ' + e.operate(e.operate(e)).toStr());
    
    x = new aljabr.Permutor([1, 2, 0]);
    console.log('x: ' + x.toStr());
    console.log('xx: ' + x.operate(x).toStr());
    console.log('xxx: ' + x.operate(x.operate(x)).toStr());
    
    y = new aljabr.Permutor([0, 2, 1])
    console.log('y: ' + y.toStr());
    console.log('yy: ' + y.operate(y).toStr());
    
    console.log('yx: ' + y.operate(x).toStr());
    console.log('xy: ' + x.operate(y).toStr());
    
    console.log('toStr2 (actionArray)');
    console.log('e: ' + e.toStr2());
    console.log('x: ' + x.toStr2());
    console.log('y: ' + y.toStr2());
    
    console.log('(1 == 2): ' + (1 == 2).toStr());
    console.log('(1 == 1): ' + (1 == 1).toStr());
    console.log('([0, 1, 2] == [0, 1, 2]): ' + ([0, 1, 2] == [0, 1, 2]).toStr());
    console.log('([0, 1, 2] == [0, 1, 2, 3]): ' + ([0, 1, 2] == [0, 1, 2, 3]).toStr());
    
    z = new aljabr.Permutor([1, 2, 0]);
    console.log('(e == e): ' + (e == e).toStr());
    console.log('(e == x): ' + (e == x).toStr());
    console.log('(e == y): ' + (e == y).toStr());
    console.log('(x == x): ' + (x == x).toStr());
    console.log('(x == y): ' + (x == y).toStr());
    console.log('(x == z): ' + (x == z).toStr());
    
    console.log('\n\n***** PermutationGroupBuilder Test *****');
    
    perm1 = new aljabr.Permutor([1, 2, 3, 4, 5, 6, 0]);
    pgb1 = new aljabr.PermutationGroupBuilder([perm1]);
    g1 = pgb1.build_group;
    pgb1.print_permutors;

    perm2 = new aljabr.Permutor([1, 0, 3, 2]);
    pgb2 = new aljabr.PermutationGroupBuilder([perm2]);
    g2 = pgb2.build_group;
    pgb2.print_permutors;
    
    perm3 = new aljabr.Permutor([1, 0, 2, 3]);
    perm4 = new aljabr.Permutor([0, 1, 3, 2]);
    pgb3 = new aljabr.PermutationGroupBuilder([perm3, perm4]);
    g3 = pgb3.build_group;
    pgb3.print_permutors;
};


aljabr.test.test_group_builders = function() {
    'use strict';
    var g13, g7, g3, g4, g2, g2x2, g2x3;
    
    console.log('\n\n***** Group Builder Function Tests *****');
    
    g13 = build_cyclic_group(13);
    g7 = build_dihedral_group(7);
    g3 = build_symmetry_group(3);
    g4 = build_alternating_group(4);
    g2 = build_cyclic_group(2);
    g3 = build_cyclic_group(3);
    g2x2 = build_product_group(g2, g2);
    g2x3 = build_product_group(g2, g3);
    console.log('g13 order 1: ' + g13.elementOrder(1));
    console.log('g13 index 1: ' + g13.elementIndex(1));
    console.log(g13.toStr());
    console.log('g7 order 1: ' + g7.elementOrder(1));
    console.log('g7 index 1: ' + g7.elementIndex(1));
    console.log(g7.toStr());
    console.log('g3 order 1: ' + g3.elementOrder(1));
    console.log('g3 index 1: ' + g3.elementIndex(1));
    console.log(g3.toStr());
    console.log('g4 order 1: ' + g4.elementOrder(1));
    console.log('g4 index 1: ' + g4.elementIndex(1));
    console.log(g4.toStr());
    console.log('g2x2 order 1: ' + g2x2.elementOrder(1));
    console.log('g2x2 index 1: ' + g2x2.elementIndex(1));
    console.log(g2x2.toStr());
    console.log('g2x3 order 1: ' + g2x3.elementOrder(1));
    console.log('g2x3 index 1: ' + g2x3.elementIndex(1));
    console.log(g2x3.toStr());
};


aljabr.test.test_cyclic_groups = function() {
    'use strict';
    var g1, g2, g3, g4, g5, g10, g20, g30, g40;
    
    console.log('\n\n***** Cyclic Group Test *****');
    
    g1 = build_cyclic_group(1);
    g2 = build_cyclic_group(2);
    g3 = build_cyclic_group(3);
    g4 = build_cyclic_group(4);
    g5 = build_cyclic_group(5);
    g10 = build_cyclic_group(10);
    g20 = build_cyclic_group(20);
    // g30 = build_cyclic_group(30);  // order 30
    // g40 = build_cyclic_group(40);  // order 40
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    console.log(g5.toStr());
    console.log(g10.toStr());
    console.log(g20.toStr());
};


aljabr.test.test_dihedral_groups = function() {
    'use strict';
    var g1, g2, g3, g4, g5, g6, g7;

    console.log('\n\n***** Dihedral Group Test *****');
    
    g1 = build_dihedral_group(1)
    g2 = build_dihedral_group(2);
    g3 = build_dihedral_group(3);
    g4 = build_dihedral_group(4);
    g5 = build_dihedral_group(5);
    g6 = build_dihedral_group(6);
    g7 = build_dihedral_group(7);  // order 14
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    console.log(g5.toStr());
    console.log(g6.toStr());
    console.log(g7.toStr());
};


aljabr.test.test_symmetry_groups = function() {
    'use strict';
    var g1, g2, g3, g4, g5;
    
    console.log('\n\n***** Symmetry Group Test *****');
    
    g1 = build_symmetry_group(1);
    g2 = build_symmetry_group(2);
    g3 = build_symmetry_group(3);
    g4 = build_symmetry_group(4);
    // g5 = build_symmetry_group(5);  // order 120
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    // console.log(g5.toStr());
};


aljabr.test.test_alternating_groups = function() {
    'use strict';
    var g1, g2, g3, g4, g5;
    
    console.log('\n\n***** Alternating Group Test *****');
    
    g1 = build_alternating_group(1);
    g2 = build_alternating_group(2);
    g3 = build_alternating_group(3);
    g4 = build_alternating_group(4);
    // g5 = build_alternating_group(5);  // order 60
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    // console.log(g5.toStr());
};


aljabr.test.boolTableToStr = function(table) {
    'use strict';
    var order, columnWidth, outString, i;
    
    // Set column width to size of largest element symbol
    order = table.length;
    columnWidth = 1;
    outString = ' #{' '.rjust(columnWidth)} |';
    for (i=0; i<order; i++) {
        outString += ' i |';
    }
    
    for (i=0; i<order; i++) {
        outString += '-#{'-'.rjust(columnWidth, '-')}-|';
    }
    
    for (i=0; i<order; i++) {
        outString += ' ' + i + ' |';
        for (j=0; j<order; j++) {
            if (table[i][j]) {
	        outString += ' 1 |';
            }
            else {
                outString += ' 0 |';
            }
        }
        
    }
    return outString;
};


aljabr.test.test_OperatorTable()
aljabr.test.test_GroupBuilder()
aljabr.test.test_Permutor()
aljabr.test.test_group_builders()
aljabr.test.test_cyclic_groups()
aljabr.test.test_dihedral_groups()
aljabr.test.test_symmetry_groups()
aljabr.test.test_alternating_groups()
