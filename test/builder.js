/* JSLint */
/*global console: false, aljabr: false, extend: false, $: false, _: false, d3: false*/


extend(aljabr, 'builder');


aljabr.builder.CayleyTableView = aljabr.Class({
    model: undefined,
    width: 0,
    height: 0,
    activeNode: null,
    activeNodes: null,
    elements: null,
    entries: null,
    init: function(id) {
        'use strict';
        var view;

        view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 1000;
        view.height = 400;

        view.render();
    },
    render: function() {
        'use strict';
        var view, svg, boxSize, order, i, j, colorStep, colLabels, rowLabels, boxLabels, boxes, selectors, sLabels;

        view = this;
        view.el.html('');
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);
        boxSize = 25;

        if (view.model === undefined) {
            return;
        }
        order = view.model.order;
        colorStep = Math.floor(100/(order-1) + 156);


        // Grid boxes
        colLabels = svg.selectAll('.col-label')
            .data(view.elements);
        colLabels.enter()
            .append('text')
            .classed('col-label', true)
            .attr('x', function(c, i) {
                return (i+2.5)*boxSize;
            })
            .attr('y', 1.7*boxSize)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(c) {
                return view.model.elements[c];
            });
        colLabels.exit().remove();

        rowLabels = svg.selectAll('.row-label')
            .data(view.elements);
        rowLabels.enter()
            .append('text')
            .classed('row-label', true)
            .attr('x', 1.5*boxSize)
            .attr('y', function(r, i) {
                return (i+2.7)*boxSize;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(r) {
                return view.model.elements[r];
            });
        rowLabels.exit().remove();

        boxes = svg.selectAll('.box')
            .data(view.entries);
        boxes.enter()
            .append('rect')
            .attr('class', function(b) {
                if (b.open) {
                    return 'box active';
                }
                return 'box';
            })
            .attr('x', function(b) {
                return (b.col+2)*boxSize;
            })
            .attr('y', function(b) {
                return (b.row+2)*boxSize;
            })
            .attr('width', boxSize)
            .attr('height', boxSize)
            .style('stroke', 'black')
            .on('click', function(b) {
                var tempNode;
                if (b.open) {
                    view.model.setElement(b.row, b.col, view.activeNode);
                    if (view.model.isComplete()) {
                        aljabr.group = view.model.buildGroup();
                        aljabr.builder.cayleyGraphView.attach(aljabr.group);
                        view.attach(aljabr.group);
                    }
                    else {
                        tempNode = view.activeNode;
                        view.activeNode = null;
                        view.activeNodes[tempNode] = false;
                        view.toggleNodes(tempNode);
                    }
                }
            });
        boxes.exit().remove();
        
        boxLabels = svg.selectAll('.box-label')
            .data(view.entries);
        boxLabels.enter()
            .append('text')
            .classed('box-label', true)
            .attr('x', function(b) {
                return (b.col+2.5)*boxSize;
            })
            .attr('y', function(b) {
                return (b.row+2.7)*boxSize;
            })
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')
            .text(function(b) {
                if (b.el !== null) {
                    return view.model.elements[b.el];
                }
                return b.el;
            });
        boxLabels.exit().remove();
        
        // Grid lines
        // for (i=1; i<=order+1; i++) {
        //     svg.append('line')
        //         .attr('x1', boxSize*(i+1))
        //         .attr('y1', boxSize)
        //         .attr('x2', boxSize*(i+1))
        //         .attr('y2', boxSize*(order+2))
        //         .style('stroke', 'black')
        //         .style('stroke-width', '1');
        //     svg.append('line')
        //         .attr('x1', boxSize)
        //         .attr('y1', boxSize*(i+1))
        //         .attr('x2', boxSize*(order+2))
        //         .attr('y2', boxSize*(i+1))
        //         .style('stroke', 'black')
        //         .style('stroke-width', '1');
        // }
        
        // Node selectors
        selectors = svg.selectAll('.node-sel')
            .data(view.activeNodes);
        selectors.enter()
            .append('rect')
            .classed('node-sel', true)
            .attr('x', view.width-50)
            .attr('y', function(s, i) {
                return i*20 + 50;
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
            .attr('fill', function(n) {
                if (n) {
                    return 'rgb(240,240,100)';
                }
                return 'cyan';
            })
            .on('click', function(s, i) {
                view.toggleNodes(i);
            });
        selectors.exit().remove();

        sLabels = svg.selectAll('.sLabel')
            .data(view.activeNodes);
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
                return view.model.elements[i];
            });
        sLabels.exit().remove();

        return view;
    },
    /**
     * Turn nodes on or off.  No more than one node may be active
     * at the same time.
     * @param {number} index - index of element to toggle
     */
    toggleNodes: function(index) {
        'use strict';
        var view, order, i, j, openEntries;

        view = this;
        order = view.model.order;

        for (i=0; i<order; i++) {
            if (i === index) {
                view.activeNodes[i] = !view.activeNodes[i];
            }
            else {
                view.activeNodes[i] = false;
            }
        }

        if (view.activeNodes[index]) {
            view.activeNode = index;
            openEntries = view.model.openPositions(index);
            view.entries = [];
            for (i=0; i<order; i++) {
                for (j=0; j<order; j++) {
                    view.entries.push({row: i,
                                       col: j,
                                       el: view.model.getElement(i,j),
                                       open: openEntries[i][j]});
                }
            }
        }
        else {
            view.activeNode = null;
            for (i=0; i<order; i++) {
                for (j=0; j<order; j++) {
                    view.entries.push({row: i,
                                       col: j,
                                       el: view.model.getElement(i,j),
                                       open: false});
                }
            }
        }

        view.render();
    },
    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach: function(model) {
        'use strict';
        var view, order, i, j;

        view = this;
        view.model = model;
        order = view.model.order;
        view.activeNodes = [];
        for (i=0; i<order; i++) {
            view.activeNodes.push(false);
        }
        
        view.elements = [];
        view.entries = [];
        for (i=0; i<order; i++) {
            view.elements.push(view.model.getElement(i,0));
            for (j=0; j<order; j++) {
                view.entries.push({row: i,
                                   col: j,
                                   el: view.model.getElement(i,j),
                                   open: false});
            }
        }
        
        view.render();
    }
});

aljabr.builder.cayleyTableView = null;


aljabr.builder.ElementView = aljabr.Class({
    width: 0,
    height: 0,
    init: function(id) {
        'use strict';
        var view;

        view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 300;
        view.height = 100;

        view.render();
    },
    render: function() {
        'use strict';
        var view, svg;

        view = this;
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);

        return view;
    },
    attach: function(model) {
        'use strict';
        var view;

        view = this;
        view.model = model;
    }
});

aljabr.builder.elementView = null;


aljabr.builder.CayleyGraphView = aljabr.Class({
    width: 0,
    height: 0,
    points: [],
    activeEdges: [],
    activeEdge: 1,
    layout: 'circle',
    init: function(id) {
        'use strict';
        var view;

        view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 1000;
        view.height = 400;
        view.baseRadius = 150;
        view.baseX = 200;
        view.baseY = 200;

        view.render();
    },
    render: function() {
        'use strict';
        var view, svg, order, colorStep, radius, i, j, points, pointPairs, element, edges, nodes, labels, selectors, sLabels;

        view = this;
        view.el.html('');
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);

        if (view.model === undefined) {
            return;
        }
        order = view.model.order;
        colorStep = Math.floor(156/(order-1));
        radius = 15;
        points = view.points;
        
        pointPairs = [];
        for (i=0; i<order; i++) {
            if (view.activeEdges[i]) {
                for (j=0; j<order; j++) {
                    // element = view.model.getElement(j,i);
                    element = view.model.getElement(i,j);
                    if (element !== null) {
                        pointPairs.push([j, element]);
                        // pointPairs.push([i, element]);
                    }
                }
            }
        }

        // Edges
        edges = svg.selectAll('line')
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
                return view.points[i[1]][0];
            })
            .attr('y2', function(i) {
                return view.points[i[1]][1];
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
        edges.exit().remove();

        // Nodes
        nodes = svg.selectAll('circle')
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
        nodes.exit().remove();

        // Node labels
        labels = svg.selectAll('.nLabel')
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
                return view.model.elements[i];
            });
        labels.exit().remove();

        // Edge selectors
        selectors = svg.selectAll('.edge-sel')
            .data(view.activeEdges);
        selectors.enter()
            .append('rect')
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

        sLabels = svg.selectAll('.sLabel')
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
                return view.model.elements[i];
            });
        sLabels.exit().remove();

        // Layout selectors
        svg.selectAll('.layout-sel')
            .remove();
        svg.selectAll('.lLabel')
            .remove();
        svg.append('rect')
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
                view.layoutSeparate(view.activeEdge);
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
    },
    /**
     * Place nodes in one circle.
     */
    layoutCircle: function() {
        'use strict';
        var view, order, radius, angle, i;

        view = this;
        order = view.model.order;
        radius = view.baseRadius;
        angle = 2.0*Math.PI/order;

        for (i=0; i<order; i++) {
            view.points[i] = [Math.sin(angle*i)*radius + view.baseX,
                              -Math.cos(angle*i)*radius + view.baseY];
        }

        view.layout = 'circle';
        view.render();
    },
    /**
     * Place nodes in concentric circles.
     * @param {number} index - index of element to toggle
     * @param {number} twist - angle to rotate interior circles clockwise (default 0)
     */
    layoutNested: function(index, twist) {
        'use strict';
        var view, cosets, elIndex, elOrder, radius, angle, i, j;

        view = this;
        cosets = view.model.cosets(index);
        elIndex = cosets.length;
        elOrder = cosets[0].length;
        angle = 2.0*Math.PI/elOrder;

        if (twist === undefined) {
            twist = 0;
        }

        for (i=0; i<elIndex; i++) {
            radius = view.baseRadius - i*50;
            for (j=0; j<elOrder; j++) {
                view.points[cosets[i][j]] = [Math.sin(angle*j + twist*i)*radius + view.baseX,
                                             -Math.cos(angle*j + twist*i)*radius + view.baseY];
            }
        }

        view.layout = 'nested';
        view.render();
    },
    /**
     * Place nodes in adjacent circles.
     * @param {number} index - index of element to toggle
     */
    layoutSeparate: function(index) {
        'use strict';
        var view, cosets, elIndex, elOrder, radius, angle, i, j;

        view = this;
        cosets = view.model.cosets(index);
        elIndex = cosets.length;
        elOrder = cosets[0].length;
        radius = view.baseRadius/elIndex;
        angle = 2.0*Math.PI/elOrder;

        for (i=0; i<elIndex; i++) {
            for (j=0; j<elOrder; j++) {
                view.points[cosets[i][j]] = [Math.sin(angle*j)*radius + view.baseX + (i*radius*3),
                                             -Math.cos(angle*j)*radius + view.baseY];
            }
        }

        view.layout = 'separate';
        view.render();
    },
    /**
     * Turn sets of edges on or off.
     * @param {number} index - index of element to toggle
     */
    toggleEdges: function(index) {
        'use strict';
        var view, i;

        view = this;

        if (view.activeEdges[index]) {
            view.activeEdge = 1;
            for (i=2; i<view.model.order; i++) {
                if (i !== index && view.activeEdges[i]) {
                    view.activeEdge = i;
                    break;
                }
            }
        }
        else {
            view.activeEdge = index;
        }
        view.activeEdges[index] = !view.activeEdges[index];

        view.render();
    },
    /**
     * Attach view to a Group or GroupBuilder.
     * @param model - Group or GroupBuilder
     */
    attach: function(model) {
        'use strict';
        var view, order, i;

        view = this;
        view.model = model;
        order = view.model.order;

        view.activeEdges = [];
        for (i=0; i<order; i++) {
            view.activeEdges[i] = false;
        }

        view.layoutCircle();
    }
});

aljabr.builder.cayleyGraphView = null;



$(document).ready(function() {
    'use strict';
    var builder, group, elements, testSet, group;

    builder = aljabr.builder;

    builder.cayleyTableView = new builder.CayleyTableView('cayley-table');
    builder.elementView = new builder.ElementView('element-inspector');
    builder.cayleyGraphView = new builder.CayleyGraphView('cayley-graph');

    // aljabr.group = aljabr.buildCyclicGroup(12);
    // aljabr.group = aljabr.buildDihedralGroup(6);
    // aljabr.group = aljabr.buildAlternatingGroup(4);
    // aljabr.group = aljabr.buildSymmetryGroup(3);
    aljabr.elements = [];
    elements = aljabr.elements;
    elements.push('e');
    elements.push('a');
    elements.push('b');
    elements.push('c');
    elements.push('d');
    elements.push('f');
    elements.push('g');
    // elements.push('h');
    aljabr.group = new aljabr.GroupBuilder(elements);
    
    group = aljabr.group;
    // group.setElement(2, 2, 1);
    // group.setElement(3, 5, 1);
    // group.setElement(4, 3, 1);
    // group.setElement(5, 4, 1);   // should have already been set
    // group.setElement(1, 1, 2);
    // group.setElement(3, 4, 2);
    // group.setElement(4, 5, 2);
    // group.setElement(5, 3, 2);   // should have already been set
    // group.setElement(1, 2, 3);
    // group.setElement(2, 5, 3);
    // group.setElement(1, 1, 2);
    // group.setElement(1, 2, 3);
    // group.setElement(1, 3, 4);
    // group.setElement(1, 4, 5);
    // group.setElement(1, 5, 6);
    // group.setElement(1, 6, 7);
    
    builder.cayleyTableView.attach(group);
    builder.cayleyGraphView.attach(group);
    // builder.cayleyGraphView.toggleEdges(1);
    // console.log(group.elementSubgroup(1));
    // console.log(group.elementSubgroup(2));
    // console.log(group.elementSubgroup(5));
    // console.log(group.cosets(1));
    // console.log(group.cosets(2));
    // console.log(group.cosets(5));
});
