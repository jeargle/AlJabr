/* JSLint */
/*global console: false, aljabr: false, extend: false, $: false, _: false, d3: false*/


extend(aljabr, 'builder');


aljabr.builder.CayleyTableView = aljabr.Class({
    model: undefined,
    width: 0,
    height: 0,
    activeNodes: null,
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
        var view, svg, boxSize, order, i, j, colorStep, selectors, sLabels;

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
        colorStep = Math.floor(256/(order-1));

        // Grid boxes
        for (i=0; i<order; i++) {
            svg.append('text')
                .attr('x', (i+2.5)*boxSize)
                .attr('y', 1.7*boxSize)
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '16')
                .attr('pointer-events', 'none')
                .text(view.model.getElement(i,0));
            svg.append('text')
                .attr('x', 1.5*boxSize)
                .attr('y', (i+2.7)*boxSize)
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '16')
                .attr('pointer-events', 'none')
                .text(view.model.getElement(i,0));
            for (j=0; j<order; j++) {
                svg.append('rect')
                    .attr('x', (i+2)*boxSize)
                    .attr('y', (j+2)*boxSize)
                    .attr('width', boxSize)
                    .attr('height', boxSize)
                    .attr('fill', 'rgb(' + i*colorStep + ',0,' + j*colorStep + ')')
                    .on('click', function() {
                        d3.select(this)
                            .style('fill', 'yellow');
                    });
                svg.append('text')
                    .attr('x', (i+2.5)*boxSize)
                    .attr('y', (j+2.7)*boxSize)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '16')
                    .attr('pointer-events', 'none')
                    .text(view.model.getElement(i,j));
            }
        }

        // Grid lines
        for (i=1; i<=order+1; i++) {
            svg.append('line')
                .attr('x1', boxSize*(i+1))
                .attr('y1', boxSize)
                .attr('x2', boxSize*(i+1))
                .attr('y2', boxSize*(order+2))
                .style('stroke', 'black')
                .style('stroke-width', '1');
            svg.append('line')
                .attr('x1', boxSize)
                .attr('y1', boxSize*(i+1))
                .attr('x2', boxSize*(order+2))
                .attr('y2', boxSize*(i+1))
                .style('stroke', 'black')
                .style('stroke-width', '1');
        }
        
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
                    return 'yellow';
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
                return i;
            });
        sLabels.exit().remove();

        return view;
    },
    /**
     * Turn sets of nodes on or off.
     * @param {number} index - index of element to toggle
     */
    toggleNodes: function(index) {
        'use strict';
        var view, i;

        view = this;

        for (i=0; i<view.model.order; i++) {
            if (i === index) {
                view.activeNodes[i] = !view.activeNodes[i];
            }
            else {
                view.activeNodes[i] = false;
            }
        }

        view.render();
    },
    attach: function(model) {
        'use strict';
        var view, i;

        view = this;
        view.model = model;
        view.activeNodes = [];
        for (i=0; i<view.model.order; i++) {
            view.activeNodes.push(false);
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
        var view, svg, order, colorStep, radius, i, j, points, pointPairs, edges, nodes, labels, selectors, sLabels;

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
                    // pointPairs[i] = [i, (i+1)%order];
                    // pointPairs[i] = [i, (i+2)%order];
                    pointPairs.push([j, view.model.getElement(j,i)]);
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
                return i;
            });
        labels.exit().remove();

        // Edge selectors
        selectors = svg.selectAll('rect')
            .data(view.activeEdges);
        selectors.enter()
            .append('rect')
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
                return i;
            });
        sLabels.exit().remove();

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

        view.render();
    },
    /**
     * Turn sets of edges on or off.
     * @param {number} index - index of element to toggle
     */
    toggleEdges: function(index) {
        'use strict';
        var view;

        view = this;

        view.activeEdges[index] = !view.activeEdges[index];

        view.render();
    },
    /**
     * Attach view to a Group or GroupBuilder
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
    var builder, group;

    builder = aljabr.builder;

    builder.cayleyTableView = new builder.CayleyTableView('cayley-table');
    builder.elementView = new builder.ElementView('element-inspector');
    builder.cayleyGraphView = new builder.CayleyGraphView('cayley-graph');

    // aljabr.group = aljabr.buildCyclicGroup(12);
    aljabr.group = aljabr.buildDihedralGroup(6);
    // aljabr.group = aljabr.buildAlternatingGroup(4);
    // aljabr.group = aljabr.buildSymmetryGroup(3);
    group = aljabr.group;
    builder.cayleyTableView.attach(group);
    builder.cayleyGraphView.attach(group);
    builder.cayleyGraphView.toggleEdges(1);
    console.log(group.elementSubgroup(1));
    console.log(group.elementSubgroup(2));
    console.log(group.elementSubgroup(5));
    console.log(group.cosets(1));
    console.log(group.cosets(2));
    console.log(group.cosets(5));
});
