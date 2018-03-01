function buildChart(containerId) {
  // size globals
  var width = 960;
  var height = 625;

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

  //Define map projection
  var projection = d3
    .geoAlbersUsa()
    .translate([innerWidth / 2, innerHeight / 2])
    .scale([1275]);
  //Define path generator
  var path = d3.geoPath().projection(projection);

  d3.json("us-states.json", function(json) {
    // plots states
    g
      .selectAll(".states")
      .data(json.features)
      .enter()
      .append("path")
      .attr("class", "states")
      .attr("d", path)
      .style("fill", "white")
      //.attr("stroke-dasharray", "3 3")
      // .style("stroke-opacity", 0.15)
      .style("stroke", "black");

    d3.csv("NSRDB_StationsMeta.csv", function(data) {
      data.forEach(d => {
        d.elev = +d["NSRDB_ELEV (m)"];
      });
      function llreturn(d, ll) {
        var op = projection([d.longitude, d.latitude]);
        if (op == null) {
          return;
        }
        if (ll == "lng") {
          return op[0];
        }
        if (ll == "lat") {
          return op[1];
        }
      }
      var cols = d3.scaleOrdinal(d3.schemeCategory10);
      var sizes = d3
        .scaleLog()
        .domain([0.1, d3.max(data, d => d.elev)])
        .range([2, 15]);
      g
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", d => "Class" + d.CLASS)
        .attr("cx", d => llreturn(d, "lng"))
        .attr("cy", d => llreturn(d, "lat"))
        .attr("r", d => sizes(d.elev))
        .style("fill", d => cols(d.CLASS))
        .style("opacity", 0.8);
      g
        .append("text")
        .attr("x", innerHeight / 2)
        .attr("y", 3)
        .style("font-size", "24px")
        .text("Stations by Elevation and Class");

      // leg stuff
      var leg = [
        {
          class: 1,
          y: 400
        },
        {
          class: 2,
          y: 450
        },
        {
          class: 3,
          y: 500
        }
      ];

      g
        .selectAll(".legcircle")
        .data(leg)
        .enter()
        .append("circle")
        .attr("class", "legcircle")
        .attr("cx", 825)
        .attr("cy", d => d.y)
        .attr("fill", d => cols(d.class))
        .attr("r", 8);

      g
        .selectAll(".legtxt")
        .data(leg)
        .enter()
        .append("text")
        .attr("class", "legtxt")
        .attr("x", 840)
        .attr("y", d => d.y + 6)
        .style("font-size", "16px")
        .text(d => "Class " + d.class);

      d3.selectAll("input[name='viz']").on("change", function() {
        if (this.checked == true) {
          check(this);
        } else {
          uncheck(this);
        }
      });

      d3.select("#elebutton").on("click", function() {
        var min = document.getElementById("min").value;
        var max = document.getElementById("max").value;
        if (isNaN(min) | isNaN(max)) {
          alert("Min/Max Need to be numbers");
          return;
        }

        d3
          .selectAll(".Class1,.Class2,.Class3")
          .transition()
          .duration(1000)
          .attr("cy", function(d) {
            if ((d.elev >= min) & (d.elev <= max)) {
              return llreturn(d, "lat");
            } else {
              //already offscreen
              if (d3.select(this).attr("cy") < 0) {
                return -1000;
              } else {
                return 1000;
              }
            }
          })
          .transition()
          .duration(0)
          .attr("cy", d => {
            if ((d.elev >= min) & (d.elev <= max)) {
              return llreturn(d, "lat");
            } else {
              return -1000;
            }
          });
      });

      function check(box) {
        var id = box.value;
        g
          .selectAll(".Class" + id)
          .transition()
          .duration(1000)
          .attr("r", d => sizes(d.elev));
      }
      function uncheck(box) {
        var id = box.value;
        g
          .selectAll(".Class" + id)
          .transition()
          .duration(1000)
          .attr("r", 0);
      }
    });
  });
}

buildChart("#chart-holder");
