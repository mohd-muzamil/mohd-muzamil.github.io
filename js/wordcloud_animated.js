function plotVis(selector){
//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html
// Encapsulate the word cloud functionality

var wordSize
function wordCloud(selector) {

    console.log(screen.width, screen.height)
    var width = 0.5 * screen.width
    var height = 0.5 * screen.height
    // if (Math.min(window.screen.width, window.screen.height) < 768) {
    //     width = 300
    //     height = 200
    // }
    wordSize = Math.min(window.screen.width, window.screen.height)/30

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select('#'+selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([width, height])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
var words = [
    "Web_Technologies HTML  CSS  Bootstrap JavaScript  TypeScript  jQuery D3.js  Flask  Dash  Django Vue.js  React.js  Svelte  node.js",
    "Programming_Languages Python  Java  Linux/Unix_shell_scripting  Golang",
    "ML/Visualization_libraries Pytorch  Keras  Sklearn XGBoost  NumPy  SciPy Pandas  Seaborn  Plotly Matplotlib  MATLAB",
    "Big_Data_Ecosystem HDFS  PySpark  Spark_MLlib Apache_Pig  Hive  Sqoop  Kafka",
    "Databases RDBMS/SQL MongoDB",
    "ETL_and_Analytic_tools Informatica ELK_Stack Tableau IBM_Cognos Grafana", 
    "Cloud_Frameworks/APIs REST_API AWS_Services Heroku",
    "Devops Agile_Development Git Jenkins Docker Kubernetes Vagrant"
]
//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    return words[i]
            // .replace(/[!,:;\?]/g, '_')
            .split(' ')
            .map(function(d, i) {
                s1 = wordSize
                s2 = wordSize*0.75 + Math.random() * wordSize*0.25
                if(i == 0){
                    return {text: '( '+ d + ' )', size: s1};
                } 
                else
                {
                    return {text: d, size: s2};
                }
            })
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, i) {
    // i = i || 0;
    console.log()
    vis.update(getWords(i % words.length))
    setTimeout(function() { showNewWords(vis, i + 1)}, 3500)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud(selector);

//Start cycling through the demo data
showNewWords(myWordCloud, 0);

}