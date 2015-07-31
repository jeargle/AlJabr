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
        var view, svg, boxSize, order, i, j;

        view = this;
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);
        boxSize = 25;
        order = 15;

        // Grid boxes
        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                svg.append('rect')
                    .attr('x', (i+1)*boxSize)
                    .attr('y', (j+1)*boxSize)
                    .attr('width', boxSize)
                    .attr('height', boxSize)
                    .attr('fill', 'rgb(' + i*30 + ',0,' + j*30 + ')')
                    .on('click', function() {
                        d3.select(this)
                            .style('fill', 'yellow');
                    });
                svg.append('text')
                    .attr('x', (i+1.5)*boxSize)
                    .attr('y', (j+1.7)*boxSize)
                    .attr('fill', 'black')
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '16')
                    .attr('pointer-events', 'none')
                    .text(i);
            }
        }

        // Grid lines
        for (i=1; i<=order+1; i++) {
            svg.append('line')
                .attr('x1', boxSize*i)
                .attr('y1', boxSize)
                .attr('x2', boxSize*i)
                .attr('y2', boxSize*(order+1))
                .style('stroke', 'black')
                .style('stroke-width', '1');
            svg.append('line')
                .attr('x1', boxSize)
                .attr('y1', boxSize*i)
                .attr('x2', boxSize*(order+1))
                .attr('y2', boxSize*i)
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
        var view, svg, order, baseRadius, baseX, baseY, radius, angle, i, points;

        view = this;
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);
        order = 17;
        baseRadius = 100;
        baseX = 150;
        baseY = 150;
        radius = 10;
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
                .attr('fill', 'rgb(' + i*20 + ',' + i*20 + ',0)');
        }

        return view;
    }
});

aljabr.builder.cayleyGraphView = null;



$(document).ready(function() {
    'use strict';
    var builder;

    builder = aljabr.builder;

    builder.cayleyTableView = new builder.CayleyTableView('cayley-table');
    builder.elementView = new builder.ElementView('element-inspector');
    builder.cayleyGraphView = new builder.CayleyGraphView('cayley-graph');
});
