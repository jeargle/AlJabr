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
        boxSize = 50;
        order = 5;

        for (i=0; i<order; i++) {
            for (j=0; j<order; j++) {
                svg.append('rect')
                    .attr('x', (i+1)*boxSize)
                    .attr('y', (j+1)*boxSize)
                    .attr('width', boxSize)
                    .attr('height', boxSize)
                    .style('fill', 'rgb(' + i*50 + ',' + j*50 + ',0)');
            }
        }

        for (i=1; i<=order+1; i++) {
            svg.append('line')
                .attr('x1', boxSize*i)
                .attr('y1', boxSize)
                .attr('x2', boxSize*i)
                .attr('y2', boxSize*(order+1))
                .style('stroke', 'black')
                .style('stroke-width', '2');
            svg.append('line')
                .attr('x1', boxSize)
                .attr('y1', boxSize*i)
                .attr('x2', boxSize*(order+1))
                .attr('y2', boxSize*i)
                .style('stroke', 'black')
                .style('stroke-width', '2');
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
        view.width = 500;
        view.height = 300;

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
        var view, svg;

        view = this;
        svg = view.el.append('svg')
            .attr('width', view.width)
            .attr('height', view.height);

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
