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
  if(!this.rendered){
      //Creating permanent d3 objects between reloads
      this.d3b = {};   //Margins
      this.d3b.margin = {top: 20, right: 5, bottom: 30, left: 0},
      console.log('Bar func: '+opts.name);
      //Width from original object for responsive design
      this.d3b.width = $('#d3'+opts.name).width() - this.d3b.margin.left - this.d3b.margin.right,
      this.d3b.height = 120 - this.d3b.margin.top - this.d3b.margin.bottom;

      //Ordinal escale X
      this.d3b.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.d3b.width], .02);
      console.log(d3);
      //Linear scale Y
      this.d3b.y = d3.scale.linear()
        .range([this.d3b.height-2, 0]);

      //Color for bar
      this.d3b.color = d3.scale.category10();

      this.d3b.xAxis = d3.svg.axis()
        .scale(this.d3b.x)
        .orient("bottom");

      this.d3b.yAxis = d3.svg.axis()
          .scale(this.d3b.y)
          .orient("left")
          .ticks(10);

      this.d3b.svg = d3.select('#d3'+opts.name)
          .attr("width", this.d3b.width + this.d3b.margin.left + this.d3b.margin.right)
          .attr("height", this.d3b.height + this.d3b.margin.top + this.d3b.margin.bottom)
        .append("g")
          .attr("class", "wrapper")
          .attr("transform", "translate(" + this.d3b.margin.left + "," + this.d3b.margin.top + ")");
      this.rendered=true;

      this.d3b.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.d3b.height + ")")
        .call(this.d3b.xAxis);
    }

    //Setting keys
    var keys = _.map(opts.data, function(data, key){
      return data.key;
    });
    this.d3b.color.domain(keys);

    // setting data
    var data = opts.data;

    this.d3b.x.domain(keys);
    this.d3b.y.domain([0, d3.max(data, function(d) { return d.size; })]);

    var bar_selector = this.d3b.svg.selectAll(".bar")
      .data(data, function (d) {return d.key});
    var text_selector = this.d3b.svg.selectAll(".bar_text")
      .data(data, function (d) {return d.key});
    this.d3b.svg.selectAll('.x').call(this.d3b.xAxis);
    var that = this;

    bar_selector
      .enter().append("rect")
      .attr("class", "bar")
    bar_selector
      .transition()
      .duration(100)
      .attr("x", function(d) { return that.d3b.x(d.key);})
      .attr("width", that.d3b.x.rangeBand())
      .attr("y", function(d) { return that.d3b.y(d.size); })
      .attr("height", function(d) { return that.d3b.height - that.d3b.y(d.size); })
      .style("fill", function(d) { return that.d3b.color(d.key);});

    text_selector
      .enter().append("text")
      .attr("class", "bar_text")
    text_selector
      .transition()
      .duration(100)
      .attr()
      .attr("x", function(d) { return that.d3b.x(d.key);})
      .attr('font-size', '14px')
      .attr("y", function(d) { return that.d3b.y(d.size) - 2; })
      .text(function(d) {return d.size;})
      .attr("height", function(d) { return that.d3b.height - that.d3b.y(d.size); });
};

};