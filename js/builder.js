/* JSLint */
/*global console: false, aljabr: false, extend: false, $: false, _: false, d3: false*/


extend(aljabr, 'builder')


aljabr.builder.SettingsView = class {
    width = 0
    height = 0
    groupType = 'E'
    subscript = '1'
    nameMap = {
        empty: 'E',
        cyclic: 'C',
        dihedral: 'D',
        alternating: 'A',
        symmetry: 'S'
    }

    constructor(id) {
        'use strict'
        let view

        view = this
        view.id = id
        view.el = d3.select('#' + view.id)
        view.width = 300
        view.height = 120
        view.el.html('<select id="group-type-menu">\
            <option value="empty">Empty</option>\
            <option value="cyclic">Cyclic</option>\
            <option value="dihedral">Dihedral</option>\
            <option value="alternating">Alternating</option>\
            <option value="symmetry">Symmetry</option>\
          </select>\
          <select id="group-order-menu">\
          </select>\
          <button id="apply-btn" type="button">Create</button>\
          <span id="group-name" style="font-size:36px;"><span>E</span><sub>1</sub> </span>\
          <span style="font-size:36px;">order: <span id="group-order">1</span></span>')

        view.el.select('#group-type-menu')
            .on('change', function() {
                let oldGroupType
                console.log('type change')
                oldGroupType = view.groupType
                view.groupType = view.nameMap[d3.event.target.value]
                if (oldGroupType === 'D' ||
                   view.groupType === 'D') {
                    view.buildOrderMenu()
                }
                view.render()
            })

        view.el.select('#group-order-menu')
            .on('change', function() {
                console.log('order change')
                view.subscript = d3.event.target.value
                view.render()
            })

        view.el.select('#apply-btn')
            .on('click', function() {
                view.attachNewGroup.apply(view)
            })

        view.buildOrderMenu()

        view.render()
    }

    buildOrderMenu() {
        'use strict'
        let view, orderMenu, start, i

        view = this
        orderMenu = view.el.select('#group-order-menu')

        start = 1
        if (view.groupType === 'D') {
            start = 3
        }

        orderMenu.html('')
        for (i=start; i<=10; i++) {
            orderMenu.append('option')
                .property('value', i)
                .text(i)
        }

        if (view.groupType === 'D' &&
            (view.subscript === '1' ||
             view.subscript === '2')) {
            view.subscript = '3'
        }

        orderMenu.property('value', view.subscript)
    }

    render() {
        'use strict'
        let view, order

        view = this

        order = ''
        if (view.groupType === 'E' ||
            view.groupType === 'C') {
            order = view.subscript
        }
        else if (view.groupType === 'D') {
            order = parseInt(view.subscript, 10) * 2
        }
        else if (view.groupType === 'A') {
            order = aljabr.factorial(parseInt(view.subscript, 10))/2
        }
        else if (view.groupType === 'S') {
            order = aljabr.factorial(parseInt(view.subscript, 10))
        }

        console.log('order: ' + order)
        view.el.select('#group-name')
            .select('span')
            .text(view.groupType)
        view.el.select('#group-name')
            .select('sub')
            .text(view.subscript)
        view.el.select('#group-order')
            .text(order)

        return view
    }

    /**
     * Select the group type.
     */
    select() {
    }

    /**
     * Attach the selected group type to the CayleyTableView and
     * CayleyGraphView.
     */
    attachNewGroup() {
        'use strict'
        let view, builder, groupType, order

        view = this
        builder = aljabr.builder

        groupType = view.el.select('#group-type-menu')
            .property('value')
        order = parseInt(view.el.select('#group-order-menu')
                         .property('value'), 10)
        console.log('groupType: ' + groupType)
        console.log('order: ' + order)

        if (groupType === 'empty') {
            aljabr.group = new aljabr.GroupBuilder(aljabr.alphaElements(order))
        }
        else if (groupType === 'cyclic') {
            aljabr.group = aljabr.buildCyclicGroup(order)
        }
        else if (groupType === 'dihedral') {
            aljabr.group = aljabr.buildDihedralGroup(order)
        }
        else if (groupType === 'alternating') {
            aljabr.group = aljabr.buildAlternatingGroup(order)
        }
        else if (groupType === 'symmetry') {
            aljabr.group = aljabr.buildSymmetryGroup(order)
        }

        builder.cayleyTableView.attach(aljabr.group)
        builder.cayleyGraphView.attach(aljabr.group)

        return
    }
}

aljabr.builder.settingsView = null


aljabr.builder.CayleyTableView = class {
    model = undefined
    width = 0
    height = 0
    activeNode = null
    activeNodes = null
    elements = null
    entries = null

    constructor(id) {
        'use strict'
        let view

        view = this
        view.id = id
        view.el = d3.select('#' + view.id)
        view.width = 1000
        view.height = 400

        view.render()
    }

    render() {
        'use strict'
        let view, svg, boxSize, order, i, j, colorStep, colLabels, rowLabels, boxLabels, boxes, selectors, sLabels

        view = this
        view.el.html('')
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height)
        boxSize = 25

        if (view.model === undefined) {
            return
        }
        order = view.model.order
        colorStep = Math.floor(100/(order-1) + 156)


        // Grid boxes
        colLabels = svg.selectAll('.col-label')
            .data(view.elements)
        colLabels.enter()
            .append('text')
            .classed('col-label', true)
            .attr('x', function(c, i) {
                return (i+2.5)*boxSize
            })
            .attr('y', 1.7*boxSize)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(c) {
                return view.model.elements[c]
            })
        colLabels.exit().remove()

        rowLabels = svg.selectAll('.row-label')
            .data(view.elements)
        rowLabels.enter()
            .append('text')
            .classed('row-label', true)
            .attr('x', 1.5*boxSize)
            .attr('y', function(r, i) {
                return (i+2.7)*boxSize
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(r) {
                return view.model.elements[r]
            })
        rowLabels.exit().remove()

        boxes = svg.selectAll('.box')
            .data(view.entries)
        boxes.enter()
            .append('rect')
            .attr('class', function(b) {
                if (b.open) {
                    return 'box active'
                }
                return 'box'
            })
            .attr('x', function(b) {
                return (b.col+2)*boxSize
            })
            .attr('y', function(b) {
                return (b.row+2)*boxSize
            })
            .attr('width', boxSize)
            .attr('height', boxSize)
            .style('stroke', 'black')
            .on('click', function(b) {
                let tempNode
                if (b.open) {
                    view.model.setElement(b.row, b.col, view.activeNode)
                    if (view.model.isComplete()) {
                        aljabr.group = view.model.buildGroup()
                        aljabr.builder.cayleyGraphView.attach(aljabr.group)
                        view.attach(aljabr.group)
                    }
                    else {
                        tempNode = view.activeNode
                        view.activeNode = null
                        view.activeNodes[tempNode] = false
                        view.toggleNodes(tempNode)
                    }
                }
            })
        boxes.exit().remove()

        boxLabels = svg.selectAll('.box-label')
            .data(view.entries)
        boxLabels.enter()
            .append('text')
            .classed('box-label', true)
            .attr('x', function(b) {
                return (b.col+2.5)*boxSize
            })
            .attr('y', function(b) {
                return (b.row+2.7)*boxSize
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(b) {
                // console.log(b)
                // console.log(view.model.elements)
                if (b.el !== null) {
                    // console.log(view.model.elements[b.el])
                    // return view.model.elements.elements[b.el]
                    return view.model.elements.elements ? view.model.elements.elements[b.el] : view.model.elements[b.el]
                }
                return b.el
            })
        boxLabels.exit().remove()

        // Node selectors
        selectors = svg.selectAll('.node-sel')
            .data(view.activeNodes)
        selectors.enter()
            .append('rect')
            .classed('node-sel', true)
            .attr('x', view.width-50)
            .attr('y', function(s, i) {
                return i*20 + 50
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(n) {
                if (n) {
                    return 'rgb(240,240,100)'
                }
                return 'cyan'
            })
            .on('click', function(s, i) {
                view.toggleNodes(i)
            })
        selectors.exit().remove()

        sLabels = svg.selectAll('.sLabel')
            .data(view.activeNodes)
        sLabels.enter()
            .append('text')
            .classed('sLabel', true)
            .attr('x', view.width-40)
            .attr('y', function(s, i) {
                return i*20 + 65
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(s, i) {
                // return view.model.elements[i]
                return view.model.elements.elements ? view.model.elements.elements[i] : view.model.elements[i]
            })
        sLabels.exit().remove()

        return view
    }

    /**
     * Turn nodes on or off.  No more than one node may be active
     * at the same time.
     * @param {number} index - index of element to toggle
     */
    toggleNodes(index) {
        'use strict'
        let view, order, i, j, openEntries

        view = this
        order = view.model.order

        for (i=0; i<order; i++) {
            if (i === index) {
                view.activeNodes[i] = !view.activeNodes[i]
            }
            else {
                view.activeNodes[i] = false
            }
        }

        if (view.activeNodes[index]) {
            view.activeNode = index
            openEntries = view.model.openPositions(index)
            view.entries = []
            for (i=0; i<order; i++) {
                for (j=0; j<order; j++) {
                    view.entries.push({row: i,
                                       col: j,
                                       el: view.model.getElementIdx(i,j),
                                       open: openEntries[i][j]})
                }
            }
        }
        else {
            view.activeNode = null
            for (i=0; i<order; i++) {
                for (j=0; j<order; j++) {
                    view.entries.push({row: i,
                                       col: j,
                                       el: view.model.getElementIdx(i,j),
                                       open: false})
                }
            }
        }

        view.render()
    }

    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach(model) {
        'use strict'
        let view, order, i, j

        view = this
        view.model = model
        order = view.model.order
        view.activeNodes = []
        for (i=0; i<order; i++) {
            view.activeNodes.push(false)
        }

        view.elements = []
        view.entries = []
        for (i=0; i<order; i++) {
            view.elements.push(view.model.getElementIdx(i,0));
            for (j=0; j<order; j++) {
                view.entries.push({
                    row: i,
                    col: j,
                    el: view.model.getElementIdx(i,j),
                    open: false
                });
            }
        }

        view.render()
    }
}

aljabr.builder.cayleyTableView = null


/**
 * Visualization of information for a selected Element.
 */
aljabr.builder.ElementView = class {
    width = 0
    height = 0

    /**
     * Construct the ElementView.
     */
    constructor(id) {
        'use strict';
        let view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 300;
        view.height = 100;

        view.render();
    }

    /**
     * Render the ElementView.
     * @returns the ElementView
     */
    render() {
        'use strict';
        let view = this;
        let svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);

        return view;
    }

    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach(model) {
        'use strict';
        let view = this
        view.model = model;
    }
}

aljabr.builder.elementView = null;


/**
 * CayleyGraphView is a Cayley graph visualization tool.
 */
aljabr.builder.CayleyGraphView = class {
    width = 0;
    height = 0;
    duration = 400;
    points = [];
    pointPairs = [];
    activeEdges = [];
    activeEdge = 1;
    layout = 'circle';

    /**
     * Construct the CayleyGraphView.
     * @param {string} id - element id for this component
     */
    constructor(id) {
        'use strict'
        let view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 1000;
        view.height = 400;
        view.baseRadius = 150;
        view.baseX = 200;
        view.baseY = 200;

        view.render();
    }

    /**
     * Render the CayleyGraphView.
     * @returns the CayleyGraphView
     */
    render() {
        'use strict'
        let view = this;
        view.el.html('');

        let svg = view.el.append('svg')
            .attr('id', 'graph-svg')
            .attr('width', view.width)
            .attr('height', view.height);

        if (view.model === undefined) {
            return;
        }

        // Edge selectors
        let selectors = svg.selectAll('.edge-sel')
            .data(view.activeEdges);
        selectors.enter()
            .append('rect')
            .attr('id', function(d, i) {
                return 'edge-sel-' + i;
            })
            .classed('edge-sel', true)
            .attr('x', view.width-50)
            .attr('y', function(s, i) {
                return i*20 + 50;
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(s) {
                if (s) {
                    return 'yellow';
                }
                return 'cyan';
            })
            .on('click', function(s, i) {
                view.toggleEdges(i);
            });
        selectors.exit().remove();

        let sLabels = svg.selectAll('.sLabel')
            .data(view.activeEdges);
        sLabels.enter()
            .append('text')
            .classed('sLabel', true)
            .attr('x', view.width-40)
            .attr('y', function(s, i) {
                return i*20 + 65;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(s, i) {
                return view.model.elements.elements ? view.model.elements.elements[i] : view.model.elements[i];
            });
        sLabels.exit().remove()

        // Layout selectors
        svg.selectAll('.layout-sel')
            .remove();
        svg.selectAll('.lLabel')
            .remove();
        svg.append('rect')
            .attr('id', 'layout-sel-circle')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 50)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'circle') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutCircle();
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 65)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('C');

        svg.append('rect')
            .attr('id', 'layout-sel-nested')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 70)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'nested') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutNested(view.activeEdge, Math.PI/5.0);
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 85)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('N');

        svg.append('rect')
            .attr('id', 'layout-sel-separate')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 90)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'separate') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutSeparate(view.activeEdge)
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 105)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('S');

        return view;
    }

    /**
     * Render the nodes, edges, and node labels.
     */
    renderGraph() {
        'use strict';
        let i, j, index, element, selectors, sLabels;

        console.log('renderGraph()');

        let view = this;
        let svg = d3.select('#graph-svg');
        const order = view.model.order;
        const colorStep = Math.floor(156/(order-1));
        const radius = 15;
        let points = view.points;
        let pointPairs = view.pointPairs;

        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                index = (i*order)+j
                element = view.model.getElementIdx(i,j)
                if (element !== null &&
                    pointPairs[index][1] === null) {
                    pointPairs[index][1] = element
                }
                pointPairs[index][2] = view.activeEdges[i]
            }
        }

        // Edges
        let edges = svg.selectAll('line')
            .data(pointPairs);
        edges.enter()
            .append('line')
            .attr('x1', function(i) {
                return view.points[i[0]][0];
            })
            .attr('y1', function(i) {
                return view.points[i[0]][1];
            })
            .attr('x2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][0];
                }
                return view.points[i[1]][0];
            })
            .attr('y2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][1];
                }
                return view.points[i[1]][1];
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .style('visibility', function(i) {
                if (i[2]) {
                    return 'visible';
                }
                return 'hidden';
            });
        edges.transition()
            .duration(view.duration)
            .attr('x1', function(i) {
                return view.points[i[0]][0];
            })
            .attr('y1', function(i) {
                return view.points[i[0]][1];
            })
            .attr('x2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][0];
                }
                return view.points[i[1]][0];
            })
            .attr('y2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][1];
                }
                return view.points[i[1]][1];
            })
            .style('visibility', function(i) {
                if (i[2]) {
                    return 'visible';
                }
                return 'hidden';
            });
            // .attr('stroke', 'black')
            // .attr('stroke-width', '1')
        edges.exit().remove();

        // Nodes
        let nodes = svg.selectAll('circle')
            .data(points);
        nodes.enter()
            .append('circle')
            .attr('cx', function(p) {
                return p[0];
            })
            .attr('cy', function(p) {
                return p[1];
            })
            .attr('r', radius)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(p, i) {
                return 'rgb(' + ((i*colorStep)+100) + ',' + ((i*colorStep)+100) + ',0)';
            });
        nodes.transition()
            .duration(view.duration)
            .attr('cx', function(p) {
                return p[0];
            })
            .attr('cy', function(p) {
                return p[1];
            });
            // .attr('r', radius)
            // .attr('stroke', 'black')
            // .attr('stroke-width', '1')
            // .attr('fill', function(p, i) {
            //     return 'rgb(' + ((i*colorStep)+100) + ',' + ((i*colorStep)+100) + ',0)'
            // })
        nodes.exit().remove();

        // Node labels
        let labels = svg.selectAll('.nLabel')
            .data(points);
        labels.enter()
            .append('text')
            .classed('nLabel', true)
            .attr('x', function(p) {
                return p[0];
            })
            .attr('y', function(p) {
                return p[1] + 5;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(p, i) {
                return view.model.elements.elements ? view.model.elements.elements[i] : view.model.elements[i];
            });
        labels.transition()
            .duration(view.duration)
            // .classed('nLabel', true)
            .attr('x', function(p) {
                return p[0];
            })
            .attr('y', function(p) {
                return p[1] + 5;
            })
            // .attr('fill', 'black')
            // .attr('text-anchor', 'middle')
            // .attr('font-size', '16')
            // .attr('pointer-events', 'none')
            // .text(function(p, i) {
            //     return view.model.elements[i]
            // })
        labels.exit().remove();
    }

    /**
     * Place nodes in one circle.
     */
    layoutCircle() {
        'use strict'
        let view, order, radius, angle, i

        console.log('layoutCircle()')

        view = this
        order = view.model.order
        radius = view.baseRadius
        angle = 2.0*Math.PI/order

        for (i=0; i<order; i++) {
            view.points[i] = [Math.sin(angle*i)*radius + view.baseX,
                              -Math.cos(angle*i)*radius + view.baseY]
        }

        view.layout = 'circle'
        d3.selectAll('.layout-sel')
            .attr('fill', 'magenta')
        d3.select('#layout-sel-circle')
            .attr('fill', 'yellow')
        view.renderGraph()
    }

    /**
     * Place nodes in concentric circles.
     * @param {number} index - index of element to toggle
     * @param {number} twist - angle to rotate interior circles clockwise (default 0)
     */
    layoutNested(index, twist) {
        'use strict'
        let view, cosets, elIndex, elOrder, radiusDiff, radius, angle, i, j

        console.log('layoutNested()')

        view = this
        cosets = view.model.cosets([index])
        elIndex = cosets.length
        radiusDiff = view.baseRadius/elIndex
        elOrder = cosets[0].length
        angle = 2.0*Math.PI/elOrder

        if (twist === undefined) {
            twist = 0
        }

        for (i=0; i<elIndex; i++) {
            radius = view.baseRadius - i*radiusDiff
            for (j=0; j<elOrder; j++) {
                view.points[cosets[i][j]] = [Math.sin(angle*j + twist*i)*radius + view.baseX,
                                             -Math.cos(angle*j + twist*i)*radius + view.baseY]
            }
        }

        view.layout = 'nested'
        d3.selectAll('.layout-sel')
            .attr('fill', 'magenta')
        d3.select('#layout-sel-nested')
            .attr('fill', 'yellow')
        view.renderGraph()
    }

    /**
     * Place nodes in adjacent circles.
     * @param {number} index - index of element to toggle
     */
    layoutSeparate(index) {
        'use strict'
        let view, cosets, elIndex, elOrder, radius, angle, i, j

        console.log('layoutSeparate()')

        view = this
        cosets = view.model.cosets([index])
        elIndex = cosets.length
        elOrder = cosets[0].length
        radius = view.baseRadius/elIndex
        angle = 2.0*Math.PI/elOrder

        for (i=0; i<elIndex; i++) {
            for (j=0; j<elOrder; j++) {
                view.points[cosets[i][j]] = [Math.sin(angle*j)*radius + view.baseX + (i*radius*3),
                                             -Math.cos(angle*j)*radius + view.baseY]
            }
        }

        view.layout = 'separate'
        d3.selectAll('.layout-sel')
            .attr('fill', 'magenta')
        d3.select('#layout-sel-separate')
            .attr('fill', 'yellow')
        view.renderGraph()
    }

    /**
     * Turn sets of edges on or off.
     * @param {number} index - index of element to toggle
     */
    toggleEdges(index) {
        'use strict'
        let view, i

        view = this

        if (view.activeEdges[index]) {
            view.activeEdge = 1
            for (i=2; i<view.model.order; i++) {
                if (i !== index && view.activeEdges[i]) {
                    view.activeEdge = i
                    break
                }
            }
            d3.select('#edge-sel-' + index)
                .attr('fill', 'cyan')
        }
        else {
            view.activeEdge = index
            d3.select('#edge-sel-' + index)
                .attr('fill', 'yellow')
        }
        view.activeEdges[index] = !view.activeEdges[index]

        view.renderGraph()
    }

    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach(model) {
        'use strict'
        let i, j, element;

        let view = this;
        view.model = model;
        let order = view.model.order;

        view.activeEdges = [];
        for (i=0; i<order; i++) {
            view.activeEdges[i] = false;
        }

        view.points = [];
        view.pointPairs = [];
        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                element = view.model.getElementIdx(i,j);
                if (element !== null) {
                    view.pointPairs.push([j, element, view.activeEdges[i]]);
                }
            }
        }

        view.render();
        view.layoutCircle();
    }
}

aljabr.builder.cayleyGraphView = null;


/**
 * CycleGraphView is a cycle graph visualization tool.
 */
aljabr.builder.CycleGraphView = class {
    width = 0;
    height = 0;
    duration = 400;
    points = [];
    pointPairs = [];
    activeEdges = [];
    activeEdge = 1;
    layout = 'circle';

    /**
     * Construct the CycleGraphView.
     * @param {string} id - element id for this component
     */
    constructor(id) {
        'use strict'
        let view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 1000;
        view.height = 400;
        view.baseRadius = 150;
        view.baseX = 200;
        view.baseY = 200;

        view.render();
    }

    /**
     * Render the CycleGraphView.
     * @returns the CycleGraphView
     */
    render() {
        'use strict'
        let view = this;
        view.el.html('');

        let svg = view.el.append('svg')
            .attr('id', 'cycle-graph-svg')
            .attr('width', view.width)
            .attr('height', view.height);

        if (view.model === undefined) {
            return;
        }

        // Edge selectors
        let selectors = svg.selectAll('.edge-sel')
            .data(view.activeEdges);
        selectors.enter()
            .append('rect')
            .attr('id', function(d, i) {
                return 'edge-sel-' + i;
            })
            .classed('edge-sel', true)
            .attr('x', view.width-50)
            .attr('y', function(s, i) {
                return i*20 + 50;
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(s) {
                if (s) {
                    return 'yellow';
                }
                return 'cyan';
            })
            .on('click', function(s, i) {
                view.toggleEdges(i);
            });
        selectors.exit().remove();

        let sLabels = svg.selectAll('.sLabel')
            .data(view.activeEdges);
        sLabels.enter()
            .append('text')
            .classed('sLabel', true)
            .attr('x', view.width-40)
            .attr('y', function(s, i) {
                return i*20 + 65;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(s, i) {
                return view.model.elements.elements ? view.model.elements.elements[i] : view.model.elements[i];
            });
        sLabels.exit().remove()

        // Layout selectors
        svg.selectAll('.layout-sel')
            .remove();
        svg.selectAll('.lLabel')
            .remove();
        svg.append('rect')
            .attr('id', 'layout-sel-circle')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 50)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'circle') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutCircle();
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 65)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('C');

        svg.append('rect')
            .attr('id', 'layout-sel-nested')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 70)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'nested') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutNested(view.activeEdge, Math.PI/5.0);
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 85)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('N');

        svg.append('rect')
            .attr('id', 'layout-sel-separate')
            .classed('layout-sel', true)
            .attr('x', view.width-25)
            .attr('y', 90)
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function() {
                if (view.layout === 'separate') {
                    return 'yellow';
                }
                return 'magenta';
            })
            .on('click', function(s, i) {
                view.layoutSeparate(view.activeEdge)
            });
        svg.append('text')
            .classed('lLabel', true)
            .attr('x', view.width-15)
            .attr('y', 105)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text('S');

        return view;
    }

    /**
     * Render the nodes, edges, and node labels.
     */
    renderGraph() {
        'use strict';
        let i, j, index, element, selectors, sLabels;

        console.log('renderGraph()');

        let view = this;
        let svg = d3.select('#cycle-graph-svg');
        const order = view.model.order;
        const colorStep = Math.floor(156/(order-1));
        const radius = 15;
        let points = view.points;
        let pointPairs = view.pointPairs;

        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                index = (i*order)+j
                element = view.model.getElementIdx(i,j)
                if (element !== null &&
                    pointPairs[index][1] === null) {
                    pointPairs[index][1] = element
                }
                pointPairs[index][2] = view.activeEdges[i]
            }
        }

        // Edges
        let edges = svg.selectAll('line')
            .data(pointPairs);
        edges.enter()
            .append('line')
            .attr('x1', function(i) {
                return view.points[i[0]][0];
            })
            .attr('y1', function(i) {
                return view.points[i[0]][1];
            })
            .attr('x2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][0];
                }
                return view.points[i[1]][0];
            })
            .attr('y2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][1];
                }
                return view.points[i[1]][1];
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .style('visibility', function(i) {
                if (i[2]) {
                    return 'visible';
                }
                return 'hidden';
            });
        edges.transition()
            .duration(view.duration)
            .attr('x1', function(i) {
                return view.points[i[0]][0];
            })
            .attr('y1', function(i) {
                return view.points[i[0]][1];
            })
            .attr('x2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][0];
                }
                return view.points[i[1]][0];
            })
            .attr('y2', function(i) {
                if (i[1] === null) {
                    return view.points[i[0]][1];
                }
                return view.points[i[1]][1];
            })
            .style('visibility', function(i) {
                if (i[2]) {
                    return 'visible';
                }
                return 'hidden';
            });
        edges.exit().remove();

        // Nodes
        let nodes = svg.selectAll('circle')
            .data(points);
        nodes.enter()
            .append('circle')
            .attr('cx', function(p) {
                return p[0];
            })
            .attr('cy', function(p) {
                return p[1];
            })
            .attr('r', radius)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(p, i) {
                return 'rgb(' + ((i*colorStep)+100) + ',' + ((i*colorStep)+100) + ',0)';
            });
        nodes.transition()
            .duration(view.duration)
            .attr('cx', function(p) {
                return p[0];
            })
            .attr('cy', function(p) {
                return p[1];
            });
        nodes.exit().remove();

        // Node labels
        let labels = svg.selectAll('.nLabel')
            .data(points);
        labels.enter()
            .append('text')
            .classed('nLabel', true)
            .attr('x', function(p) {
                return p[0];
            })
            .attr('y', function(p) {
                return p[1] + 5;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(p, i) {
                return view.model.elements.elements ? view.model.elements.elements[i] : view.model.elements[i];
            });
        labels.transition()
            .duration(view.duration)
            .attr('x', function(p) {
                return p[0];
            })
            .attr('y', function(p) {
                return p[1] + 5;
            })
        labels.exit().remove();
    }

    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach(model) {
        'use strict'
        let i, j, element;

        let view = this;
        view.model = model;
        let order = view.model.order;

        view.activeEdges = [];
        for (i=0; i<order; i++) {
            view.activeEdges[i] = false;
        }

        view.points = [];
        view.pointPairs = [];
        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                element = view.model.getElementIdx(i,j);
                if (element !== null) {
                    view.pointPairs.push([j, element, view.activeEdges[i]]);
                }
            }
        }

        view.render();
        view.layoutCircle();
    }
}

aljabr.builder.cycleGraphView = null;
