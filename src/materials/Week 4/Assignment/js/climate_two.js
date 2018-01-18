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
            .domain([d3.extent(df, d=>d.temp)])
            .range([0, innerWidth]);
        
        
        var y = d3
            .scaleLinear()
            .domain([d3.extent(df, d=>d.year)])
            .range([innerHeight, 0])
            
        
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
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);
        
        g
            .selectAll('.bar')
            .data(df)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d=> x(Math.min(0,d.temp)))
            .attr('y', d=>d.year)
            .attr('height', '5px')
            .attr('width', d=>Math.abs(x(d.year) - x(0)))
            
        
    })
}

buildChart('#chart-holder');
