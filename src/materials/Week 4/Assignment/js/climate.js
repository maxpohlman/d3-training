function buildChart(containerId) {
    // size globals
    var width = 960;
    var height = 600;

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
    d3.json('climate.json', function(df){
        
        df.forEach(function(d){
            d.year = +d.year
            d.temp = +d.temp
        });
        
        //SCALE
        var x = d3
            .scaleLinear()
            .domain([
                d3.min(df, d=>d.temp),
                d3.max(df, d=>d.temp)

            ])
            .range([0, innerWidth]);
        
        
        var y = d3
            .scaleLinear()
            .domain([
                d3.min(df, d=>d.year),
                d3.max(df, d=>d.year)

            ])      
            .range([innerHeight, 0])
            
        
       var colors = d3.scaleQuantile()
            .domain([
                d3.min(df, d=>d.year),
                d3.max(df, d=>d.year)

            ])   
            .range(["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", 
            "#911eb4", "#46f0f0", "#d2f53c", "#fabebe", "#aa6e28", "#fffac8",
                   "#800000","#aaffc3","#000080"]);

        g
            .selectAll('.bar')
            .data(df)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d=>x(Math.min(0, d.temp)))
            .attr('y', d=>y(d.year))
            .attr('width', d => Math.abs(x(d.temp) - x(0)))
            .attr('height', '2px')
            .attr('fill', d=>colors(d.year));
        
        
                // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(10).tickFormat(d3.format("d"));

        g
            .append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate('+x(0)+',0)')
            .call(yAxis);
        
        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('Temperature');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Year');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Yearly Average Temperature');
        
    })
}

buildChart('#chart-holder');
