/* JSLint */
/*global console: false, aljabr: false, extend: false*/

extend(aljabr, 'test')

aljabr.test.testOperatorTable = function() {
    'use strict'
    let table

    console.log('\n\n***** OperatorTable Test *****\n')

    table = new aljabr.OperatorTable(2)
    console.log('table.getElement(0, 0): ' + table.getElement(0, 0))

    table.setElement(0, 0, 0)
    table.setElement(0, 1, 1)
    table.setElement(1, 0, 1)
    table.setElement(1, 1, 0)
    console.log('table.getElement(0, 0): ' + table.getElement(0, 0))
    console.log('table.getElement(0, 1): ' + table.getElement(0, 1))
    console.log('table.getElement(1, 0): ' + table.getElement(1, 0))
    console.log('table.getElement(1, 1): ' + table.getElement(1, 1))
}


aljabr.test.testGroupBuilder = function() {
    'use strict'
    let e, a, testSet1, groupBuilder1, b, c, d, testSet2, groupBuilder2, o, om, i, im, j, jm, k, km, testSet3, groupBuilder3

    console.log('\n\n***** GroupBuilder Test *****\n')
    e = 'e'
    a = 'a'
    console.log(e)
    testSet1 = [e, a]
    console.log('order: ' + testSet1.order)
    console.log('0: ' + testSet1[0])
    console.log('1: ' + testSet1[1])
    groupBuilder1 = new aljabr.GroupBuilder(testSet1)
    console.log('groupBuilder1:')
    console.log(groupBuilder1.toStr())
    groupBuilder1.setElement(1, 1, 0)
    console.log('groupBuilder1:')
    console.log(groupBuilder1.toStr())
    console.log('order e: ' + groupBuilder1.elementOrder(0))
    console.log('order a: ' + groupBuilder1.elementOrder(1))

    b = 'b'
    c = 'c'
    d = 'd'
    testSet2 = [e, a, b, c, d]
    groupBuilder2 = new aljabr.GroupBuilder(testSet2)
    console.log('groupBuilder2:')
    console.log(groupBuilder2.toStr())
    groupBuilder2.setElement(1, 1, 2)
    groupBuilder2.setElement(1, 2, 3)
    groupBuilder2.setElement(1, 3, 4)
    groupBuilder2.setElement(1, 4, 0)
    console.log('groupBuilder2:')
    console.log(groupBuilder2.toStr())
    console.log('open positions 1:')
    console.log(aljabr.test.boolTableToStr(groupBuilder2.openPositions(1)))
    console.log('open positions 2:')
    console.log(aljabr.test.boolTableToStr(groupBuilder2.openPositions(2)))
    console.log('open positions 3:')
    console.log(aljabr.test.boolTableToStr(groupBuilder2.openPositions(3)))
    console.log('open positions 4:')
    console.log(aljabr.test.boolTableToStr(groupBuilder2.openPositions(4)))
    groupBuilder2.setElement(2, 1, 3)
    groupBuilder2.setElement(2, 2, 4)
    groupBuilder2.setElement(2, 3, 0)
    groupBuilder2.setElement(2, 4, 1)
    groupBuilder2.setElement(3, 1, 4)
    groupBuilder2.setElement(3, 2, 0)
    groupBuilder2.setElement(3, 3, 1)
    groupBuilder2.setElement(3, 4, 2)
    groupBuilder2.setElement(4, 1, 0)
    groupBuilder2.setElement(4, 2, 1)
    groupBuilder2.setElement(4, 3, 2)
    groupBuilder2.setElement(4, 4, 3)
    console.log('groupBuilder2:')
    console.log(groupBuilder2.toStr())
    console.log('order e: ' + groupBuilder2.elementOrder(0))
    console.log('order a: ' + groupBuilder2.elementOrder(1))
    console.log('order b: ' + groupBuilder2.elementOrder(2))
    console.log('order c: ' + groupBuilder2.elementOrder(3))
    console.log('order d: ' + groupBuilder2.elementOrder(4))

    o = '1'
    om = '-1'
    i = 'i'
    im = '-i'
    j = 'j'
    jm = '-j'
    k = 'k'
    km = '-k'
    testSet3 = [o, om, i, im, j, jm, k, km]
    groupBuilder3 = new aljabr.GroupBuilder(testSet3)
    console.log('quaternion group:')
    console.log(groupBuilder3.toStr())
    groupBuilder3.setElement(1, 1, 0)
    groupBuilder3.setElement(1, 2, 3)
    groupBuilder3.setElement(2, 1, 3)
    groupBuilder3.setElement(1, 3, 2)
    groupBuilder3.setElement(3, 1, 2)
    groupBuilder3.setElement(1, 4, 5)
    groupBuilder3.setElement(4, 1, 5)
    groupBuilder3.setElement(1, 5, 4)
    groupBuilder3.setElement(5, 1, 4)
    groupBuilder3.setElement(1, 6, 7)
    groupBuilder3.setElement(6, 1, 7)
    groupBuilder3.setElement(1, 7, 6)
    groupBuilder3.setElement(7, 1, 6)
    console.log('quaternion group:')
    console.log(groupBuilder3.toStr())
    console.log('open positions 1:')
    console.log(aljabr.test.boolTableToStr(groupBuilder3.openPositions(1)))
    console.log('open positions 2:')
    console.log(aljabr.test.boolTableToStr(groupBuilder3.openPositions(2)))
    console.log('open positions 3:')
    console.log(aljabr.test.boolTableToStr(groupBuilder3.openPositions(3)))
    console.log('open positions 4:')
    console.log(aljabr.test.boolTableToStr(groupBuilder3.openPositions(4)))
    groupBuilder3.setElement(2, 2, 1)
    groupBuilder3.setElement(3, 3, 1)
    groupBuilder3.setElement(4, 4, 1)
    groupBuilder3.setElement(5, 5, 1)
    groupBuilder3.setElement(6, 6, 1)
    groupBuilder3.setElement(7, 7, 1)
    groupBuilder3.setElement(2, 3, 0)
    groupBuilder3.setElement(3, 2, 0)
    groupBuilder3.setElement(4, 5, 0)
    // groupBuilder3.setElement(5, 4, 0)
    // groupBuilder3.setElement(6, 7, 0)
    // groupBuilder3.setElement(7, 6, 0)
    groupBuilder3.setElement(6, 4, 2)
    groupBuilder3.setElement(4, 6, 3)
    groupBuilder3.setElement(4, 2, 6)
    groupBuilder3.setElement(2, 4, 7)
    groupBuilder3.setElement(2, 6, 4)
    groupBuilder3.setElement(6, 2, 5)
    console.log('quaternion group:')
    console.log(groupBuilder3.toStr())
    console.log('order 1: ' + groupBuilder3.elementOrder(0))
    console.log('order -1: ' + groupBuilder3.elementOrder(1))
    console.log('order i: ' + groupBuilder3.elementOrder(2))
    console.log('order -i: ' + groupBuilder3.elementOrder(3))
    console.log('order j: ' + groupBuilder3.elementOrder(4))
    console.log('order -j: ' + groupBuilder3.elementOrder(5))
    console.log('order k: ' + groupBuilder3.elementOrder(6))
    console.log('order -k: ' + groupBuilder3.elementOrder(7))
}


aljabr.test.testPermutor = function() {
    'use strict'
    let a, e, x, y, z, perm1, perm2, perm3, perm4, pgb1, pgb2, pgb3, g1, g2, g3

    console.log('\n\n***** Permutor Test *****')
    a = new aljabr.Permutor([0, 1, 2, 3, 4, 5])
    console.log(a)

    console.log(a.op(1))
    console.log(a.op(5))

    e = new aljabr.Permutor([0, 1, 2])
    console.log('e: ' + e.toStr())
    console.log('ee: ' + e.operate(e).toStr())
    console.log('eee: ' + e.operate(e.operate(e)).toStr())

    x = new aljabr.Permutor([1, 2, 0])
    console.log('x: ' + x.toStr())
    console.log('xx: ' + x.operate(x).toStr())
    console.log('xxx: ' + x.operate(x.operate(x)).toStr())

    y = new aljabr.Permutor([0, 2, 1])
    console.log('y: ' + y.toStr())
    console.log('yy: ' + y.operate(y).toStr())

    console.log('yx: ' + y.operate(x).toStr())
    console.log('xy: ' + x.operate(y).toStr())

    console.log('toStr2 (actionArray)')
    console.log('e: ' + e.toStr2())
    console.log('x: ' + x.toStr2())
    console.log('y: ' + y.toStr2())

    z = new aljabr.Permutor([1, 2, 0])
    console.log('(e === e): ' + (e === e))
    console.log('(e === x): ' + (e === x))
    console.log('(e === y): ' + (e === y))
    console.log('(x === x): ' + (x === x))
    console.log('(x === y): ' + (x === y))
    console.log('(x === z): ' + (x === z))

    console.log('\n\n***** PermutationGroupBuilder Test *****')

    perm1 = new aljabr.Permutor([1, 2, 3, 4, 5, 6, 0])
    pgb1 = new aljabr.PermutationGroupBuilder([perm1])
    g1 = pgb1.buildGroup()
    pgb1.printPermutors()

    perm2 = new aljabr.Permutor([1, 0, 3, 2])
    pgb2 = new aljabr.PermutationGroupBuilder([perm2])
    g2 = pgb2.buildGroup()
    pgb2.printPermutors()

    perm3 = new aljabr.Permutor([1, 0, 2, 3])
    perm4 = new aljabr.Permutor([0, 1, 3, 2])
    pgb3 = new aljabr.PermutationGroupBuilder([perm3, perm4])
    g3 = pgb3.buildGroup()
    pgb3.printPermutors()
}


aljabr.test.testArithmetic = function() {
    'use strict'
    let ar1, ar2, ar3, agb1, agb2, agb3, g1, g2, g3

    console.log('\n\n***** ArithmeticGroupBuilder Test *****')

    ar1 = [0,1,2,3,4]
    agb1 = new aljabr.ArithmeticGroupBuilder(ar1, '+', 5)
    g1 = agb1.buildGroup()
    console.log(g1.toStr())

    ar2 = [1,2,3,4]
    agb2 = new aljabr.ArithmeticGroupBuilder(ar2, '*', 5)
    g2 = agb2.buildGroup()
    console.log(g2.toStr())

    ar3 = [1,2,3,4,5,6,7,8,9,10]
    agb3 = new aljabr.ArithmeticGroupBuilder(ar3, '*', 11)
    g3 = agb3.buildGroup()
    console.log(g3.toStr())
}


aljabr.test.testGroupBuilders = function() {
    'use strict'
    let g13, g7, g3, g4, g2, g2x2, g2x3

    console.log('\n\n***** Group Builder Function Tests *****')

    g13 = aljabr.buildCyclicGroup(13)
    g7 = aljabr.buildDihedralGroup(7)
    g3 = aljabr.buildSymmetryGroup(3)
    g4 = aljabr.buildAlternatingGroup(4)
    g2 = aljabr.buildCyclicGroup(2)
    g3 = aljabr.buildCyclicGroup(3)
    g2x2 = aljabr.buildProductGroup(g2, g2)
    g2x3 = aljabr.buildProductGroup(g2, g3)
    console.log('g13 order 1: ' + g13.elementOrder(1))
    console.log('g13 index 1: ' + g13.elementIndex(1))
    console.log(g13.toStr())
    console.log('g7 order 1: ' + g7.elementOrder(1))
    console.log('g7 index 1: ' + g7.elementIndex(1))
    console.log(g7.toStr())
    console.log('g3 order 1: ' + g3.elementOrder(1))
    console.log('g3 index 1: ' + g3.elementIndex(1))
    console.log(g3.toStr())
    console.log('g4 order 1: ' + g4.elementOrder(1))
    console.log('g4 index 1: ' + g4.elementIndex(1))
    console.log(g4.toStr())
    console.log('g2x2 order 1: ' + g2x2.elementOrder(1))
    console.log('g2x2 index 1: ' + g2x2.elementIndex(1))
    console.log(g2x2.toStr())
    console.log('g2x3 order 1: ' + g2x3.elementOrder(1))
    console.log('g2x3 index 1: ' + g2x3.elementIndex(1))
    console.log(g2x3.toStr())
}


aljabr.test.testCyclicGroups = function() {
    'use strict'
    let g1, g2, g3, g4, g5, g10, g20, g30, g40

    console.log('\n\n***** Cyclic Group Test *****')

    g1 = aljabr.buildCyclicGroup(1)
    g2 = aljabr.buildCyclicGroup(2)
    g3 = aljabr.buildCyclicGroup(3)
    g4 = aljabr.buildCyclicGroup(4)
    g5 = aljabr.buildCyclicGroup(5)
    g10 = aljabr.buildCyclicGroup(10)
    g20 = aljabr.buildCyclicGroup(20)
    // g30 = aljabr.buildCyclicGroup(30)  // order 30
    // g40 = aljabr.buildCyclicGroup(40)  // order 40
    console.log(g1.toStr())
    console.log(g2.toStr())
    console.log(g3.toStr())
    console.log(g4.toStr())
    console.log(g5.toStr())
    console.log(g10.toStr())
    console.log(g20.toStr())
}


aljabr.test.testDihedralGroups = function() {
    'use strict'
    let g1, g2, g3, g4, g5, g6, g7

    console.log('\n\n***** Dihedral Group Test *****')

    g1 = aljabr.buildDihedralGroup(1)
    g2 = aljabr.buildDihedralGroup(2)
    g3 = aljabr.buildDihedralGroup(3)
    g4 = aljabr.buildDihedralGroup(4)
    g5 = aljabr.buildDihedralGroup(5)
    g6 = aljabr.buildDihedralGroup(6)
    g7 = aljabr.buildDihedralGroup(7)  // order 14
    console.log(g1.toStr())
    console.log(g2.toStr())
    console.log(g3.toStr())
    console.log(g4.toStr())
    console.log(g5.toStr())
    console.log(g6.toStr())
    console.log(g7.toStr())
}


aljabr.test.testSymmetryGroups = function() {
    'use strict'
    let g1, g2, g3, g4, g5, g12, g22, g32, g42

    console.log('\n\n***** Symmetry Group Test *****')

    g1 = aljabr.buildSymmetryGroup(1)
    g2 = aljabr.buildSymmetryGroup(2)
    g3 = aljabr.buildSymmetryGroup(3)
    g4 = aljabr.buildSymmetryGroup(4)
    // g5 = aljabr.buildSymmetryGroup(5)  // order 120

    g32 = aljabr.buildSymmetryGroup3(3)
    g42 = aljabr.buildSymmetryGroup3(4)

    console.log(g1.toStr())
    console.log(g2.toStr())
    console.log(g3.toStr())
    console.log(g32.toStr())
    console.log(g4.toStr())
    console.log(g42.toStr())
    // console.log(g5.toStr())
}


aljabr.test.testAlternatingGroups = function() {
    'use strict'
    let g1, g2, g3, g4, g5, g12, g22, g32, g42, g52

    console.log('\n\n***** Alternating Group Test *****')

    g1 = aljabr.buildAlternatingGroup(1)
    g2 = aljabr.buildAlternatingGroup(2)
    g3 = aljabr.buildAlternatingGroup(3)
    g4 = aljabr.buildAlternatingGroup(4)
    g5 = aljabr.buildAlternatingGroup(5)  // order 60

    g12 = aljabr.buildAlternatingGroup2(1)
    g22 = aljabr.buildAlternatingGroup2(2)
    g32 = aljabr.buildAlternatingGroup2(3)
    g42 = aljabr.buildAlternatingGroup2(4)
    g52 = aljabr.buildAlternatingGroup2(5)  // order 60

    console.log(g1.toStr())
    // console.log(g12.toStr())
    console.log(g2.toStr())
    // console.log(g22.toStr())
    console.log(g3.toStr())
    // console.log(g32.toStr())
    console.log(g4.toStr())
    console.log(g42.toStr())
    console.log(g5.toStr())
    console.log(g52.toStr())
}


aljabr.test.testCosets = function() {
    'use strict'
    let g1, g2, g3, g4, groups

    console.log('\n\n***** Cosets Test *****')

    g1 = aljabr.buildCyclicGroup(5)
    g2 = aljabr.buildDihedralGroup(5)
    g3 = aljabr.buildSymmetryGroup(4)
    g4 = aljabr.buildAlternatingGroup(5)

    groups = [g1, g2, g3, g4]

    for (let i=0; i<groups.length; i++) {
        console.log('*** group ' + (i+1))
        console.log(groups[i].toStr())
        console.log('cosets 1')
        console.log(groups[i].cosets([1]))
        console.log(groups[i].cosets([1], false))
        console.log('cosets 2')
        console.log(groups[i].cosets([2]))
        console.log(groups[i].cosets([2], false))
        console.log('cosets 4')
        console.log(groups[i].cosets([4]))
        console.log(groups[i].cosets([4], false))
        console.log('cosets 1 2')
        console.log(groups[i].cosets([1, 2]))
        console.log(groups[i].cosets([1, 2], false))
        console.log('cosets 1 3')
        console.log(groups[i].cosets([1, 3]))
        console.log(groups[i].cosets([1, 3], false))
    }
}


aljabr.test.testFieldBuilder = function() {
    'use strict'
    let f3, f5, f11

    console.log('\n\n***** Field Builder Tests *****')

    f3 = aljabr.buildField(3)
    console.log('f3 order 1 (+): ' + f3.elementOrder(1, '+'))
    console.log('f3 index 1 (+): ' + f3.elementIndex(1, '+'))
    console.log('f3 order 1 (*): ' + f3.elementOrder(1, '*'))
    console.log('f3 index 1 (*): ' + f3.elementIndex(1, '*'))
    console.log(f3.toStr())

    f5 = aljabr.buildField(5)
    console.log('f5 order 1 (+): ' + f5.elementOrder(1, '+'))
    console.log('f5 index 1 (+): ' + f5.elementIndex(1, '+'))
    console.log('f5 order 1 (*): ' + f5.elementOrder(1, '*'))
    console.log('f5 index 1 (*): ' + f5.elementIndex(1, '*'))
    console.log(f5.toStr())

    // f11 = aljabr.buildField(11)
    // console.log('f11 order 1 (+): ' + f11.elementOrder(1, '+'))
    // console.log('f11 index 1 (+): ' + f11.elementIndex(1, '+'))
    // console.log('f11 order 1 (*): ' + f11.elementOrder(1, '*'))
    // console.log('f11 index 1 (*): ' + f11.elementIndex(1, '*'))
    // console.log(f11.toStr())
}


aljabr.test.boolTableToStr = function(table) {
    'use strict'
    let order, colWidth, outStr, i, j

    // Set column width to size of largest element symbol
    order = table.length
    colWidth = 1
    outStr = ' ' + aljabr.rJust(' ', colWidth) + ' |'
    for (i=0; i<order; i++) {
        outStr += ' ' +
            aljabr.rJust(i, colWidth) +
            ' |'
    }
    outStr += '\n'

    for (i=0; i<=order; i++) {
        outStr += '-' + aljabr.rJust('-', colWidth, '-') + '-|'
    }
    outStr += '\n'

    for (i=0; i<order; i++) {
        outStr += ' ' + i + ' |'
        for (j=0; j<order; j++) {
            if (table[i][j]) {
	        outStr += ' 1 |'
            }
            else {
                outStr += ' 0 |'
            }
        }
        outStr += '\n'
    }

    return outStr
}


// aljabr.test.testOperatorTable()
// aljabr.test.testGroupBuilder()
// aljabr.test.testPermutor()
// aljabr.test.testArithmetic()
// aljabr.test.testCyclicGroups()
// aljabr.test.testDihedralGroups()
// aljabr.test.testSymmetryGroups()
// aljabr.test.testAlternatingGroups()
// aljabr.test.testGroupBuilders()
aljabr.test.testCosets()
// aljabr.test.testFieldBuilder()
