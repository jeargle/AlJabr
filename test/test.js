/* JSLint */
/*global console: false, aljabr: false */

extend(aljabr, 'test');

aljabr.test.testOperatorTable = function() {
    'use strict';
    var table;
    
    console.log('\n\n***** OperatorTable Test *****\n');
    
    // table = new aljabr.OperatorTable(2);
    table = new aljabr.OperatorTable();
    table.init(2);
    console.log('table.getElement(0, 0): ' + table.getElement(0, 0));
    
    table.setElement(0, 0, 0);
    table.setElement(0, 1, 1);
    table.setElement(1, 0, 1);
    table.setElement(1, 1, 0);
    console.log('table.getElement(0, 0): ' + table.getElement(0, 0));
    console.log('table.getElement(0, 1): ' + table.getElement(0, 1));
    console.log('table.getElement(1, 0): ' + table.getElement(1, 0));
    console.log('table.getElement(1, 1): ' + table.getElement(1, 1));
};


aljabr.test.testGroupBuilder = function() {
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
    groupBuilder1.setElement(1, 1, 0);
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
    groupBuilder2.setElement(1, 1, 2);
    groupBuilder2.setElement(1, 2, 3);
    groupBuilder2.setElement(1, 3, 4);
    groupBuilder2.setElement(1, 4, 0);
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
    groupBuilder2.setElement(2, 1, 3);
    groupBuilder2.setElement(2, 2, 4);
    groupBuilder2.setElement(2, 3, 0);
    groupBuilder2.setElement(2, 4, 1);
    groupBuilder2.setElement(3, 1, 4);
    groupBuilder2.setElement(3, 2, 0);
    groupBuilder2.setElement(3, 3, 1);
    groupBuilder2.setElement(3, 4, 2);
    groupBuilder2.setElement(4, 1, 0);
    groupBuilder2.setElement(4, 2, 1);
    groupBuilder2.setElement(4, 3, 2);
    groupBuilder2.setElement(4, 4, 3);
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
    groupBuilder3.setElement(1, 1, 0);
    groupBuilder3.setElement(1, 2, 3);
    groupBuilder3.setElement(2, 1, 3);
    groupBuilder3.setElement(1, 3, 2);
    groupBuilder3.setElement(3, 1, 2);
    groupBuilder3.setElement(1, 4, 5);
    groupBuilder3.setElement(4, 1, 5);
    groupBuilder3.setElement(1, 5, 4);
    groupBuilder3.setElement(5, 1, 4);
    groupBuilder3.setElement(1, 6, 7);
    groupBuilder3.setElement(6, 1, 7);
    groupBuilder3.setElement(1, 7, 6);
    groupBuilder3.setElement(7, 1, 6);
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
    groupBuilder3.setElement(2, 2, 1);
    groupBuilder3.setElement(3, 3, 1);
    groupBuilder3.setElement(4, 4, 1);
    groupBuilder3.setElement(5, 5, 1);
    groupBuilder3.setElement(6, 6, 1);
    groupBuilder3.setElement(7, 7, 1);
    groupBuilder3.setElement(2, 3, 0);
    groupBuilder3.setElement(3, 2, 0);
    groupBuilder3.setElement(4, 5, 0);
    // groupBuilder3.setElement(5, 4, 0);
    // groupBuilder3.setElement(6, 7, 0);
    // groupBuilder3.setElement(7, 6, 0);
    groupBuilder3.setElement(6, 4, 2);
    groupBuilder3.setElement(4, 6, 3);
    groupBuilder3.setElement(4, 2, 6);
    groupBuilder3.setElement(2, 4, 7);
    groupBuilder3.setElement(2, 6, 4);
    groupBuilder3.setElement(6, 2, 5);
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


aljabr.test.testPermutor = function() {
    'use strict;'
    var a, e, x, y, z, perm1, perm2, perm3, perm4, pgb1, pgb2, pgb3, g1, g2, g3;
    
    console.log('\n\n***** Permutor Test *****');
    a = new aljabr.Permutor();
    a.init([0, 1, 2, 3, 4, 5]);
    console.log(a);
    
    console.log(a.op(1));
    console.log(a.op(5));
    
    e = new aljabr.Permutor();
    e.init([0, 1, 2]);
    console.log('e: ' + e.toStr());
    console.log('ee: ' + e.operate(e).toStr());
    console.log('eee: ' + e.operate(e.operate(e)).toStr());
    
    x = new aljabr.Permutor();
    x.init([1, 2, 0]);
    console.log('x: ' + x.toStr());
    console.log('xx: ' + x.operate(x).toStr());
    console.log('xxx: ' + x.operate(x.operate(x)).toStr());
    
    y = new aljabr.Permutor();
    y.init([0, 2, 1])
    console.log('y: ' + y.toStr());
    console.log('yy: ' + y.operate(y).toStr());
    
    console.log('yx: ' + y.operate(x).toStr());
    console.log('xy: ' + x.operate(y).toStr());
    
    console.log('toStr2 (actionArray)');
    console.log('e: ' + e.toStr2());
    console.log('x: ' + x.toStr2());
    console.log('y: ' + y.toStr2());
    
    console.log('(1 == 2): ' + (1 == 2));
    console.log('(1 == 1): ' + (1 == 1));
    console.log('([0, 1, 2] == [0, 1, 2]): ' + ([0, 1, 2] == [0, 1, 2]));
    console.log('([0, 1, 2] == [0, 1, 2, 3]): ' + ([0, 1, 2] == [0, 1, 2, 3]));
    
    z = new aljabr.Permutor();
    z.init([1, 2, 0]);
    console.log('(e == e): ' + (e == e));
    console.log('(e == x): ' + (e == x));
    console.log('(e == y): ' + (e == y));
    console.log('(x == x): ' + (x == x));
    console.log('(x == y): ' + (x == y));
    console.log('(x == z): ' + (x == z));
    
    // console.log('\n\n***** PermutationGroupBuilder Test *****');
    
    // perm1 = new aljabr.Permutor();
    // perm1.init([1, 2, 3, 4, 5, 6, 0]);
    // pgb1 = new aljabr.PermutationGroupBuilder();
    // pgb1.init([perm1]);
    // g1 = pgb1.buildGroup();
    // pgb1.printPermutors();

    // perm2 = new aljabr.Permutor();
    // perm2.init([1, 0, 3, 2]);
    // pgb2 = new aljabr.PermutationGroupBuilder();
    // pgb2.init([perm2]);
    // g2 = pgb2.buildGroup();
    // pgb2.printPermutors();
    
    // perm3 = new aljabr.Permutor();
    // perm3.init([1, 0, 2, 3]);
    // perm4 = new aljabr.Permutor();
    // perm4.init([0, 1, 3, 2]);
    // pgb3 = new aljabr.PermutationGroupBuilder();
    // pgb3.init([perm3, perm4]);
    // g3 = pgb3.buildGroup();
    // pgb3.printPermutors();
};


aljabr.test.testGroupBuilders = function() {
    'use strict';
    var g13, g7, g3, g4, g2, g2x2, g2x3;
    
    console.log('\n\n***** Group Builder Function Tests *****');
    
    g13 = buildCyclicGroup(13);
    g7 = buildDihedralGroup(7);
    g3 = buildSymmetryGroup(3);
    g4 = buildAlternatingGroup(4);
    g2 = buildCyclicGroup(2);
    g3 = buildCyclicGroup(3);
    g2x2 = buildProductGroup(g2, g2);
    g2x3 = buildProductGroup(g2, g3);
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


aljabr.test.testCyclicGroups = function() {
    'use strict';
    var g1, g2, g3, g4, g5, g10, g20, g30, g40;
    
    console.log('\n\n***** Cyclic Group Test *****');
    
    g1 = buildCyclicGroup(1);
    g2 = buildCyclicGroup(2);
    g3 = buildCyclicGroup(3);
    g4 = buildCyclicGroup(4);
    g5 = buildCyclicGroup(5);
    g10 = buildCyclicGroup(10);
    g20 = buildCyclicGroup(20);
    // g30 = buildCyclicGroup(30);  // order 30
    // g40 = buildCyclicGroup(40);  // order 40
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    console.log(g5.toStr());
    console.log(g10.toStr());
    console.log(g20.toStr());
};


aljabr.test.testDihedralGroups = function() {
    'use strict';
    var g1, g2, g3, g4, g5, g6, g7;

    console.log('\n\n***** Dihedral Group Test *****');
    
    g1 = buildDihedralGroup(1)
    g2 = buildDihedralGroup(2);
    g3 = buildDihedralGroup(3);
    g4 = buildDihedralGroup(4);
    g5 = buildDihedralGroup(5);
    g6 = buildDihedralGroup(6);
    g7 = buildDihedralGroup(7);  // order 14
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    console.log(g5.toStr());
    console.log(g6.toStr());
    console.log(g7.toStr());
};


aljabr.test.testSymmetryGroups = function() {
    'use strict';
    var g1, g2, g3, g4, g5;
    
    console.log('\n\n***** Symmetry Group Test *****');
    
    g1 = buildSymmetryGroup(1);
    g2 = buildSymmetryGroup(2);
    g3 = buildSymmetryGroup(3);
    g4 = buildSymmetryGroup(4);
    // g5 = buildSymmetryGroup(5);  // order 120
    console.log(g1.toStr());
    console.log(g2.toStr());
    console.log(g3.toStr());
    console.log(g4.toStr());
    // console.log(g5.toStr());
};


aljabr.test.testAlternatingGroups = function() {
    'use strict';
    var g1, g2, g3, g4, g5;
    
    console.log('\n\n***** Alternating Group Test *****');
    
    g1 = buildAlternatingGroup(1);
    g2 = buildAlternatingGroup(2);
    g3 = buildAlternatingGroup(3);
    g4 = buildAlternatingGroup(4);
    // g5 = buildAlternatingGroup(5);  // order 60
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
    outString = ' ' + aljabr.rjust(' ', columnWidth) + ' |';
    for (i=0; i<order; i++) {
        outString += ' i |';
    }
    
    for (i=0; i<order; i++) {
        outString += '-' + aljabr.rjust('-', columnWidth, '-') + '-|';
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


aljabr.test.testOperatorTable()
// aljabr.test.testGroupBuilder()
aljabr.test.testPermutor()
// aljabr.test.testGroupBuilders()
// aljabr.test.testCyclicGroups()
// aljabr.test.testDihedralGroups()
// aljabr.test.testSymmetryGroups()
// aljabr.test.testAlternatingGroups()
