function buildChart(containerId) {
    // size globals
    var width = 960;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    // create svg element
    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // append all of your chart elements to g
    
    d3.json('climate.json', function(df) {
        var parseTime = d3.timeParse('%Y');

        df.forEach(d => {
            d.temp = +d.temp;
            d.year = parseTime((+d.year).toString());
        });
        
        
        var x = d3
            .scaleTime()
            .domain([
                d3.timeYear.offset(d3.min(df,d=>d.year),-2),
                d3.max(df,d=>d.year)
            ])
            .range([0, innerWidth]);

        var y = d3
            .scaleLinear()
            .domain([
                d3.min(df, d=>d.temp),
                d3.max(df, d=>d.temp) + .2
            ])
            .range([innerHeight, 0]);
 
        // axes
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(10));

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis)  
        
        var line = d3
            .line()
            .x(d=>x(d.year))
            .y(d=>y(d.temp));
        g
            .append('path')
            .datum(df)
            .attr('class', 'win-line')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 1.5)
            .attr('d', line);  
        g
            .selectAll('.win-point')
            .data(df)
            .enter()
            .append('circle')
            .attr('class', 'win-point')
            .attr('fill', 'blue')
            .attr('stroke', 'none')
            .attr('cx', d=>x(d.year))
            .attr('cy', d=>y(d.temp))
            .attr('r', 3);
        
        
        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + y(0) + ')')
            .style('stroke-width', '3px')
            .call(xAxis);
        
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-size', 18)
            .text('Year');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 18)
            .text('Temperature');

        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Yearly Global Temperatures Over Time');

    });
           
    
}

buildChart('#chart-holder');
