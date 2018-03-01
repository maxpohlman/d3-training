function buildChart(containerId) {
    // size globals
    var width = 1060;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 75
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

    d3.csv('air_quality.csv', function (df) {
        df.forEach(d => d.Emissions = parseFloat(d.Emissions.replace(",", "")));

        console.log(df);
        var x = d3
            .scaleBand()
            .domain(df.map(d => d.State))
            .range([0, innerWidth])
            .padding(.1);

        console.log(x.domain(), x.range());

        var y = d3
            .scaleLinear()
            .domain(d3.extent(df, d => d.Emissions))
            .range([innerHeight, 0]);

        // axes
        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        var yAxis = d3.axisLeft(y).ticks(10);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        var cols = d3.scaleOrdinal()
            .domain(df.map(d => d.Region))
            .range(["#e6194b", "#3cb44b", "#ffe119", "#0082c8"]);
        console.log(cols.domain()[1]);
        // bars
        g
            .selectAll('.bar')
            .data(df)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.State))
            .attr('y', d => y(d.Emissions))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.Emissions))
            .attr('fill', d => cols(d.Region))

        // axis labels
        g
            .append('text')
            .attr('class', 'x-axis-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 30)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'hanging')
            .text('State');

        g
            .append('text')
            .attr('class', 'y-axis-label')
            .attr('x', -30)
            .attr('y', (innerHeight / 2) - 30)
            .attr('transform', 'rotate(-90,-30,' + innerHeight / 2 + ')')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .text('Emissions');

        // title
        g
            .append('text')
            .attr('class', 'title')
            .attr('x', innerWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'baseline')
            .style('font-size', 24)
            .text('Emissions by State')
            .attr('stroke', 'none');

        // legend
        var leg = [{ x: 25, col: "#e6194b", txt: cols.domain()[0] },
        { x: 100, col: "#3cb44b", txt: cols.domain()[1] },
        { x: 175, col: "#ffe119", txt: cols.domain()[2] },
        { x: 270, col: "#0082c8", txt: cols.domain()[3] }]
        g
            .selectAll('.legbar')
            .data(leg)
            .enter()
            .append('rect')
            .attr('class', 'legbar')
            .attr('x', d => d.x)
            .attr('y', innerHeight + 40)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#e6194b')
            .attr('fill', d => d.col)
        g
            .selectAll('.legtext')
            .data(leg)
            .enter()
            .append('text')
            .attr('class', 'legtext')
            .attr('x', d => d.x + 12)
            .attr('y', innerHeight + 50)
            .text(d => d.txt);




        function sorter(df, type) {
            if (type == 'asc') {
                df.sort((a, b) => {
                    return (a.Emissions > b.Emissions) ? 1 : -1
                })
            }
            if (type == 'state') {

                df.sort((a, b) => {
                    return (a.State > b.State) ? 1 : -1
                })
            }
            if (type == 'desc') {
                df.sort((a, b) => {
                    return (a.Emissions < b.Emissions) ? 1 : -1
                })
            }

            return df;
        }


        var sort_functions = {
            'asc': function (a, b) { return (a.Emissions > b.Emissions) ? 1 : -1; },
            'desc': function (a, b) { return (a.Emissions < b.Emissions) ? 1 : -1; },
            'state': function (a, b) { return (a.State > b.State) ? 1 : -1; }
        }

        d3.selectAll("input[name='viz']").on("change", function () {
            var val = this.value;
            var sorted_df = df.sort(sort_functions[val]);

            var delay = document.getElementById("msbox").value;
            if (isNaN(delay)) {
                alert("Delay needs to be a number");
                return;
            }
            x.domain(sorted_df.map(d => d.State))
            svg
                .select(".x-axis")
                .transition()
                .duration(52 * delay)
                .call(xAxis)
            console.log(g.selectAll('.bar'))
            g.selectAll('.bar')
                .sort(sort_functions[val])
                .transition()
                .duration(500)
                .delay((d, i) => i * delay)
                .attr('x', d => x(d.State))




        });

    });
}

buildChart('#chart-holder');
