var nodeGroup;

var nodegroup = function (divId)
{
	this.divId =divId;
	this.color = d3.scale.category20();

    this.init();
    this.drawNodeGroup();
}

nodegroup.prototype.init = function ()
{
	var self = this;
	var leftSize = $("#labelPanel table td").width();
	    $("#nodeGroupLabel").css("left", leftSize);
	var heightSize = window.screen.height * 0.74- $("#labelPanel table").height();
	    $("#nodeGroupSvgDiv").css("height", heightSize + "px");
	self.width = $("#labelPanel table").width() - leftSize ;
	    $("#nodeGroupLabel").css("width", self.width*1.05);
}

nodegroup.prototype.drawNodeGroup = function ()
{
	var self = this;
	self.margin = {top:10, right: 0, bottom: 5, left: 0},
    self.width = self.width - self.margin.left - self.margin.right,
    self.rectSize = 12;
    self.barHeight = self.rectSize * 1.2;

	var i = 0,
	    root;

	self.duration = 100;

	var tree = d3.layout.tree()
	    .nodeSize([0, 20]);

	var svg = d3.select("#" + self.divId).append("svg")
	    .attr("class", "nodegroupsvg")
	    .attr("width", self.width + self.margin.left + self.margin.right)
	    .append("g")
	    .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

	d3.json("data/testData.json", function(error, flare) {
	  flare.x0 = 0;
	  flare.y0 = 0;
	  self.nodeGroupData = flare;
	  update(root = flare);
	});

	function update(source) {

	  // Compute the flattened node list. TODO use d3.layout.hierarchy.
	  var nodes = tree.nodes(root);

	  var height = nodes.length * self.barHeight+ self.margin.top + self.margin.bottom;

	  d3.select(".nodegroupsvg").transition()
	      .duration(self.duration)
	      .attr("height", height);

	  // Compute the "layout".
	  nodes.forEach(function(n, i) {
	    n.x = i * self.barHeight;
	  });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
	      .data(nodes, function(d, i) {return d.id || (d.id = ++i); });

	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .style("opacity", 1e-6);

	  // Enter any new nodes at the parent's previous position.
	  nodeEnter.append("rect")
	      .attr("class", function(d){
	      	return "nodeGroupRect-" + d.name;
	      })
	      .attr("y", -self.barHeight / 2)
	      .attr("height", self.rectSize)
	      .attr("width", self.rectSize)
	      .attr("stroke", "black")
	      .style("fill", function(d){
	      	if(d.name == "All")
            {
            	return "yellow";
            }
	      	 return self.color(d.name);
	      })
	      .on("click", click);

	  nodeEnter.append("text")
	      .attr("transform", function(){
	      	 return "translate(" + self.rectSize + ",0)"; 
	      })
	      .attr("dy", 3.5)
	      .attr("dx", 2.5)
	      .text(function(d) { return d.name; });

	  // Transition nodes to their new position.
	  nodeEnter.transition()
	      .duration(self.duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
	      .style("opacity", 1);

	  node.transition()
	      .duration(self.duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
	      .style("opacity", 1)
	      .select("rect")
	      .style("fill", function(d){
	      	if(d.name == "All")
	      	{
	      		return "yellow";
	      	}
	      	 return self.color(d.name);
	      });

	  // Transition exiting nodes to the parent's new position.
	  node.exit().transition()
	      .duration(self.duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .style("opacity", 1e-6)
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    self.foldGroup(d.name, d.children);
	    d.children = null;

	  } else {
	    d.children = d._children;
        self.unfoldGroup(d.name, d.children);
	    d._children = null;
	  }
	  update(d);
	  getShowData('update');
	}

	function color(d) {
	  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
	}
}

nodegroup.prototype.foldGroup = function (nodeName, nodeChildren)
{
	var self = this;
    var len = nodeChildren.length;
    for(var i =0; i< len; i++)
    {
    	foldGroupData[nodeChildren[i].name] = nodeName;
    	if(nodeChildren[i]["children"] != undefined)
    	{
    		self.foldGroup(nodeName, nodeChildren[i]["children"]);
    	}
    	if(nodeChildren[i]["_children"] != undefined && nodeChildren[i]["_children"] != null)
    	{
    		self.foldGroup(nodeName, nodeChildren[i]["_children"]);
    	}
    }
}

nodegroup.prototype.unfoldGroup = function (nodeName, nodeChildren)
{
	var self = this;
	var len = nodeChildren.length;
	for(var i =0; i< len; i++)
	{
		delete foldGroupData[nodeChildren[i].name];
		if(nodeChildren[i]["children"] != undefined)
		{
			self.unfoldGroup(nodeName, nodeChildren[i]["children"]);
		}
	}
}
