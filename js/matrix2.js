matrix.prototype.orderSelectionChange = function (value)
{
	var self = this;
	self.orderSelection = value;
	if(value == "alphabetion")
	{
		console.log(value);
		self.orderValueAlpha();
	}
	if(value == "volume")
	{
		console.log(value);
		self.orderValueVolume();
	}
	if(value == "difference")
	{
		console.log(value);
		self.orderValueDifference();
	}
    if(value == "any")
    {
    	console.log(value);
    	self.orderValueAny();
    }
	self.orderUpdateNodeRect();
	self.orderUpdateNodeLabel();
	self.orderUpdateMatrixRect();
}

matrix.prototype.orderValueAlpha = function ()
{
	var self = this;
	var len = dataInStep.length;
	for(var i =0; i< len; i++)
	{
		self.alphaOrder(dataInStep[i]["nodes"]);
	}

}

matrix.prototype.orderValueDifference = function()
{
	var self = this;
	var len = dataInStep.length;
	for(var i= 0; i< len; i++)
	{
		self.differenceOrder(dataInStep[i]["nodes"]);
	}
}

matrix.prototype.orderValueVolume = function ()
{
	var self = this;
	var len = dataInStep.length;
	for(var i =0; i< len; i++)
	{
		self.volumeOrder(dataInStep[i]["nodes"]);
	}
}

matrix.prototype.orderValueAny = function()
{
	var self = this;
	var len = dataInStep.length;
	for(var i =0; i < len; i++)
	{
		self.anyOrder(dataInStep[i]["nodes"]);
	}
}

matrix.prototype.alphaOrder = function (dataSet)
{
	var self = this;
    var len = dataSet.length;
    var obj;
    var keys;
    var keysLen;
    var node;
    var index = 0;
    for(var i =0; i< len; i++)
    {
    	for(var j =0; j< len - i - 1; j ++)
    	{
    		obj = {};
           if(dataSet[j]["id"] > dataSet[j + 1]["id"])
           {
                keys = Object.keys(dataSet[j]);
                keysLen = keys.length;
                for(var k =0; k < keysLen; k ++)
                {
                	obj[keys[k]] = dataSet[j][keys[k]];
                    dataSet[j][keys[k]] = dataSet[j + 1][keys[k]];
                    dataSet[j+1][keys[k]] = obj[keys[k]];
                }
           }
    	}
    }

    for(var i =0; i< len; i++)
    {
    	node = dataSet[i]["id"];
    	if(nodeSet[node] != undefined)
    	{
    		dataSet[i]["orderIndex"] = index;
    		index ++;
    	}
    }
}

matrix.prototype.volumeOrder = function (dataSet)
{
	var self = this;
	var len = dataSet.length;
	var obj;
	var keys;
	var keysLen;
	var node;
	var index = 0;

	for(var i=0; i< len; i++)
	{
		if(dataSet[i]["volume"]["sum"] == undefined)
		{
			dataSet[i]["volume"]["sum"] = dataSet[i]["volume"]["setA"] + dataSet[i]["volume"]["setB"];
		}
	}

	for(var i =0; i<len; i++)
	{
		for(var j =0; j< len- i -1; j++)
		{
			obj = {};
			if(dataSet[j]["volume"]["sum"] > dataSet[j+1]["volume"]["sum"])
			{
                keys = Object.keys(dataSet[j]);
                keysLen = keys.length;
                for(var k =0; k< keysLen; k++)
                {
                	obj[keys[k]] = dataSet[j][keys[k]];
                    dataSet[j][keys[k]] = dataSet[j+1][keys[k]];
                    dataSet[j+1][keys[k]] = obj[keys[k]];
                }
			}
		}
	}

	for(var i =0; i< len; i++)
	{
		node = dataSet[i]["id"];
		if(nodeSet[node] != undefined)
		{
			dataSet[i]["orderIndex"] = index;
			index ++;
		}
	}
}

matrix.prototype.differenceOrder = function (dataSet)
{
	var self = this;
	var len = dataSet.length;
	var obj;
	var keys;
	var keysLen;
	var node;
	var index = 0;

	for(var i =0; i< len; i++)
	{
		if(dataSet[i]["volume"]["absDifference"] == undefined)
		{
			dataSet[i]["volume"]["absDifference"] = Math.abs(dataSet[i]["volume"]["setA"] - dataSet[i]["volume"]["setB"]);
		}
	}

	for(var i =0; i< len; i++)
	{
		for(var j =0; j< len- i -1; j++)
		{
            obj = {};
            if(dataSet[j]["volume"]["absDifference"] > dataSet[j + 1]["volume"]["absDifference"])
            {
            	keys = Object.keys(dataSet[j]);
            	keysLen = keys.length;
            	for(var k =0; k<keysLen; k++)
            	{
            		obj[keys[k]] = dataSet[j][keys[k]];
            		dataSet[j][keys[k]] = dataSet[j+1][keys[k]];
            		dataSet[j+1][keys[k]] = obj[keys[k]];
            	}
            }
		}
	}

	for(var i =0; i< len; i++)
	{
		node = dataSet[i]["id"];
		if(nodeSet[node] != undefined)
		{
			dataSet[i]["orderIndex"] = index;
			index ++;
		}
	}
}

matrix.prototype.anyOrder = function (dataSet)
{
	var self = this;
	var len = dataSet.length;
	var obj;
	var keys;
	var keysLen;
	var index = 0;
	for(var i =0; i< len; i++)
	{
		dataSet[i]["firstIndex"] = (+dataSet[i]["firstIndex"]);
		if(dataSet[i]["firstIndex"] != i)
		{
			obj = {};
			for(var j =i +1; j< len; j++)
			{
				dataSet[j]["firstIndex"] = (+dataSet[j]["firstIndex"]);
				if(dataSet[j]["firstIndex"] == i)
				{
					keys = Object.keys(dataSet[j]);
					keysLen = keys.length;
					for(var k =0; k< keysLen; k++)
					{
						obj[keys[k]] = dataSet[i][keys[k]];
						dataSet[i][keys[k]] = dataSet[j][keys[k]];
						dataSet[j][keys[k]] = obj[keys[k]];
					}
					break;
				}
			}
		}
	}

	for(var i =0; i< len; i++)
	{
		node = dataSet[i]["id"];
		if(nodeSet[node] != undefined)
		{
			dataSet[i]["orderIndex"] = index;
			index ++;
		}
	}
}

matrix.prototype.orderUpdateNodeRect = function ()
{
	var self = this;
	var lenStep = dataInStep.length;
	var dataSet;
	var lenDataSet;
	for(var i = 0; i< lenStep; i++)
	{
         dataSet = dataInStep[i]["nodes"];
         lenDataSet = dataSet.length;
         for(var j =0; j< lenDataSet; j++)
         {
         	self.matrixWaveNodeRect[i].select("g." + dataSet[j]["id"])
         	    .transition()
         	    .duration(self.durationTime/3)
         	    .attr("transform", function(d_data, i_data){
         	    	var x, y;
         	    	if(i%2 == 0)
         	    	{
         	    		x = -(self.textRectWidth + dataSet[j]["nodeRectWidth"]);
         	    		y = self.rect * dataSet[j]["orderIndex"];
         	    		x = x + dataSet[j]["nodeRectWidth"];
         	    	}
         	    	else
         	    	{
         	    		x = self.rect * dataSet[j]["orderIndex"];
         	    		y = -(self.textRectWidth + dataSet[j]["nodeRectWidth"]);
         	    		y = y + dataSet[j]["nodeRectWidth"];
         	    	}
         	    	return "translate(" + x + "," + y + ")";
         	    }) 
         }
	}
}

matrix.prototype.orderUpdateNodeLabel = function ()
{
	var self = this;
	var lenStep = dataInStep.length;
	var dataSet;
	var lenDataSet;
	console.log("hello, order update node label!")
	for(var i =0; i< lenStep; i++)
	{
       dataSet = dataInStep[i]["nodes"];
       lenDataSet = dataSet.length;
       for(var j =0; j< lenDataSet; j++)
       {
       	  self.matrixWaveNodeLabel[i].select("g.gLabelNode" + dataSet[j]["id"])
       	      .transition()
         	  .duration(self.durationTime/3)
       	      .attr("transform", function(d_data, i_data){
		       	if(i%2 == 0)
		       	{
		       		return "translate(" + self.rect/2 + "," + ((+dataSet[j]["orderIndex"])*self.rect + self.rect/2) + ")";
		       	}
		       	if(i %2 == 1)
		       	{
		       		return "translate(" + ((+dataSet[j]["orderIndex"]) * self.rect + self.rect/2) + "," + self.rect/2 + ')';
		       	}
		       });
       }
	}
}

matrix.prototype.orderUpdateMatrixRect = function()
{
	var self = this;
	var lenStep = dataInStep.length - 1;
	var sourceSet;
	var targetSet;
	var lenSourceSet;
	var lenTargetSet;
	var node;
	var sourceNode;
	var targetNode;
	var edge;

	for(var i =0; i< lenStep; i++)
	{
		sourceSet = dataInStep[i]["nodes"];
		lenSourceSet = sourceSet.length;;
		targetSet = dataInStep[i+1]["nodes"];
		lenTargetSet = targetSet.length;
		if(i % 2 == 0)
		{
			for(var j =0; j< lenSourceSet; j++)
	     	{
				sourceNode = sourceSet[j]["id"];
				if(nodeSet[sourceNode] != undefined)
				{
					self.matrixWave[i].selectAll("g.s" + sourceSet[j]["id"])
					    .transition()
					    .delay(self.durationTime/3 )
					    .duration(self.durationTime/3)
					    .attr("transform", function(d_data, i_data){
					    	var place_str = d3.select(this).attr("transform");
					    	var place = self.getLinkPlace(place_str);
					    	return "translate(" + place["x"] + "," + self.rect * (+sourceSet[j]["orderIndex"]) + ")";
					    });
				}
		    }
		}
		if(i % 2 == 1)
		{
			for(var j =0; j<lenTargetSet; j++)
			{
				targetNode = targetSet[j]["id"];
				if(nodeSet[targetNode] != undefined)
				{
					self.matrixWave[i].selectAll("g.t" + targetSet[j]["id"])
					    .transition()
					    .delay(self.durationTime/3 )
					    .duration(self.durationTime/3)
					    .attr("transform", function(d_data, i_data){
					    	var place_str = d3.select(this).attr("transform");
					    	var place = self.getLinkPlace(place_str);
					    	return "translate(" + place["x"] + "," + self.rect * (+targetSet[j]["orderIndex"]) + ")";
					    })
				}
			}
		}
	}

	for(var i =0; i< lenStep; i++)
	{
		sourceSet = dataInStep[i]["nodes"];
		lenSourceSet = sourceSet.length;;
		targetSet = dataInStep[i+1]["nodes"];
		lenTargetSet = targetSet.length;
		if(i % 2 == 1)
		{
			for(var j =0; j< lenSourceSet; j++)
	     	{
			    for(var k =0; k < lenTargetSet; k ++)
			    {
			    	sourceNode = sourceSet[j]["id"];
			    	targetNode = targetSet[k]["id"];
			    	if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined)
			    	{
			    		self.matrixWave[i].select("g.step" + i + "s" + sourceSet[j]["id"] + "t" + targetSet[k]["id"])
				    	    .transition()
				    	    .delay(self.durationTime/3 * 2)
				    	    .duration(self.durationTime/3)
				    	    .attr("transform", function(d_data, i_data){
				    	    	return "translate(" + self.rect * (+sourceSet[j]["orderIndex"]) + "," + self.rect * (+targetSet[k]["orderIndex"]) + ")";
				    	    })
			    	}
			    }
		    }
		}
		if(i % 2 == 0)
		{
			for(var j =0; j<lenTargetSet; j++)
			{
				for(var k =0; k < lenSourceSet; k++)
				{
					sourceNode = sourceSet[k]["id"];
					targetNode = targetSet[j]["id"];
					if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined)
					{
						self.matrixWave[i].select("g.step" + i + "s" + sourceSet[k]["id"] + "t" + targetSet[j]["id"])
				    	    .transition()
				    	    .delay(self.durationTime/3 * 2)
				    	    .duration(self.durationTime/3)
				    	    .attr("transform", function(d_data, i_data){
				    	    	return "translate(" + self.rect * (+targetSet[j]["orderIndex"]) + "," + self.rect * (+sourceSet[k]["orderIndex"]) + ")";
				    	    })
					}
				}
			}
		}
	}
}


matrix.prototype.updateColor = function ()
{
	var self = this;
	self.updateNodeRectColor();
	self.updateMatrixColor();
	self.updateNodeLabelColor();
	self.updateLinkLabelColor();
}

matrix.prototype.updateNodeRectColor = function ()
{
	var self = this;
	var lenStep = dataInStep.length;
	var lenNodes;
	var colorSize;
	for(var i =0; i< lenStep; i++)
	{
		lenNodes = dataInStep[i]["nodes"].length;
        for(var j =0; j< lenNodes; j++)
        {
        	colorSize = dataInStep[i]["nodes"][j]["nodeRectColorSize"];

        	dataInStep[i]["nodes"][j]["nodeRectColor"] = colorSelected["selection"][colorSize];
        	self.matrixWaveNodeRect[i].select("rect.rect" + i + "." + dataInStep[i]["nodes"][j]["id"])
        	    .attr("fill", colorSelected["selection"][colorSize]);
        }
	}
}

matrix.prototype.updateMatrixColor = function ()
{
	var self = this;
	var lenStep = dataInStep.length;
	var lenEdegs;
	var colorSize;
	for(var i =0; i< lenStep; i++)
	{
		lenEdges = dataInStep[i]["edges"].length;
		for(var j =0; j< lenEdges; j++)
		{
			colorSize = dataInStep[i]["edges"][j]["colorSize"];
			dataInStep[i]["edges"][j]["color"] = colorSelected["selection"][colorSize];
			self.matrixWave[i].select("rect.step" + i + "s" + dataInStep[i]["edges"][j]["source"]
				                      +"t" + dataInStep[i]["edges"][j]["target"])
			    .attr("fill", colorSelected["selection"][colorSize]);
		}
	}
}

matrix.prototype.updateNodeLabelColor = function ()
{
	var self = this;
    var colorSize;
    var firstNum = -1.0;
    self.nodeColorLabel.gNodeColor.selectAll("rect")
        .attr("fill", function(d_data, i_data){
        	d_data = (+d_data);
        	colorSize = firstNum + d_data * 0.2;
        	colorSize = colorSize * 10;
        	colorSize = Math.round(colorSize);
        	colorSize = colorSize * 0.1;
        	colorSize = colorSize.toFixed(1);
        	return colorSelected["selection"][colorSize];
        })
}

matrix.prototype.updateLinkLabelColor = function ()
{
	var self = this;
	var colorSize;
	var firstNum = -1.0;
	self.linkColorLabel.gNodeColor.selectAll("rect")
	    .attr("fill", function (d_data, i_data){
	    	d_data = (+d_data);
        	colorSize = firstNum + d_data * 0.2;
        	colorSize = colorSize * 10;
        	colorSize = Math.round(colorSize);
        	colorSize = colorSize * 0.1;
        	colorSize = colorSize.toFixed(1);
        	return colorSelected["selection"][colorSize];
	    })
}

//input: node id
//output: make the related nodes in selectedElements
matrix.prototype.searchElement = function (value)
{
	console.log("searchElement: " + value);
	var self = this;
	var lenStep = dataInStep.length;
	var lenNodes;
	var nodes;
	for(var i =0; i < lenStep; i++)
	{
       nodes = dataInStep[i]["nodes"];
       lenNodes = nodes.length;
       for(var j =0; j< lenNodes; j++)
       {
       	  if(nodes[j]["id"] == value)
       	  {
       	  	 self.nodeClick(value, i);
       	  	 break;
       	  }
       } 
	}
}