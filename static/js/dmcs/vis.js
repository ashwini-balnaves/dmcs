/* Colour palette generated by http://tools.medialab.sciences-po.fr/iwanthue/ */
_COLOURS = [
    "#C352A2",
    "#539243",
    "#D05434",
    "#617DB0",
    "#A07A28",
    "#C04C6A",
    "#A262D6"
];
_COLOUR_EXTRA = "#CCCCCC";


/* Visualisation tools and functions */
var vis = {

    ANALYSED_COLOUR: '#FFFB00',

    /**
     * Draw a legend for project facets.
     */
    legend: function (svgEl, project, x, y) {
        var legend = d3.select(svgEl).append('g');
        legend.selectAll('rect')
            .data(d3.values(project.facets))
            .enter()
            .append('rect')
                .attr("x", x)
                .attr("y", function(d, i) { return y + i * 30;})
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", function(d) { 
                    return d.colour;
                });
        legend.selectAll('text')
            .data(d3.values(project.facets))
            .enter()
            .append("text")
                .attr("x", x + 30)
                .attr("y", function(d, i) { return y + 14 + i * 30; })
                .style('font-size', '12px')
                .text(function(d) {
                    return d.name;
                });
    },

    /**
     * An svg slider based on the brush component.
     * Adapted from http://bl.ocks.org/mbostock/6452972
     */
    slider: function (svgEl, domain, dims, value, cb) {

        var x = d3.scale.linear()
            .domain(domain)
            .range([0, dims.width])
            .clamp(true);

        var brush = d3.svg.brush()
            .x(x)
            .extent([0, 0])
            .on("brush", onChange);

        var svg = d3.select(svgEl).append("g")
            .attr("transform", "translate(" + dims.x + "," + dims.y + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + dims.height / 2 + ")")
            .call(d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(function(d) { return d + "%"; })
                .tickSize(0)
                .tickPadding(12))
          .select(".domain")
          .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
                .attr("class", "halo");

        var slider = svg.append("g")
            .attr("class", "slider")
            .call(brush);

        slider.selectAll(".extent,.resize")
            .remove();

        slider.select(".background")
            .attr("height", dims.height);

        var handle = slider.append("circle")
            .attr("class", "handle")
            .attr("transform", "translate(0," + dims.height / 2 + ")")
            .attr("r", 9);

        // Initialise value
        slider
            .call(brush.extent([value, value]))
            .call(brush.event);

        // Change handler
        var queueValue = null;
        function onChange() {
            var value = brush.extent()[0];
            if (d3.event.sourceEvent) { // not a programmatic event
                queueValue = value = x.invert(d3.mouse(this)[0]);
                brush.extent([value, value]);
            }
            handle.attr("cx", x(value));
        }
        // We only want to execute callback on mouseup (not while dragging)
        $(window).on('mouseup', function (a) {
            if (queueValue !== null) {
                cb(queueValue);
                queueValue = null;
            }
        });
    }
};