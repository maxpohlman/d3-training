function buildChart(containerId) {
  // size globals
  var width = 1400;
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
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  // create inner group element
  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var yrs = [12, 13, 14, 15, 16];
  data = [];
  maxes = [];

  function tidyer(df) {
    df.forEach(d => {
      d.id = d.StateCode + d.CountyCode;
      d.unemp = +d.Percent;
    });
    maxes.push(Math.max.apply(Math, df.map(e => e.unemp)));
    data.push(df);
  }

  function drawmap(i, data, county, colorscale) {
    var yeardata = data[i];
    var tempcounty = county;
    console.log("data", yeardata);
    tempcounty.features.forEach(d => {
      yeardata.forEach(e => {
        if (+e.id === +d.id) {
          d.unemp = e.unemp;
        }
      });
    });

    //Define map projection
    var projection = d3
      .geoAlbersUsa()
      .translate([innerWidth * (i + 1) / 5 - 100, innerHeight / 2])
      .scale([350]);
    //Define path generator
    var path = d3.geoPath().projection(projection);
    console.log(tempcounty);
    svg
      .selectAll(".county" + i)
      .data(tempcounty.features)
      .enter()
      .append("path")
      .attr("class", "county" + i)
      .attr("d", path)
      .style("fill", d => colorscale(d.unemp))
      .style("stroke-opacity", 0.1)
      .style("stroke", "black");

    svg
      .append("text")
      .attr("x", innerWidth * (i + 1) / 5 - 100)
      .attr("y", 100)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("20" + (i + 12) + " Unemployment");
  }

  d3.csv("laucnty12.csv", function(twelve) {
    d3.csv("laucnty13.csv", function(thirteen) {
      d3.csv("laucnty14.csv", function(fourteen) {
        d3.csv("laucnty15.csv", function(fifteen) {
          d3.csv("laucnty16.csv", function(sixteen) {
            d3.json("us-counties.json", function(county) {
              tidyer(twelve);
              tidyer(thirteen);
              tidyer(fourteen);
              tidyer(fifteen);
              tidyer(sixteen);
              var overall_max = maxes.reduce((a, b) => Math.max(a, b));

              var colorscale = d3
                .scaleLinear()
                .domain([0, overall_max])
                .range(["#ffffcc", "#800026"]);

              for (var i = 0; i < 5; i++) {
                drawmap(i, data, county, colorscale);
              }

              //scale

              var defs = svg.append("defs");
              var linearGradient = defs
                .append("linearGradient")
                .attr("id", "linear-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");
              linearGradient
                .selectAll("stop")
                .data(colorscale.range())
                .enter()
                .append("stop")
                .attr("offset", function(d, i) {
                  return i / (colorscale.range().length - 1);
                })
                .attr("stop-color", function(d) {
                  return d;
                });

              svg
                .append("rect")
                .attr("width", 500)
                .attr("height", 10)
                .style("fill", "url(#linear-gradient)")
                .attr("x", 475)
                .attr("y", 450)
                .style("stroke", "black");

              svg
                .append("text")
                .attr("x", 458)
                .attr("y", 461)
                .attr("font-size", "16px")
                .text("0");

              svg
                .append("text")
                .attr("x", 979)
                .attr("y", 461)
                .attr("font-size", "16px")
                .text(overall_max + "%");
            });
          });
        });
      });
    });
  });
}

buildChart("#chart-holder");
