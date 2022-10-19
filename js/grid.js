var width = 0.65 * $(document).width();
var height = 0.45 * width;
if (Math.min($(document).width(), $(document).height()) < 768) {
    width = 0.8 * $(document).width();
    height = width;
}    
var xStepsBig = d3.range(0, width, width/20),
    yStepsBig = d3.range(0, height, height/20),
    xStepsSmall = d3.range(0, width + 6, 6),
    yStepsSmall = d3.range(0, height + 6, 6);

var fisheye = d3.fisheye();

var line = d3.svg.line();

var svg = d3.select("#wordCloud").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(-0.5,-.5)");

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

svg.selectAll(".x")
    .data(xStepsBig)
  .enter().append("path")
    .attr("class", "x")
    .attr("stroke-width", "0.5")
    .attr("opacity", 0.5)
    .datum(function(x) { return yStepsSmall.map(function(y) { return [x, y]; }); });

svg.selectAll(".y")
    .data(yStepsBig)
  .enter().append("path")
    .attr("class", "y")
    .attr("stroke-width", "0.5")
    .attr("opacity", 0.5)
    .datum(function(y) { return xStepsSmall.map(function(x) { return [x, y]; }); });

var path = svg.selectAll("path")
    .attr("d", line);

svg.on("mousemove", function() {
  fisheye.center(d3.mouse(this));
  path.attr("d", function(d) { return line(d.map(fisheye)); });
});

svg.on("mouseout", function(){
    path.attr("d", line) });