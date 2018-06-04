// =====================================================================
// Acknowledgements: the structure of this code is inspired by
// Déborah Mesquita and her article, "A gentle introduction
// to D3: how to build a reusable bubble chart"
// https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46

//  My advisor was Joe Keohan whose thoughtful guidance was
// integral to this project.
// =====================================================================


// ======================================================
// Some variables to get us started
// ======================================================
let data;
let node;
let simulation;
let clusterByBorough;
let width;
let length;
let scaleRadius;
let forceX;
const chart = bubbleChart().width(800).height(570);
let columnForColors = "borough";
let columnForRadius = "Refuse";
width = 800;
height = 570;

// ======================================================
// Get the the Data (first time the page loads)
// ======================================================
function getData() {d3.csv('https://gist.githubusercontent.com/snphillips/5b5800d535f0de281970521a30c68be1/raw/11f00d8f6ca3c5dac0adf97994a5b6949940d91c/DSNY_Monthly_Tonnage_Data_2017.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);
    d3.select('#headerweight').html(new Intl.NumberFormat().format(totalrefusecollected()));
})
}
getData();

// ======================================================
// Get the the Data 2018
// ======================================================
function getData2018() {d3.csv('https://gist.githubusercontent.com/snphillips/2fda86c33044ddf34d661ee3a9f62aeb/raw/d4de2b986f5b3cc76448208ee98703ac66e19101/DSNY_Monthly_Tonnage_Data_2018.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    d3.selectAll("svg > *").remove();
    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);

    d3.select('#chart-year').html("2018")
    d3.select('#headerweight').html("Select refuse type to view total weight");
})
}

// ======================================================
// Get the the Data 2017
// ======================================================
function getData2017() {d3.csv('https://gist.githubusercontent.com/snphillips/5b5800d535f0de281970521a30c68be1/raw/11f00d8f6ca3c5dac0adf97994a5b6949940d91c/DSNY_Monthly_Tonnage_Data_2017.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    d3.selectAll("svg > *").remove();
    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);

  d3.select('#chart-year').html("2017")
  d3.select('#headerweight').html("Select refuse type to view total weight");

})
}

// ======================================================
// Get the the Data 2016
// ======================================================
function getData2016() {d3.csv('https://gist.githubusercontent.com/snphillips/dc2cd752f571997bd9adb5f4c561526d/raw/716762f2752388c90451d3c186610ca3ea3cd889/DSNY_Monthly_Tonnage_Data_2016.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    d3.selectAll("svg > *").remove();
    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);

  d3.select('#chart-year').html("2016")
  d3.select('#headerweight').html("Select refuse type to view total weight");
})
}

// ======================================================
// Get the the Data 2015
// ======================================================
function getData2015() {d3.csv('https://gist.githubusercontent.com/snphillips/64124a1e90909f6f3d44501d899dfbb8/raw/c4c2abead99059a3c71a5be1190299ff927322fe/DSNY_Monthly_Tonnage_Data_2015.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    d3.selectAll("svg > *").remove();
    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);

  d3.select('#chart-year').html("2015")
  d3.select('#headerweight').html("Select refuse type to view total weight");
})
}

// ======================================================
// Get the the Data 2014
// ======================================================
function getData2014() {d3.csv('https://gist.githubusercontent.com/snphillips/e9031309a9a9b633b7cb0d26a2ed4848/raw/0d047b0379bc09877ce1607b9118ae899f62cee9/DSNY_Monthly_Tonnage_Data_2014.csv', function(error, local_data) {
      if (error) {console.error('Error getting or parsing the data.');
          throw error;}

    d3.selectAll("svg > *").remove();
    data = local_data;
    d3.select('#chart').datum(local_data).call(chart);

    d3.select('#chart-year').html("2014")
    d3.select('#headerweight').html("Select refuse type to view total weight");

})
}

// ***************************************************
//   Material type button - Trash
// ***************************************************
d3.select("#refuse").on('click', function() {

   columnForRadius = 'Refuse'
   console.log("Refuse button. The column used to calculate radius is now:", columnForRadius )
   d3.select("#chart-description").html("One Year of Trash: ")

       d3.selectAll("svg > *").remove();

       d3.select('#chart').datum(data).call(chart);
       d3.select('#headerweight').html(new Intl.NumberFormat().format(totalrefusecollected()));
       d3.select("#rat-stat").html("That's the weight of " +  (totalrefusecollected()/365000).toFixed(1) + " Empire State Buildings!")


  })

// ***************************************************
//   Material type button - Paper & Cardboard
// ***************************************************
d3.select("#paper-cardboard").on('click', function() {
   columnForRadius = 'Paper_Cardboard'
   console.log("Paper_Cardboard button. The column used to calculate radius is now:", columnForRadius )
  d3.select("#chart-description").html("One Year of Paper & Cardboard Recycling: ")

      d3.selectAll("svg > *").remove();
      d3.select('#chart').datum(data).call(chart);
      d3.select('#headerweight').html(new Intl.NumberFormat().format(totalpapercollected()));
      d3.select("#rat-stat").html("That's the weight of " +  (totalpapercollected()/365000).toFixed(1) + " Empire State Buildings!");
  })

// ***************************************************
//   Material type button - MGP
// ***************************************************
 d3.select("#metal-glass-plastic").on('click', function() {
   columnForRadius = 'Metal_Glass_Plastic'
   console.log("Metal_Glass_Plastic button. The column used to calculate radius is now:", columnForRadius )
   d3.select("#chart-description").html("One Year of Metal, Glass, Plastic & Drink Carton Recycling: ")

      d3.selectAll("svg > *").remove();
      d3.select('#chart').datum(data).call(chart);
      d3.select('#headerweight').html(new Intl.NumberFormat().format(totalmgpcollected()));
      d3.select("#rat-stat").html("That's the weight of " +  (totalmgpcollected()/365000).toFixed(1) + " Empire State Buildings!");
   render(data)
  })


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   Borough Cluster button - Does't really work
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  d3.select('#boroughs-cluster')
    .on('click', function () {

      console.log("boroughs-cluster button clicked")

      let circles = d3.selectAll('circle')

        .transition().attr("transform", d => {

          if(d.borough == 'Brooklyn') { return "translate(-120, 0)"}
          else if(d.borough == 'Bronx') { return "translate(-100, 0)"}
          else if(d.borough == 'Queens') { return "translate(0, 0)"}
          else if(d.borough == 'Manhattan') { return "translate(100,0)"}
          else if(d.borough == 'Staten Island') { return "translate(150,0)"}
        }).duration(1500)

      simulation.alpha()

    });

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//   All Boroughs Cluster button
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
d3.select('#all-boroughs')
    .on('click', function () {

      console.log("all-boroughsbutton clicked")

      let circles = d3.selectAll('circle')

        .transition()
        .attr("transform","translate(width/2, height/2)")
        .duration(1500)
    });

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// GIANT bubbleChart function! Ends on line 385
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function bubbleChart() {
     var width = 800,
         height = 570,
         maxRadius = 6;

function chart(selection) {
    var data = selection.datum();
    var div = selection,
        svg = div.selectAll('svg');
        svg.attr('width', width)
           .attr('height', height);

// ======================================================
// Tooltip options
// ======================================================
    var tooltip = selection
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("line-height", "1.4")
        .style("font-size", "95%")
        .style("color", "white")
        .style("font-weight", "100")
        .style("padding", "8px")
        .style("background-color", "#34202c")
        .style("border-radius", "5px")
        .style("text-align", "left")
        .style("font-family", "sans-serif")
        .style("max-width", "600px")

// ======================================================
// The Clustering
// ======================================================

let forceX = d3.forceX(function(d) {
  return width/2
})

let forceY = d3.forceY(function(d) {
  return height/2
})


let simulation = d3.forceSimulation(data)
    // .velocityDecay(.3)
    .force("charge", d3.forceManyBody().strength([-10.6]))
    .force("x", forceX)
    .force("y", forceY)
    .force("collide", d3.forceCollide().radius(function(d) { return d.r + 0.1; }))
    .on("tick", ticked);

function ticked(e) {
    node.attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });
}

// ======================================================
// Colors!
// ======================================================
var colorCircles = d3.scaleOrdinal()
  .range(["#675375", "#8d4944", "#613563", "#696d9c", "#94aacc"]);

// ======================================================
// Circle Radius Range
// ======================================================
var scaleRadius = d3.scaleSqrt()
                    .domain([75.67, 7759.42])
                    .range([3, 16.4])

// ======================================================
// Making the circle nodes
// ======================================================
var node = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr('r', function(d) {
        return scaleRadius(d[columnForRadius])
    })
    .style("fill", function(d) {
        return colorCircles(d[columnForColors])
    })

    // Center of the screen. Otherwise they go to upper left
    // .attr('transform', 'translate(' + [width / 2, height / 2] + ')')

// ======================================================
// Tooltip message
// ======================================================
.on("mouseover", function(d) {
        tooltip.html(d[columnForColors] + " District " + d.communitydistrict
        + "</br>" + d.neighborhoods
        + "</br>" + "population: " +  new Intl.NumberFormat().format(d.population)
        + "</br></br>" + d.month + " / " + d.year
        + "</br>" + columnForRadius + " pick up"
        + "</br>" + new Intl.NumberFormat().format(Math.round(d[columnForRadius]))  + " tons"
        + "</br>" + Math.round( (d[columnForRadius] / d.population)*2000 ) + " pounds/person"
        + "</br></br>" + "That is the equivalent of " +  Math.round(d[columnForRadius] / 225) + " Statue of Liberties!")

// ======================================================
// Mouseover bubble effect
// ======================================================
        d3.select(this).transition()
                       .duration(500)
                       .attr('r', 18)
                       .style('opacity', 0.6)
                       .attr('stroke-width', 10)
                       .attr('stroke', 'purple');

          return (tooltip.style("visibility", "visible"))
    } )

// ======================================================
// Tooltip mousemove
// ======================================================
.on("mousemove", function() {
    return tooltip.style("top", (d3.event.pageY - 10) + "px")
                  .style("left", (d3.event.pageX + 10) + "px");
})
// ======================================================
// Tooltip mouseout/makes message dissapear/reverts styling
// ======================================================
.on("mouseout", function() {
    return tooltip.style("visibility", "hidden"),

      // removes the mouseover styling, back to baseline style
      d3.select(this).transition()
                     .duration(300)
                     .attr("r", function(d) {
        return scaleRadius(d[columnForRadius])})
                     .style("fill", function(d) {
        return colorCircles(d[columnForColors])})
                     .attr('stroke-width', 0)
                     .style('opacity', 0.9);
});
}

// ======================================================
// Chart constuction
// ======================================================
chart.width = function(value) {
    if (!arguments.length) {
        return width;
    }
    width = value;
    return chart;
};

chart.height = function(value) {
    if (!arguments.length) {
        return height;
    }
    height = value;
    return chart;
};

chart.columnForColors = function(value) {
    if (!arguments.columnForColors) {
        return columnForColors;
    }
    columnForColors = value;
    return chart;
};

chart.columnForRadius = function(value) {
    if (!arguments.columnForRadius) {
        return columnForRadius;
    }
    columnForRadius = value;
    return chart;
};

    return chart;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// End of giant chart function
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// =======================================
//   Calculating Total of any material. Does not work. Why?!!
//   columnForRadius definiately returns either Refuse, Paper_Cardboard or Metal_Glass_Plastic
// =======================================
// function totalcollected(){
//     let totalcollectedBorough = d3.nest().key( d => d.borough ).rollup(function(leaves) { return {"columnForRadius": d3.sum(leaves, function(d) { return Math.round(d.columnForRadius);})} }).entries(data)
//     console.log("the column for radius is:", columnForRadius)
//     return d3.sum(totalcollectedBorough, d => d.value.columnForRadius);
// }

// =======================================
//   Calculating total Refuse tons collected - works
// =======================================
function totalrefusecollected(){
    let totalrefusecollectedBorough = d3.nest().key( d => d.borough ).rollup(function(leaves) { return {"Refuse": d3.sum(leaves, function(d) {return Math.round(d.Refuse);})} }).entries(data)

    return d3.sum(totalrefusecollectedBorough, d => d.value.Refuse);
}

// =======================================
//   Calculating total Paper tons collected - works
// =======================================
  function totalpapercollected(){
   let totalpapertonscollectedBorough = d3.nest().key( d => d.borough ).rollup(function(leaves) { return {"Paper_Cardboard": d3.sum(leaves, function(d) {return Math.round(d.Paper_Cardboard);})} }).entries(data)
return d3.sum(totalpapertonscollectedBorough, d => d.value.Paper_Cardboard);
  }

// =======================================
//   Calculating total MGP tons collected - works
// =======================================
  function totalmgpcollected(){
   let totalmgptonscollectedBorough = d3.nest().key( d => d.borough ).rollup(function(leaves) { return {"Metal_Glass_Plastic": d3.sum(leaves, function(d) {return Math.round(d.Metal_Glass_Plastic);})} }).entries(data)
return d3.sum(totalmgptonscollectedBorough, d => d.value.Metal_Glass_Plastic);
  }
