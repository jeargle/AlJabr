/* JSLint */
/*global console: false, aljabr: false, extend: false, $: false, _: false, d3: false*/


extend(aljabr, 'builder');


aljabr.builder.CayleyTableView = aljabr.Class({
    model: undefined,
    width: 0,
    height: 0,
    init: function(id) {
        'use strict';
        var view;

        view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 500;
        view.height = 400;

        view.render();
    },
    render: function() {
        'use strict';
        var view, svg, boxSize, order, i, j, colorStep;

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
        

        return view;
    },
    attach: function(model) {
        'use strict';
        var view;

        view = this;
        view.model = model;
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
    init: function(id) {
        'use strict';
        var view;

        view = this;
        view.id = id;
        view.el = d3.select('#' + view.id);
        view.width = 500;
        view.height = 300;

        view.render();
    },
    render: function() {
        'use strict';
        var view, svg, order, colorStep, baseRadius, baseX, baseY, radius, angle, i, points;

        view = this;
        view.el.html('');
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);

        if (view.model === undefined) {
            return;
        }
        order = view.model.order;
        colorStep = Math.floor(256/(order-1));

        baseRadius = 100;
        baseX = 150;
        baseY = 150;
        radius = 15;
        angle = 2.0*Math.PI/order;

        points = [];
        for (i=0; i<order; i++) {
            points[i] = [Math.sin(angle*i)*baseRadius + baseX,
                         -Math.cos(angle*i)*baseRadius + baseY];
        }

        // Edges
        for (i=0; i<order; i++) {
            svg.append('line')
                .attr('x1', points[i][0])
                .attr('y1', points[i][1])
                .attr('x2', points[(i+1)%order][0])
                .attr('y2', points[(i+1)%order][1])
                .attr('stroke', 'black')
                .attr('stroke-width', '1');
        }

        // Nodes
        for (i=0; i<order; i++) {
            svg.append('circle')
                .attr('cx', points[i][0])
                .attr('cy', points[i][1])
                .attr('r', radius)
                .attr('stroke', 'black')
                .attr('stroke-width', '1')
                // .attr('fill', 'red');
                .attr('fill', 'rgb(' + i*colorStep + ',' + i*colorStep + ',0)');
            svg.append('text')
                .attr('x', points[i][0])
                .attr('y', points[i][1] + 5)
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('font-size', '16')
                .attr('pointer-events', 'none')
                .text(i);
        }

        return view;
    },
    attach: function(model) {
        'use strict';
        var view;

        view = this;
        view.model = model;
        view.render();
    }
});

aljabr.builder.cayleyGraphView = null;



$(document).ready(function() {
    'use strict';
    var builder, z3;

    builder = aljabr.builder;

    builder.cayleyTableView = new builder.CayleyTableView('cayley-table');
    builder.elementView = new builder.ElementView('element-inspector');
    builder.cayleyGraphView = new builder.CayleyGraphView('cayley-graph');

    z3 = aljabr.buildDihedralGroup(7);
    builder.cayleyTableView.attach(z3);
    builder.cayleyGraphView.attach(z3);
});
