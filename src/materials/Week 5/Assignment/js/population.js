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

    d3.json('population.json', function(df) {
        df = df.filter(d=>d.pop!==null)
        var parseTime = d3.timeParse('%Y');

     
        df.forEach((d,i)=>{
            d.year = parseTime(d.year.substr(8,11));
            d.pop = +d.pop/1000000;
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
                0,
                d3.max(df, d=>d.pop) 
            ])
            .range([innerHeight, 0]);
        
        var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(3));

        var yAxis = d3.axisLeft(y).ticks(10);
        
        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis) 
        
        g
            .append('g')
            .attr('class', 'x-axistwo')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);
        
        var line = d3
            .line()
            .x(d=>x(d.year))
            .y(d=>y(d.pop));

        var countries = ['China', 'India'];
        var colors = ['red', 'green'];
        
        var colorScale = d3
            .scaleOrdinal()
            .domain(countries)
            .range(colors);
        
        var groups = g
            .selectAll('.country')
            .data(countries)
            .enter()
            .append('g')
            .attr('class', 'country');
        
        //lines
        groups
            .append('path')
            .datum(d=>df.filter(r=>r.country===d))
            .attr('class', 'country-line')
            .attr('fill', 'none')
            .attr('stroke', d=>colorScale(d[0].country))
            .attr('stroke-width', 1.5)
            .attr('d', line);
        //circles
        groups
            .selectAll('.country-point')
            .data(d=>df.filter(r=>r.country===d))
            .enter()
            .append('circle')
            .attr('class', 'country-point')
            .attr('fill', d=>colorScale(d.country))
            .attr('stroke', 'none')
            .attr('cx', d=>x(d.year))
            .attr('cy', d=>y(d.pop))
            .attr('r', 3);  
        
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .style('font-size', 16)
            .text('Year');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', innerHeight / 2)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 16)
            .text('Population (Millions)');

        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Population Over Time');
        
        // legend
       var leg =  [    
                {x:50, col:colors[0], txt:countries[0]},
                {x:125, col:colors[1], txt:countries[1]}
       ]
        g
            .selectAll('.legbar')           
            .data(leg)
            .enter()
            .append('rect')
            .attr('class', 'legbar')
            .attr('x', d=>d.x)
            .attr('y', innerHeight+40)
            .attr('width', 10)
            .attr('height',10)
            .attr('fill', '#e6194b')
            .attr('fill', d=>d.col)
        g
            .selectAll('.legtext')           
            .data(leg)
            .enter()
            .append('text')
            .attr('class', 'legtext')
            .attr('x', d=>d.x+12)
            .attr('y', innerHeight+50)
            .text(d=>d.txt)
    });
}

buildChart('#chart-holder');
