if(Meteor.isClient){
  Handlebars.registerHelper('d3bar', function (options){

    //Getting Options
    var opts = options.hash;
    var html = Spark.createLandmark({
      preserve: 'svg',

      rendered:function(){
        bar(opts);
      }
    }, function(landmark){
      return '<svg id="d3'+opts.name+'"></svg>';
    });
    //Creating svg if it's the first time.

    return html;
  });

function bar(opts){
  if(!this['r'+opts.name]){
      //Creating permanent d3 objects between reloads
      this[opts.name] = {};   //Margins
      this[opts.name].margin = {top: 20, right: 5, bottom: 30, left: 0},
      //Width from original object for responsive design
      this[opts.name].width = $('#d3'+opts.name).width() - this[opts.name].margin.left - this[opts.name].margin.right,
      this[opts.name].height = 120 - this[opts.name].margin.top - this[opts.name].margin.bottom;

      //Ordinal escale X
      this[opts.name].x = d3.scale.ordinal()
        .rangeRoundBands([0, this[opts.name].width], .02);
      //Linear scale Y
      this[opts.name].y = d3.scale.linear()
        .range([this[opts.name].height-2, 0]);

      //Color for bar
      this[opts.name].color = d3.scale.category10();

      this[opts.name].xAxis = d3.svg.axis()
        .scale(this[opts.name].x)
        .orient("bottom");

      this[opts.name].yAxis = d3.svg.axis()
          .scale(this[opts.name].y)
          .orient("left")
          .ticks(10);

      this[opts.name].svg = d3.select('#d3'+opts.name)
          .attr("width", this[opts.name].width + this[opts.name].margin.left + this[opts.name].margin.right)
          .attr("height", this[opts.name].height + this[opts.name].margin.top + this[opts.name].margin.bottom)
        .append("g")
          .attr("class", "wrapper")
          .attr("transform", "translate(" + this[opts.name].margin.left + "," + this[opts.name].margin.top + ")");
      this['r'+opts.name]=true;

      this[opts.name].svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this[opts.name].height + ")")
        .call(this[opts.name].xAxis);
    }

    //Setting keys
    var keys = _.map(opts.data, function(data, key){
      return data.key;
    });
    this[opts.name].color.domain(keys);

    // setting data
    var data = opts.data;

    this[opts.name].x.domain(keys);
    this[opts.name].y.domain([0, d3.max(data, function(d) { return d.size; })]);

    var bar_selector = this[opts.name].svg.selectAll(".bar")
      .data(data, function (d) {return d.key});
    var text_selector = this[opts.name].svg.selectAll(".bar_text")
      .data(data, function (d) {return d.key});
    this[opts.name].svg.selectAll('.x').call(this[opts.name].xAxis);
    var that = this;

    bar_selector
      .enter().append("rect")
      .attr("class", "bar")
    bar_selector
      .transition()
      .duration(100)
      .attr("x", function(d) { return that[opts.name].x(d.key);})
      .attr("width", that[opts.name].x.rangeBand())
      .attr("y", function(d) { return that[opts.name].y(d.size); })
      .attr("height", function(d) { return that[opts.name].height - that[opts.name].y(d.size); })
      .style("fill", function(d) { return that[opts.name].color(d.key);});

    text_selector
      .enter().append("text")
      .attr("class", "bar_text")
    text_selector
      .transition()
      .duration(100)
      .attr()
      .attr("x", function(d) { return that[opts.name].x(d.key);})
      .attr('font-size', '14px')
      .attr("y", function(d) { return that[opts.name].y(d.size) - 2; })
      .text(function(d) {return d.size;})
      .attr("height", function(d) { return that[opts.name].height - that[opts.name].y(d.size); });
};

};