var matrix = function (divId)
{
	  this.divId = divId;
    this.nodeGroupDiv = "nodeGroupSvgDiv";
    $(".loading").show();
    this.selectedElements = {};
    this.selectedElements["elements"] = [];
    this.selectedElements["eventInSetA"] = [];
    this.selectedElements["eventInSetB"] = [];
    this.selectedElements["relatedNode"] = {};
    this.selectedElements["relatedLink"] = {};
    this.clickStrokeColor = "yellow";
    this.durationTime = 1000;
    this.labelColor = d3.scale.category20();
    this.config();
    this.init();
    this.zoomPan();
    
    this.drawLabel();
    this.getStepPlace();
    this.getNodeRectSize();
    this.drawMatrixWave();
}

matrix.prototype.config = function()
{
	var self = this;
	self.nodeLabelDivId = "nodeLabel";
	self.nodeColorDivId = "nodeColorLabel";
	self.nodeMaxText = "nodeMaxText";
	self.linkLabelDivId = "linkLabel"; 
	self.linkColorDivId = "linkColorLabel";
	self.linkMaxText = "linkMaxText";
  self.nodeTip();
  self.linkTip();

	self.rectFill = "rgb(115, 118, 115)";

	self.width = $("#" + self.divId).width() * 0.98;
	self.height = $("#" + self.divId).height() * 0.98;
	self.margin = {"top": self.height * 0.15, "bottom": self.height * 0.05,
                   "left": self.width * 0.1, "right": self.width * 0.05};
    self.rect = rectInMatrixWave;
    self.labelRect = 12;
    self.textRectWidth = self.rect * 2.5;
    self.textRectHeight = self.rect;
    self.stepCircleSize = self.rect * 1.0;

}

matrix.prototype.zoomPan = function()
{
  var self = this;
  window.panZoomInstance = svgPanZoom('#matrixwaveSvg', {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.1,
          zoomScaleSensitivity: 0.1,
          panEnabled: true,
          onZoom: function (newZoom){ 
                  },
          onPan: function (newPan){
                  }
        });
}

matrix.prototype.init = function()
{
	var self = this;
	self.getDragBoxSize();
  d3.select("#" + self.divId).selectAll("svg").remove();

    self.svg = d3.select("#" + self.divId)
                 .append("svg")
                 .attr("id", "matrixwaveSvg")
                 .attr("width", self.dragBoxWidth)
                 .attr("height", self.dragBoxHeight);

                 
    self.dragBox = self.svg.append("rect")
                       .attr("id", "dragBox")
                       .attr("width", self.dragBoxWidth)
                       .attr("height", self.dragBoxHeight)
                       // .attr("cursor", "move")
                       .attr("fill-opacity", 0);

    self.gMatrixWave = self.svg.append("g")
                           .attr("class", "gMatrixWave")
                           .attr("transform", function(){
                                return "translate(" + (self.margin.left )+ "," + (self.height * 0.4) + ") " + "rotate(-45)";                     
                           });


}

matrix.prototype.drawLabel = function ()
{
  var self = this;
  //绘制Label. 因为表格中每列的大小会随着绘画的东西发生变化。因此，画完所有的内容之后，调用一次drawNodeLabel。
    //这里的调用顺序不要动。可以将每个div的大小输出，查看div的大小变化情况。
    self.getNodeScale();
    self.getLinkScale();
    self.drawNodeLabel();
    self.drawNodeColorLabel();
    self.drawLinkColorLabel();
    self.drawLinkLabel();
    self.drawNodeLabel();

}

matrix.prototype.nodeTip = function()
{
   var self = this;
   self.nodeTip = d3.tip()
                .attr("class", function(d){
                   return "d3-tip";
                })
                .offset([10, 60])
                .direction("s")
                .html(function(d){
                   var textMessage;
                   if(d["volume"]["percentage"] == undefined)
                   {
                      var percentage = (d["volume"]["setA"] - d["volume"]["setB"])/(d["volume"]["setA"] + d["volume"]["setB"]);

                       percentage = percentage * 100;                     
                       if(percentage > 0)
                       {
                         percentage = percentage.toFixed(2);
                          percentage = "+" + percentage + "%";
                          d["volume"]["percentage"] = percentage;
                       }
                       if(percentage < 0)
                       {
                         percentage = percentage.toFixed(2);
                         percentage =  percentage + "%";
                         d["volume"]["percentage"] = percentage;
                      }   
                       if(percentage == 0)
                       {
                          percentage = percentage + "%";
                          d["volume"]["percentage"] = percentage;
                       }

                   }

                   textMessage = "<p>Pages: " + d["id"] + "</p>";
                   textMessage += "<p>Visitors: " + d["volume"]["setA"] + " " + d["volume"]["setB"] 
                                  + " (" + d["volume"]["percentage"] + ") </p>";
                   return textMessage;
                })
}

matrix.prototype.linkTip = function()
{
  var self = this;
  self.linkTip = d3.tip()
                   .attr("class", "d3-tip")
                   .offset([10, 60])
                   .direction("s")
                   .html(function(d){
                    var textMessage;
                    var percentage;
                    if(d["volume"]["percentage"] == undefined)
                    {
                      percentage = (d["volume"]["setA"] - d["volume"]["setB"])/(d["volume"]["setA"] + d["volume"]["setB"]);
                      percentage = percentage * 100;
                      if(percentage > 0)
                      {
                        percentage = percentage.toFixed(2);
                        percentage = "+" + percentage + "%";
                      }
                      if(percentage == 0)
                      {
                        percentage = percentage + "%";
                      }
                      if(percentage < 0)
                      {
                        percentage = percentage.toFixed(2);
                        percentage = percentage + "%"; 
                      }
                      d["volume"]["percentage"] = percentage;
                    }
                    textMessage = "<p>From: " + d["source"] + " To: " + d["target"] + "</p>";
                    textMessage += "<p>Visitors: " + d["volume"]["setA"] + " " + d["volume"]["setB"] 
                                  + " (" + d["volume"]["percentage"] + ") </p>";
                   return textMessage;
                   }) 
}

matrix.prototype.getDragBoxSize = function()
{
	var self = this;
	var len;
	self.dragBoxWidth = 0;
	self.dragBoxHeight = 0;
	if(dataInStep.length == 0)
	{
		self.dragBoxWidth = self.width;
		self.dragBoxHeight = self.height;
	}
	else
	{
		for(var i =0; i< dataInStep.length; i++)
		{
           len = dataInStep[i]["nodes"].length;
           if(i%2 == 1)
           {
           	   self.dragBoxWidth += len * self.rect;
           	   self.dragBoxWidth += self.textRectWidth;
           }
           if(i % 2 == 0)
           {
           	   self.dragBoxHeight += len * self.rect;
           	   self.dragBoxHeight += self.textRectWidth;
           }
		}
		self.dragBoxWidth = self.dragBoxWidth + self.margin.left + self.margin.right;
		self.dragBoxHeight = self.dragBoxHeight + self.margin.top + self.margin.bottom;
	}

	if(self.dragBoxWidth < self.width)
	{
		self.dragBoxWidth = self.width;
	}
	if(self.dragBoxHeight < self.height)
	{
		self.dragBoxHeight = self.height;
	}
}

matrix.prototype.getStepPlace = function ()
{
	var self = this;
	var width = self.textRectWidth * 2; 
	var height = 0;
	var len = dataInStep.length -1;
	for(var i =0; i< len; i++)
	{
		if(dataInStep[i]["place"] == undefined)
		{
			dataInStep[i]["place"] = {};
    }
		dataInStep[i]["place"]["x"] = width;
		dataInStep[i]["place"]["y"] = height;
		if(i%2 == 0)
		{
			height += (dataInStep[i]["nodes"].length * self.rect + self.textRectWidth * 2);
		}
		if(i%2 == 1)
		{
			width += (dataInStep[i]["nodes"].length * self.rect + self.textRectWidth * 2);
		}
	}
}

matrix.prototype.getNodeScale = function()
{
	var self = this;
	self.getNodeVolumeMax();
	self.nodeScale = d3.scale.linear()
	                   .domain([0, self.nodeVolumeMax])
	                   .range([0, self.labelRect * 2.5]);                
}

matrix.prototype.getLinkScale = function ()
{
	var self = this;
	self.getlinkVolumeMax();
	self.linkScale = d3.scale.linear()
	                   .domain([0, self.linkVolumeMax])
	                   .range([0, self.labelRect]);
}

matrix.prototype.getNodeVolumeMax = function()
{
	var self = this;
	var nodeSetKey = Object.keys(nodeSet);
	var nodeSetKeyLen = nodeSetKey.length;
	self.nodeVolumeMax = 0;
	var max = 0;
	for(var i =0;  i< nodeSetKeyLen; i++)
	{
        max = d3.max(nodeSet[nodeSetKey[i]]["volume"]["setA"]);
        if(self.nodeVolumeMax < max)
        {
        	self.nodeVolumeMax = max;
        }
        max = d3.max(nodeSet[nodeSetKey[i]]["volume"]["setB"]);
        if(self.nodeVolumeMax < max)
        {
        	self.nodeVolumeMax = max;
        }
	}
}

matrix.prototype.getlinkVolumeMax = function()
{
	var self = this;
	var edgeSetKey = Object.keys(edgeSet);
	var edgeSetKeyLen = edgeSetKey.length;
	self.linkVolumeMax = 0;
	var max = 0;
	for(var i =0; i< edgeSetKeyLen; i++)
	{
		max = d3.max(edgeSet[edgeSetKey[i]]["volume"]["setA"]);
		if(self.linkVolumeMax < max )
		{
			self.linkVolumeMax = max;
		}
		max = d3.max(edgeSet[edgeSetKey[i]]["volume"]["setB"]);
		if(self.linkVolumeMax < max)
		{
			self.linkVolumeMax = max;
		}
	}
}

matrix.prototype.drawNodeLabel = function ()
{
	var self = this;
  if(document.getElementById(self.nodeMaxText) != null)
  {
	   document.getElementById(self.nodeMaxText).innerHTML = self.nodeVolumeMax;
  }
	//表格中每列的大小会随着你绘画的东西发生变化。好烦。
	if(self.nodeLabel != undefined)
	{
		self.nodeLabel.svg.remove();
	}
  else
  {
      self.nodeLabel = {};
  } 
      self.nodeLabel.width = $("#" + self.nodeLabelDivId).width() - 3;
      self.nodeLabel.margin = {"top":2, "bottom":2, "left":0, "right":5};
      self.nodeLabel.xScale = d3.scale.linear()
                                  .domain([0, 10])
                                  .range([0, self.nodeLabel.width - self.nodeLabel.margin.right]);
    if(self.nodeColorLabel != undefined)
    {
    	self.nodeLabel.xScale = self.nodeColorLabel.xScale;
    }
    
    d3.select("#" + self.nodeLabelDivId).selectAll("svg").remove();

    self.nodeLabel.svg = d3.select("#" + self.nodeLabelDivId)
                           .append("svg")
                           .attr("width", self.nodeLabel.width + self.nodeLabel.margin.left + self.nodeLabel.margin.right)
                           .attr("height", self.nodeLabel.margin.top + self.nodeLabel.margin.bottom + self.textRectWidth * 2);
    self.nodeLabel.gLabel = self.nodeLabel.svg.append("g")
                                .attr("class", "gNodeLabel")
                                .attr("transform", "translate(" + self.nodeLabel.margin.left + "," + self.nodeLabel.margin.top + ")");
    for(var i = 0; i <= 10; i++)
    {
         self.nodeLabel.gLabel.append("rect")
                              .datum(i)
                              .attr("x", function(d_data, i_data){
                              	  return self.nodeLabel.xScale(d_data);
                              })
                              .attr("y", function(d_data, i_data){
                                  if(d_data == 0)
                                  {
                                  	 return self.labelRect * 2.5 - self.nodeScale(1);
                                  }
                                  else
                                  {
                                  	 return self.labelRect * 2.5 - self.nodeScale(self.nodeVolumeMax/10 * d_data);
                                  }
                              })
                              .attr("width", self.labelRect)
                              .attr("height", function(d_data, i_data){
                              	if(d_data == 0)
                              	{
                              		return self.nodeScale(1) * 2;
                              	}
                              	else
                              	{
                              		return self.nodeScale(self.nodeVolumeMax/10 * d_data) * 2;
                              	}
                              })
                              .attr("fill", "white")
                              .attr("stroke", "black");
    }
}

matrix.prototype.drawNodeColorLabel = function ()
{
    var self = this;
    if(self.nodeColorLabel != undefined)
    {
       self.nodeColorLabel.svg.remove();
    }
    else
    {
      self.nodeColorLabel = {};
      self.nodeColorLabel.width = $("#" + self.nodeColorDivId).width() - 3;

      self.nodeColorLabel.margin = {"top":10, "bottom":2, "left":0, "right":5};
      self.nodeColorLabel.xScale = d3.scale.linear()
                                    .domain([0, 10])
                                    .range([0, self.nodeColorLabel.width - self.nodeColorLabel.margin.right - 3]);
    }
  
    d3.select("#" + self.nodeColorDivId).selectAll("svg").remove();
    self.nodeColorLabel.svg = d3.select("#" + self.nodeColorDivId)
                                .append("svg")
                                .attr("width", self.nodeColorLabel.margin.left + self.nodeColorLabel.margin.right + self.nodeColorLabel.width)
                                .attr("height", self.nodeColorLabel.margin.top + self.nodeColorLabel.margin.bottom + self.labelRect);
    self.nodeColorLabel.gNodeColor = self.nodeColorLabel.svg.append("g")
                                         .attr("class", "gNodeColor")
                                         .attr("transfrom", "translate(" + self.nodeColorLabel.margin.left + "," + self.nodeColorLabel.margin.top + ")");
    for(var i =0 ; i<= 10; i++)
    {
    	self.nodeColorLabel.gNodeColor.append("rect")
    	                   .datum(i)
    	                   .attr("x", function(d_data, i_data){
    	                   	  return self.nodeColorLabel.xScale(d_data);
    	                   })
    	                   .attr("y", function(d_data, i_data){
    	                   	   return 0;
    	                   })
    	                   .attr("width", function(d_data, i_data){
    	                   	  return self.labelRect;
    	                   })
    	                   .attr("height", function(d_data, i_data){
    	                   	  return self.labelRect;
    	                   })
    	                   .attr("stroke", "black")
    	                   .attr("fill", function(d_data, i_data){
    	                   	   d_data = (+d_data);
    	                   	   var num = 2 * d_data - 10;
    	                   	   num = num * 0.1;
    	                   	   num = num.toFixed(1);
    	                   	   return colorSelected["selection"][num];
    	                   });
    }             
}

matrix.prototype.drawLinkColorLabel = function ()
{
    var self = this;
    if(self.linkColorLabel != undefined)
    {
       self.linkColorLabel.svg.remove();
       self.linkColorLabel = {};
    }
    self.linkColorLabel = {};
    self.linkColorLabel.width = $("#" + self.linkColorDivId).width() - 3;
    self.linkColorLabel.margin = {"top":2, "bottom":2, "left":0, "right":5};
    self.linkColorLabel.xScale = self.nodeColorLabel.xScale;
    
    d3.select("#" + self.linkColorDivId).selectAll("svg").remove();
    self.linkColorLabel.svg = d3.select("#" + self.linkColorDivId)
                                .append("svg")
                                .attr("width", self.linkColorLabel.margin.left + self.linkColorLabel.margin.right + self.nodeColorLabel.width)
                                .attr("height", self.linkColorLabel.margin.top + self.linkColorLabel.margin.bottom + self.labelRect);
    self.linkColorLabel.gNodeColor = self.linkColorLabel.svg.append("g")
                                         .attr("class", "gNodeColor")
                                         .attr("transfrom", "translate(" + self.linkColorLabel.margin.left + "," + self.nodeColorLabel.margin.top + ")");
    for(var i =0 ; i<= 10; i++)
    {
    	self.linkColorLabel.gNodeColor.append("rect")
    	                   .datum(i)
    	                   .attr("x", function(d_data, i_data){
    	                   	  return self.linkColorLabel.xScale(d_data);
    	                   })
    	                   .attr("y", function(d_data, i_data){
    	                   	   return 0;
    	                   })
    	                   .attr("width", function(d_data, i_data){
    	                   	  return self.labelRect;
    	                   })
    	                   .attr("height", function(d_data, i_data){
    	                   	  return self.labelRect;
    	                   })
    	                   .attr("stroke", "black")
    	                   .attr("fill", function(d_data, i_data){
    	                   	   d_data = (+d_data);
    	                   	   var num = 2 * d_data - 10;
    	                   	   num = num * 0.1;
    	                   	   num = num.toFixed(1);
    	                   	   return colorSelected["selection"][num];
    	                   });
    }             
}

matrix.prototype.drawLinkLabel = function()
{
	var self = this;
  if(document.getElementById(self.linkMaxText) != null)
  {
    document.getElementById(self.linkMaxText).innerHTML = self.linkVolumeMax;
  }
	
  if(self.linkLabel != undefined)
  {
    self.linkLabel.svg.remove();
    self.linkLabel = {};
  }
	self.linkLabel = {};
	self.linkLabel.width = $("#" + self.linkLabelDivId).width() - 3;
	self.linkLabel.margin = {"top":2, "bottom":2, "left":0, "right":5};
	self.linkLabel.xScale = self.nodeColorLabel.xScale;

  d3.select("#" + self.linkLabelDivId).selectAll("svg").remove();
	self.linkLabel.svg = d3.select("#" + self.linkLabelDivId)
	                       .append("svg")
	                       .attr("width", self.linkLabel.width + self.linkLabel.margin.left + self.linkLabel.margin.right)
	                       .attr("height", self.labelRect + self.linkLabel.margin.top + self.linkLabel.margin.bottom);
	self.linkLabel.gLinkLabel = self.linkLabel.svg.append("g")
	                                .attr("class", "gLinkLabel")
	                                .attr("transform", "translate(" + self.linkLabel.margin.left + "," + self.linkLabel.margin.top + ")");
	for(var i =0; i<= 10; i ++)
	{
		self.linkLabel.gLinkLabel.append("rect")
		              .datum(i)
		              .attr("x", function(d_data, i_data){
		              	  return self.linkLabel.xScale(d_data);
		              })
		              .attr("y", function(d_data, i_data){
		                  if(d_data == 0)
		                  {
		                  	 return self.labelRect/2 - self.linkScale(1)/2;
		                  }
		                  else
		                  {
		                  	 return self.labelRect/2 - self.linkScale(self.linkVolumeMax/10 * d_data)/2;
		                  }
	              })
		              .attr("width", function(d_data, i_data){
		              	  return self.labelRect;
		              })
		              .attr("height", function(d_data, i_data){
		              	  if(d_data == 0)
		              	  {
		              	  	 return self.linkScale(1);
		              	  }
		              	  else
		              	  {
		              	  	 return self.linkScale(self.linkVolumeMax/10 * d_data);
		              	  }
		              })
		              .attr("stroke", "black")
		              .attr("fill", "whitesmoke");
	}
}

matrix.prototype.drawMatrixWave = function ()
{
	var self = this;
	self.matrixWave = [];
	var len = dataInStep.length - 1;
	for(var i =0; i< len; i++)
	{
		self.matrixWave.push(self.drawMatrix(i, i+1));
		/*self.drawMatrixRect(i);*/  //这个操作在drawMatrix中已进行
		self.drawLink(i);
	}
	self.drawNodeRect();
  
  self.drawMatrixWaveLabel();

  self.isShowMatrixGrid();
  self.isShowMatrixWaveLabel();

  self.drawStepCircleLabel();

  $(".loading").hide();
}

matrix.prototype.getStepMatrixSize = function(step1, step2)
{
	var self = this;
    step1 = (+step1);
    step2 = (+step2);
    var lenRealStep1 = dataInStep[step1]["nodes"].length;
    var lenRealStep2 = dataInStep[step2]["nodes"].length;
    var lenStep1 = 0;
    var lenStep2 = 0;
    var node;
    for(var i =0; i< lenRealStep1; i++)
    {
       node = dataInStep[step1]["nodes"][i]["id"];
       if(nodeSet[node] != undefined)
       {
           lenStep1 ++ ;
       }
    }

    for(var i =0; i < lenRealStep2; i++)
    {
      node = dataInStep[step2]["nodes"][i]["id"];
      if(nodeSet[node] != undefined)
      {
        lenStep2 ++;
      }
    }

    var step = "step" + step1;
    dataInStep[step1]["rectWidth"] = 0;
    dataInStep[step1]["rectHeight"] = 0;
    if(step1%2 == 0)
    {
       dataInStep[step1]["rectWidth"] = lenStep2 * self.rect;
       dataInStep[step1]["rectHeight"] = lenStep1 * self.rect;
    }
    if(step1%2 == 1)
    {
    	dataInStep[step1]["rectWidth"] = lenStep1 * self.rect;
    	dataInStep[step1]["rectHeight"] = lenStep2 * self.rect;
    }
}

matrix.prototype.drawMatrix = function(step1, step2)
{
	var self = this;
  var name;
  var node;
    step1 = (+step1);
    step2 = (+step2);
    self.getStepMatrixSize(step1, step2);
    
    var lenStep1 = dataInStep[step1]["nodes"].length;
    var lenStep2 = dataInStep[step2]["nodes"].length;

    var step = "step" + step1;
    
    var gMatrix = self.gMatrixWave.append("g")
                      .attr("class", "step" + step1)
                      .attr("transform", "translate(" + dataInStep[step1]["place"]["x"] + "," + dataInStep[step1]["place"]["y"] + ")");
    //画每个step的大框框
       gMatrix.append("rect")
              .attr("class", "matrix" + step1)
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", function(d_data, i_data){
                return dataInStep[step1]["rectWidth"];
              })
              .attr("height", function(d_data, i_data){
                return dataInStep[step1]["rectHeight"];
              })
              .attr("fill-opacity", 0)
              .attr("stroke", "black")
              .attr("stroke-dasharray", "8 8");

    if(step1 % 2 == 0)
    {
        for(var i =0; i< lenStep1; i++)
        {
        	node = dataInStep[step1]["nodes"][i]["id"];
          if(nodeSet[node] != undefined)
          {
            for(var j =0; j< lenStep2; j++)
            {
              node = dataInStep[step2]["nodes"][j]["id"];
              if(nodeSet[node] != undefined)
              {
                gMatrix.append("g")
                     .call(self.linkTip)
                     .attr("class", step + "s" + dataInStep[step1]["nodes"][i]["id"] + "t" + dataInStep[step2]["nodes"][j]["id"] + " linkCell")
                     .classed("s" + dataInStep[step1]["nodes"][i]["id"], true)
                     .classed("t" + dataInStep[step2]["nodes"][j]["id"], true)
                     .attr("step", step1)
                     .attr("transform", function(){
                          dataInStep[step1]["nodes"][i]["orderIndex"] = (+dataInStep[step1]["nodes"][i]["orderIndex"]);
                              var y = dataInStep[step1]["nodes"][i]["orderIndex"] * self.rect;
                              dataInStep[step2]["nodes"][j]["orderIndex"] = (+dataInStep[step2]["nodes"][j]["orderIndex"]);
                              var x = dataInStep[step2]["nodes"][j]["orderIndex"] * self.rect;
                              return "translate(" + x + "," + y + ")";
                              
                     })
                     .append("rect")
                     .attr("class", step + "s" + dataInStep[step1]["nodes"][i]["id"] + "t" + dataInStep[step2]["nodes"][j]["id"] + " linkCell")
                     .attr("x", 0)
                     .attr("y", 0)
                     .attr("width", self.rect)
                     .attr("height", self.rect)
                     .attr("fill", "rgb(255, 255, 255)")
                     .attr("stroke", "white")
              }
            }
          }
        }
    }
    else
    {
    	for ( var i =0; i< lenStep2; i ++)
    	{
    		node = dataInStep[step2]["nodes"][i]["id"];
        if(nodeSet[node] != undefined)
        {
          for(var j=0; j< lenStep1; j++)
          {
            node = dataInStep[step1]["nodes"][j]["id"];
            if(nodeSet[node] != undefined)
            {
              name = step + "s" + dataInStep[step1]["nodes"][j]["id"] + "t" + dataInStep[step2]["nodes"][i]["id"] + " linkCell";
              gMatrix.append("g")
                     .call(self.linkTip)
                     .attr("class", name)
                     .classed("s" + dataInStep[step1]["nodes"][j]["id"], true)
                     .classed("t" + dataInStep[step2]["nodes"][i]["id"], true)
                     .attr("step", step1)
                     .attr("transform", function(){
                          dataInStep[step2]["nodes"][i]["orderIndex"] = (+dataInStep[step2]["nodes"][i]["orderIndex"]);
                          var y = dataInStep[step2]["nodes"][i]["orderIndex"] * self.rect;
                          dataInStep[step1]["nodes"][j]["orderIndex"] = (+dataInStep[step1]["nodes"][j]["orderIndex"]);
                          var x = dataInStep[step1]["nodes"][j]["orderIndex"] * self.rect;
                          return "translate(" + x + "," + y + ")";
                     })
                     .append("rect")
                     .attr("class", name)
                     .attr("x", 0)
                     .attr("y", 0)
                     .attr("width", self.rect)
                     .attr("height", self.rect)
                     .attr("fill", "rgb(255, 255, 255)")
                     .attr("stroke", "white")
                     .append("title")
                     .text(name);
            }
          }
        }
    	}
    }
    return gMatrix;
}

matrix.prototype.getLinkSizeAndColor = function (step1)
{
   var self = this;
   step1 = (+step1);
   var lenLink = dataInStep[step1]["edges"].length;
   var size;
   var difference;
   for(var i =0; i< lenLink; i++)
   {
      size = (dataInStep[step1]["edges"][i]["volume"]["setA"] + dataInStep[step1]["edges"][i]["volume"]["setB"])/2;
      dataInStep[step1]["edges"][i]["size"] = self.linkScale(size);
      difference = (dataInStep[step1]["edges"][i]["volume"]["setA"] - dataInStep[step1]["edges"][i]["volume"]["setB"])/(dataInStep[step1]["edges"][i]["volume"]["setA"] + dataInStep[step1]["edges"][i]["volume"]["setB"]);
      difference = difference.toFixed(1);
      difference = difference * 10;
      if(difference %2 != 0)
      {
        difference ++;
      }
      difference = difference /10;
      difference = difference.toFixed(1);
      dataInStep[step1]["edges"][i]["color"] = colorSelected["selection"][difference];
      dataInStep[step1]["edges"][i]["colorSize"] = difference;
   }
}

matrix.prototype.drawLink = function(step1)
{
	var self = this;
    step1 = (+step1);
    self.getLinkSizeAndColor(step1);
    var lenLink = dataInStep[step1]["edges"].length;
    var name;
    var sourceNode;
    var targetNode;
    var edge;
    for(var i =0; i< lenLink; i++)
    {
        sourceNode = dataInStep[step1]["edges"][i]["source"];
        targetNode = dataInStep[step1]["edges"][i]["target"];
        edge = dataInStep[step1]["edges"][i]["id"];
        if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined && edgeSet[edge] != undefined)
        {
          name = "step" + step1 + "s" + dataInStep[step1]["edges"][i]["source"] + "t" + dataInStep[step1]["edges"][i]["target"];
          self.matrixWave[step1].select("g." + name)
                                .append("rect")
                                .datum(dataInStep[step1]["edges"][i])
                                .attr("class", "rectInRect" + name)
                                .attr("x", function(d_data, i_data){
                                   return self.rect/2 - dataInStep[step1]["edges"][i]["size"]/2;
                                })
                                .attr("y", function(d_data, i_data){
                                  return self.rect/2 - dataInStep[step1]["edges"][i]["size"]/2;
                                })
                                .attr("width", function(d_data, i_data){
                                   return dataInStep[step1]["edges"][i]["size"];
                                })
                                .attr("height", function(d_data, i_data){
                                  return dataInStep[step1]["edges"][i]["size"];
                                })
                                .attr("fill", function(d_data, i_data){
                                  return self.rectFill;
                                });

          self.matrixWave[step1].select("rect." + name)
                                .datum(dataInStep[step1]["edges"][i])
                                .attr("fill", function(d_data, i_data){
                                  return dataInStep[step1]["edges"][i]["color"];
                               })
                                .attr("stroke", "rgb(234, 233, 233)");

         self.matrixWave[step1].select("g." + name)
                               .datum(dataInStep[step1]["edges"][i])
                               .on("mouseover", function(d_data, i_data){
                                 self.linkTip.show(d_data);
                                 var index;
                                 index = d3.select(this).attr("step");
                                 index = (+index);
                                 self.linkHoverHighlight(d_data["source"], d_data["target"], index);
                               })
                               .on("mouseout", function(d_data, i_data){
                                 self.linkTip.hide(d_data);
                                 self.linkHoverOut();
                               })
                               .on("click", function(d_data, i_data){
                                    var index;
                                    index = d3.select(this).attr("step");
                                    index = (+index);
                                    console.log("select link : from " + d_data["source"] + " to " + d_data["target"] + " step : " + index);
                                    self.linkClick(d_data["source"], d_data["target"], index);
                               })
        }
    }
}

matrix.prototype.drawMatrixRect = function (step1)
{
	var self = this;
	step1 = (+step1)
		self.matrixWave[step1].append("rect")
		    .attr("class", "matrix" + step1)
		    .attr("x", 0)
		    .attr("y", 0)
		    .attr("width", function(d_data, i_data){
		    	return dataInStep[step1]["rectWidth"];
		    })
		    .attr("height", function(d_data, i_data){
		    	return dataInStep[step1]["rectHeight"];
		    })
		    .attr("fill-opacity", 0)
		    .attr("stroke", "rgb(98, 97, 97)")
		    .attr("stroke-dasharray", "8 8");
}

matrix.prototype.drawNodeRect = function ()
{
	var self = this;
    self.matrixWaveNodeRect = [];
    var lenDataInStep = dataInStep.length  - 1;
    for(var i =0; i< lenDataInStep; i++)
    {
         self.matrixWaveNodeRect[i] = self.gMatrixWave.append("g")
                        .attr("class", "nodeStep" + i)
                        .attr("transform", function(d_data, i_data){
                        	return "translate(" + dataInStep[i]["place"]["x"] + "," + dataInStep[i]["place"]["y"] + ")";
                        })
    }
    if(lenDataInStep %2 == 1)
    {
    	self.matrixWaveNodeRect[lenDataInStep] = self.gMatrixWave.append("g")
    	                        .attr("class", "nodeStep" + lenDataInStep)
    	                        .attr("transform", function(d_data, i_data){
    	                              return "translate(" + dataInStep[lenDataInStep -1]["place"]["x"] + ","
    	                                     + (dataInStep[lenDataInStep -1]["place"]["y"] + dataInStep[lenDataInStep - 1]["rectHeight"] + self.textRectWidth * 2) + ")";
    	                         })
    }
    if(lenDataInStep % 2 == 0 && lenDataInStep != 0)
    {
    	self.matrixWaveNodeRect[lenDataInStep] = self.gMatrixWave.append("g")
    	                       .attr("class", "nodeRect" + lenDataInStep)
    	                       .attr("transform", function(d_data, i_data){
    	                       	  return "translate(" + (dataInStep[lenDataInStep - 1]["place"]["x"] + dataInStep[lenDataInStep - 1]["rectWidth"] + self.textRectWidth * 2) + ","
    	                       	  	     + dataInStep[lenDataInStep - 1]["place"]["y"] + ")";
    	                       })
    }

    // draw each nodeRect
    lenDataInStep = dataInStep.length;
    var len;
    var node;
    for(var i =0; i< lenDataInStep; i++)
    {
        len = dataInStep[i]["nodes"].length;
        for(var j =0; j< len; j++)
        {
    		    node = dataInStep[i]["nodes"][j]["id"];
            if(nodeSet[node] != undefined)
            {
                self.matrixWaveNodeRect[i]
                    .append("g")
                    .datum(dataInStep[i]["nodes"][j])
                    .attr("class", "nodeRect" + i + " " + dataInStep[i]["nodes"][j]["id"])
                    .attr("transform", function(){
                      var x, y;
                      if(i % 2 == 0)
                      {
                        x = -(self.textRectWidth + dataInStep[i]["nodes"][j]["nodeRectWidth"]);
                        y = self.rect * dataInStep[i]["nodes"][j]["orderIndex"];
                        x = x + dataInStep[i]["nodes"][j]["nodeRectWidth"];
                      }
                      else
                      {
                        x = self.rect * dataInStep[i]["nodes"][j]["orderIndex"];
                        y = -(self.textRectWidth + dataInStep[i]["nodes"][j]["nodeRectWidth"]);
                        y = y + dataInStep[i]["nodes"][j]["nodeRectWidth"];
                      }
                      return "translate(" + x + "," + y + ")";
                    });
                    
              self.matrixWaveNodeRect[i].select("g." + dataInStep[i]["nodes"][j]["id"])
                    .append("rect")
                    .datum(dataInStep[i]["nodes"][j])
                    .attr("class", "rect" + i + " " + dataInStep[i]["nodes"][j]["id"])
                    .attr("x", function(){
                       if(i % 2 == 0)
                       {
                          return -dataInStep[i]["nodes"][j]["nodeRectWidth"];
                       }
                       else
                       {
                         return 0;
                       }
                    })
                    .attr("y", function(){
                       if(i%2 == 1)
                       {
                          return -dataInStep[i]["nodes"][j]["nodeRectWidth"];
                       }
                       else
                       {
                         return 0;
                       }
                    })
                    .attr("width", function(d_data, i_data){
                      if(i % 2 == 0)
                      {
                        return dataInStep[i]["nodes"][j]["nodeRectWidth"] * 2;
                      }
                      else
                      {
                        return self.rect;
                      }
                    })
                    .attr("height", function(d_data, i_data){
                      if(i % 2 == 0)
                      {
                        return self.rect;
                      }
                      else
                      {
                        return dataInStep[i]["nodes"][j]["nodeRectWidth"] * 2;
                      }
                    })
                    .attr("fill", function(d_data, i_data){
                      return dataInStep[i]["nodes"][j]["nodeRectColor"];
                    })
                    .attr("stroke", "black");
              self.matrixWaveNodeRect[i].select("g." + dataInStep[i]["nodes"][j]["id"])
                  .call(self.nodeTip)
                    .on("mouseover", function(){
                       
                       var index;
                       var p;
                       var id;
                       var idPlace;
                       index = d3.select(this).attr("class");
                       p = index.indexOf(" ");
                       id = index.substring(p+1);
                       
                       index = index.substring(p-1, p);
                       idPlace = self.findIdIndex(index, id);
                       d_data = dataInStep[index]["nodes"][idPlace];
                       self.nodeTip.show(d_data);
                       self.nodeHoverHighlight(id, index);
                    })
                    .on("mouseout", function(){
                      var index;
                       var p;
                       var id;
                       var idPlace;
                       index = d3.select(this).attr("class");
                       p = index.indexOf(" ");
                       id = index.substring(p+1);
                       
                       index = index.substring(p-1, p);
                       idPlace = self.findIdIndex(index, id);
                       d_data = dataInStep[index]["nodes"][idPlace];
                      self.nodeTip.hide(d_data);
                      self.nodeHoverOut(d_data["id"]);
                    })
                    .on("click", function(){
                       var index;
                       var p;
                       var id;
                       var idPlace;
                       index = d3.select(this).attr("class");
                       p = index.indexOf(" ");
                       id = index.substring(p+1);
                       
                       index = index.substring(p-1, p);
                       idPlace = self.findIdIndex(index, id);
                       d_data = dataInStep[index]["nodes"][idPlace];
                       console.log("select the node: " + d_data["id"] + " step: " + index);
                       self.nodeClick(d_data["id"], index);
                    });  
            }    
        }
    }

}

matrix.prototype.findIdIndex = function (step, id)
{
  var self = this;
  step = (+step);
  var len = dataInStep[step]["nodes"].length;
  for(var i =0; i< len; i++)
  {
    if(dataInStep[step]["nodes"][i]["id"] == id)
    {
       return i;
       break;
    }
  }
}

matrix.prototype.getNodeRectSize = function()
{
	var self = this;
	var lenDataInStep = dataInStep.length;
	var len;
	var size;
	var volumeA;
	var volumeB;
	for(var i =0; i< lenDataInStep; i++)
	{
		len = dataInStep[i]["nodes"].length;
		for(var j =0; j< len; j++)
		{
           dataInStep[i]["nodes"][j]["volume"]["setA"] = (+dataInStep[i]["nodes"][j]["volume"]["setA"]);
           volumeA = dataInStep[i]["nodes"][j]["volume"]["setA"];
           dataInStep[i]["nodes"][j]["volume"]["setB"] = (+dataInStep[i]["nodes"][j]["volume"]["setB"]);
           volumeB = dataInStep[i]["nodes"][j]["volume"]["setB"];
           size = (volumeA + volumeB)/2;
           dataInStep[i]["nodes"][j]["nodeRectWidth"] = self.nodeScale(size);
           size = (volumeA - volumeB)/(volumeA + volumeB);
           size = size.toFixed(1);
           size = size * 10;
           if(size%2 != 0)
           {
           	  size = size + 1;
           }
           size = size /10;
           size = size.toFixed(1);
           dataInStep[i]["nodes"][j]["nodeRectColor"] = colorSelected["selection"][size];
           dataInStep[i]["nodes"][j]["nodeRectColorSize"] = size;
		}
	}
}

//draw step circle label
matrix.prototype.drawStepCircleLabel = function ()
{
   var self = this;
   var len = self.matrixWaveNodeRect.length;
   for(var i =0; i<len; i ++)
   {
      self.matrixWaveNodeRect[i].append("g")
          .attr("class", "stepIndexCircle stepIndex" + dataInStep[i]["stepIndex"])
          .attr("id", "stepIndex" + dataInStep[i]["stepIndex"])
          .attr("stepIndex", dataInStep[i]["stepIndex"])
          .attr("transform", function(){
             if( i%2 == 0)
             {
                return "translate(" + (-self.textRectWidth) + "," + (-self.stepCircleSize) + ")"; 
             }
             else
             {
                return "translate(" + (-self.stepCircleSize) + "," + (-self.textRectWidth) + ')';
             }
          })
          .attr("cursor", "pointer")
          .append("circle")
          .attr("x", 0)
          .attr("y", 0)
          .attr("r", self.stepCircleSize)
          .attr("stroke", "black")
          .attr("fill", "white");
      self.matrixWaveNodeRect[i].select("#stepIndex" + dataInStep[i]["stepIndex"])
          .append("text")
          .attr("transform", function(){
             return "translate(" + (-self.stepCircleSize * 0.3) + "," + (self.stepCircleSize * 0.32) + ")"; 
          })
          .text(dataInStep[i]["stepIndex"])
          .attr("font-size", function(){
              return self.stepCircleSize * 0.9 + "px";
          });

      $("#stepIndex" + dataInStep[i]["stepIndex"]).click(function(event){
           if(event.shiftKey == false)
           {
              var stepSelected = d3.select(this).attr("stepIndex");
                  stepSelected = (+stepSelected);
               if(unshowDataStep[stepSelected + 1] == undefined)
               {
                   alert("This is the last step!");
               }
               else
               {
                  if(unshowDataStep[stepSelected + 1] == false)
                  {
                     alert ("The next step has been showed!");
                  }
                  else
                  {
                     unshowDataStep[stepSelected + 1] = false;
                    if((stepSelected + 1) > filterFactor["step2"])
                     {
                       filterFactor["step2"] = stepSelected + 1;
                     }
                     getShowData('update');
                     setBar(0);
                  }
               }
           }
           else
           {
              var stepSelected = d3.select(this).attr("stepIndex");
                  stepSelected = (+stepSelected);
               var num = 0;
               for(var i =1; i< unshowDataStep.length; i++)
               {
                  if(unshowDataStep[i] == false)
                  {
                     num ++;
                  }
               }
              if(num > 2)
              {
                 unshowDataStep[stepSelected] = true;
                  if(stepSelected == filterFactor["step1"])
                  { 
                     while(unshowDataStep[stepSelected + 1] == true && unshowDataStep[stepSelected + 1] != undefined)
                     {
                        stepSelected ++;
                     }
                     if(unshowDataStep[stepSelected + 1] != undefined && unshowDataStep[stepSelected + 1] == false)
                     {
                       filterFactor["step1"] = stepSelected + 1;
                     }
                  }
                  else
                  {
                    if(stepSelected == filterFactor["step2"])
                    { 
                       while(unshowDataStep[stepSelected -1] == true && unshowDataStep[stepSelected - 1] != undefined)
                       {
                          stepSelected --;
                       }
                       if(unshowDataStep[stepSelected - 1] != undefined && unshowDataStep[stepSelected - 1] == false)
                       {
                          filterFactor["step2"] = stepSelected -1;
                       }
                    }
                  }
                  getShowData('update');
                  setBar(0);
              }
              else
              {
                 alert("Can`t delete the steps!")
              }
           }
      })
   }
}

matrix.prototype.updateLabel = function ()
{
  var self = this;
  self.getNodeScale();
  self.getLinkScale();
  document.getElementById(self.nodeMaxText).innerHTML = self.nodeVolumeMax;
  document.getElementById(self.linkMaxText).innerHTML = self.linkVolumeMax;
}

matrix.prototype.updateLayout = function ()
{
  var self = this;

    self.gMatrixWave.selectAll('g').remove();

    self.updateLabel();
    self.getStepPlace();
    self.getNodeRectSize();
    self.drawMatrixWave();
}


