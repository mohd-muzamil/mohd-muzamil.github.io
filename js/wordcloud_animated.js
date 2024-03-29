function plotVis(selector){
    //Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
    //Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html
    // Encapsulate the word cloud functionality
    
    var wordSize
    function wordCloud(selector) {    
        var width = 0.75 * $(document).width();
        var height = 0.45 * width;
        if (Math.min($(document).width(), $(document).height()) < 768) {
            width = 0.95 * $(document).width();
            height = width;
        }
        width = Math.floor(width/40) * 40
        height = Math.floor(height/20) * 20   
        wordSize = Math.min(width, height)/15
    
        var fill = d3.scale.category20();
    
        //Construct the word cloud's SVG element
        // var svg = d3.select('#'+selector).append("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        //     .append("g")
        //     .attr("transform", `translate(${width/2}, ${height/2})`);
        svg = d3.select('#'+selector).selectAll('*')
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
                .style("font-family", "Marker Felt")
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
                    .rotate(function() { return ~~(Math.random() * 2) * 20; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }
    
    }
    
    //Some sample data - http://en.wikiquote.org/wiki/Opening_lines
    var words = [
        "Programming_Languages Python JAVA Unix/Linux_Shell_Scripting",
        "AI/Machine_Learning Statistics Predictive_Modelling Classification Clustering Anamoly_Detection Natural_Language Processing(NLP)",
        "Data_Science_Libraries scikit-learn padas NumPy SciPy Plotly Matplotlib seaborn NLTK Spacy",
        "Deep_Learning_Libraries PyTorch Keras",
        "Distributed_Computing Hadoop PySpark",
        "Databases&Cloud SQL MongoDB Amazon_AWS",
        "Web_Development HTML CSS JavaScript jQuery Custom_Data_Visualization_with_D3.js Flask Dash",
        "Others Informatica Airflow Git Docker Jira",
        "Python JAVA Unix/Linux scikit-learn padas NumPy SciPy Plotly Matplotlib seaborn NLTK Spacy PyTorch Keras SQL MongoDB Amazon_AWS HTML CSS JavaScript jQuery D3.js Flask Dash Informatica Airflow Git Docker Jira"
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
        vis.update(getWords(i % words.length))
        setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
    }
    
    //Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud(selector);
    
    //Start cycling through the demo data
    showNewWords(myWordCloud, 0);
    }