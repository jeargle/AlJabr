
$(document).ready(function() {
    'use strict'
    let builder, group, elements, testSet

    console.log('ready')

    builder = aljabr.builder

    builder.settingsView = new builder.SettingsView('settings')
    builder.cayleyTableView = new builder.CayleyTableView('cayley-table')
    builder.elementView = new builder.ElementView('element-inspector')
    builder.cayleyGraphView = new builder.CayleyGraphView('cayley-graph')

    // aljabr.group = aljabr.buildCyclicGroup(13)
    // aljabr.group = aljabr.buildDihedralGroup(6)
    // aljabr.group = aljabr.buildAlternatingGroup(4)
    // aljabr.group = aljabr.buildSymmetryGroup(3)
    // aljabr.group = new aljabr.GroupBuilder(aljabr.alphaElements(8))

    // group = aljabr.group

    // builder.cayleyTableView.attach(group)
    // builder.cayleyGraphView.attach(group)
    // builder.cayleyGraphView.toggleEdges(1)
    // console.log(group.elementSubgroup(1))
    // console.log(group.elementSubgroup(2))
    // console.log(group.elementSubgroup(5))
    // console.log(group.cosets(1))
    // console.log(group.cosets(2))
    // console.log(group.cosets(5))
})
