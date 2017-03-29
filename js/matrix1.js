//hover on the nodeRect, highlight related nodeRects and links
matrix.prototype.nodeHoverHighlight = function(nodeId, step)
{
	var self = this;
	    step = (+step);
	var setARelatedArr = nodeSet[nodeId]["event"]["setA"];
	var setALen = setARelatedArr.length;
	var setBRelatedArr = nodeSet[nodeId]["event"]["setB"];
	var setBLen = setBRelatedArr.length;
	var index;
	var sequence;
	var name;

	if(self.svg.selectAll("rect.unselected")[0].length == 0 )
	{
		self.svg.selectAll("rect").classed("unselected", "true");
	}

	for(var i =0; i< setALen; i++)
	{
        index = setARelatedArr[i];
        index = (+index);
        sequence = datasetA[index]["sequence"];
        if(sequence[step] == nodeId)
        {
		    self.rectHighLighting(sequence);
        }
	}

	for(var i =0; i< setBLen; i++)
	{
        index = setBRelatedArr[i];
        index = (+index);
        sequence = datasetB[index]["sequence"];
        if(sequence[step] == nodeId)
        {
	        self.rectHighLighting(sequence);
        }
	}
}

matrix.prototype.nodeHoverOut = function()
{
	var self = this;
	self.svg.selectAll("rect").classed("unselected", false);

	//but the click selected elements should be highlight.
	self.elementsHighlighting();
}

matrix.prototype.linkHoverHighlight = function (sourceId, targetId, step)
{
	var self = this;
	    step = (+step);
	var step1 = step;
	var step2 = step + 1;
	var linkId = sourceId + targetId;

	var setAEventArr = edgeSet[linkId]["event"]["setA"];
    var setBEventArr = edgeSet[linkId]["event"]["setB"];
    var setALen = setAEventArr.length;
    var setBLen = setBEventArr.length;
    var index;
    var name;
    var sequence;
    var sequenceLen;

    /*self.svg.selectAll("rect").classed("unselected", true);
    //the selected elements should be highlight.
    self.elementsHighlighting();*/
    if(self.svg.selectAll("rect.unselected")[0].length == 0)
    {
    	self.svg.selectAll("rect").classed("unselected", true)
    }

    for(var i =0; i< setALen; i++)
    {
        index = setAEventArr[i];
        index = (+index);
        sequence = datasetA[index]["sequence"];
        if(sequence[step1] == sourceId && sequence[step2] == targetId)
        {
        	sequenceLen = sequence.length;
	        for(var j =0; j< sequenceLen - 1; j++)
	        {
	        	self.matrixWaveNodeRect[j].select("rect." + sequence[j])
	        	                          .classed("unselected", false);
	            name = name = "step" + j + "s" + sequence[j] + "t" + sequence[j+1];
	            self.matrixWave[j].select("rect." + name)
	                              .classed("unselected", false);
	            name = "rectInRect" + name;
	            self.matrixWave[j].select("rect." + name)
	                              .classed("unselected", false);
	        }
	        self.matrixWaveNodeRect[sequenceLen - 1].select("rect." + sequence[sequenceLen - 1])
	                                                .classed("unselected", false);
        }
     }

     for(var i =0; i< setBLen; i++)
    {
        index = setBEventArr[i];
        index = (+index);
        sequence = datasetB[index]["sequence"];
        if(sequence[step1] == sourceId && sequence[step2] == targetId)
        {
        	sequenceLen = sequence.length;
	        for(var j =0; j< sequenceLen - 1; j++)
	        {
	        	self.matrixWaveNodeRect[j].select("rect." + sequence[j])
	        	                          .classed("unselected", false);
	            name = name = "step" + j + "s" + sequence[j] + "t" + sequence[j+1];
	            self.matrixWave[j].select("rect." + name)
	                              .classed("unselected", false);
	            name = "rectInRect" + name;
	            self.matrixWave[j].select("rect." + name)
	                              .classed("unselected", false);
	        }
	        self.matrixWaveNodeRect[sequenceLen - 1].select("rect." + sequence[sequenceLen - 1])
	                                                .classed("unselected", false);
        }
     }
}

matrix.prototype.linkHoverOut = function ()
{
	var self = this;
	self.svg.selectAll("rect").classed("unselected", false);

	//but the click selected elements should be highlight.
	self.elementsHighlighting();
}

matrix.prototype.nodeClick = function(nodeId, step)
{
	var self = this;
	    step = (+step);
	var len = self.selectedElements["elements"].length;
	var i;
	for( i =0; i< len; i++)
	{
		//The node has been selected, now delete it
		if(self.selectedElements["elements"][i]["id"] == nodeId && self.selectedElements["elements"][i]["step"] == step)
		{
            self.nodeUnselectDelHighlight(nodeId, step);
            break;
		}
	}
	//The node has not been selected, now select it
	if(i == len)
	{
       self.nodeSelectHighlight(nodeId, step);
	}

	self.drawEventPath();
    console.log("relatedElementsNodeVis");
    if(iconPanel["specificVolumeShow"] == true || relatedElementsVis["node"] == true)
    {
        console.log("hello, here");
       self.drawRelatedNode();
    }
    if(iconPanel["specificVolumeShow"]== true || relatedElementsVis["link"] == true)
    {
        self.drawRelatedLink();
    }
}

matrix.prototype.linkClick = function(sourceId, targetId, step)
{
	var self = this;
	    step = (+step);
	var len = self.selectedElements["elements"].length;
	var i;
	for(i =0; i<len; i++)
	{
		if(self.selectedElements["elements"][i]["sourceId"] == sourceId
			&& self.selectedElements["elements"][i]["targetId"] == targetId
			&& self.selectedElements["elements"][i]["step"] == step)
		{
			self.linkUnselectDelHighlight(sourceId, targetId, step);
			break;
		}
	}
	if( i == len)
	{
		self.linkSelectHighlight(sourceId, targetId, step);
	}

	self.drawEventPath();
    if(iconPanel["specificVolumeShow"] == true || relatedElementsVis["node"] == true)
    {
       self.drawRelatedNode();
    }
    if(iconPanel["specificVolumeShow"] == true || relatedElementsVis["link"] == true)
    {
        self.drawRelatedLink();
    }
}

matrix.prototype.selectNode = function(nodeId, step)
{
    var self = this;
    var obj = {};
    var relatedArrInSetA;
    var relatedArrInSetB;
    var id;
    var indexInSame = {};
    step = (+step);
    indexInSame["setA"] = [];
    indexInSame["setB"] = [];
    obj["type"] = "node";
    obj["id"] = nodeId;
    obj["step"] = step;
    obj["volume"] = {};
    obj["volume"]["setA"] = 0;
    obj["volume"]["setB"] = 0;
    obj["volume"]["sum"] = 0;
    self.selectedElements["elements"].push(obj);
    self.setStrokeColor(obj);
    relatedArrInSetA = self.getNodeEvents(nodeSet[nodeId]["event"]["setA"], nodeId, step, "A");
    relatedArrInSetB = self.getNodeEvents(nodeSet[nodeId]["event"]["setB"], nodeId, step, "B");

    //there is no any anthor selected elements except nodeId.
    if(self.selectedElements["elements"].length == 1)
    {
    	for(var i =0; i<relatedArrInSetA.length; i++)
    	{
    		// console.log("A:" + relatedArrInSetA[i]);
    		relatedArrInSetA[i] = (+relatedArrInSetA[i]);
    		self.selectedElements["eventInSetA"].push(relatedArrInSetA[i]);
            /*self.selectedElements["elements"][0]["volume"]["setA"] += datasetA[relatedArrInSetA[i]]["volume"];*/
    		self.setElementsInSelection(datasetA[relatedArrInSetA[i]], "A");
    	}
    	for(var j =0; j < relatedArrInSetB.length; j++)
    	{
    		/*console.log("B:" + relatedArrInSetB[j]);*/
    		relatedArrInSetB[j] = (+relatedArrInSetB[j]);
    		self.selectedElements["eventInSetB"].push(relatedArrInSetB[j]);
            /*self.selectedElements["elements"][0]["volume"]["setB"] += datasetB[relatedArrInSetB[i]]["volume"];*/
    		self.setElementsInSelection(datasetB[relatedArrInSetB[j]], "B");
    	}
    }
    //There are some other selected elements
    else
    {
    	indexInSame["setA"] = [];
    	for(var i =0; i < relatedArrInSetA.length; i++)
    	{
    		relatedArrInSetA[i] = (+relatedArrInSetA[i]);
    		for(var k =0; k < self.selectedElements["eventInSetA"].length; k ++)
    		{
    			if(self.selectedElements["eventInSetA"][k] == relatedArrInSetA[i])
    			{
                    indexInSame["setA"].push(relatedArrInSetA[i]);
    			}
    		}
    	}
    	indexInSame["setB"] = [];
    	for(var j= 0; j< relatedArrInSetB.length; j ++)
    	{
    		relatedArrInSetB[j] = (+relatedArrInSetB[j]);
    		for(var k =0; k < self.selectedElements["eventInSetB"].length; k++)
    		{
    			if(self.selectedElements["eventInSetB"][k] == relatedArrInSetB[j])
    			{
                    indexInSame["setB"].push(relatedArrInSetB[j]);
    			}
    		}
    	}
    	self.selectedElements["eventInSetA"] = [];
    	self.selectedElements["eventInSetB"] = [];
    	self.selectedElements["relatedNode"] = {};
    	self.selectedElements["relatedLink"] = {};
        self.unselectDelHighlight();
    	for(var i =0; i< indexInSame["setA"].length; i++)
    	{
    		self.selectedElements["eventInSetA"].push(indexInSame["setA"][i])
    		self.setElementsInSelection(datasetA[indexInSame["setA"][i]], "A");
    	}
    	for(var j =0; j < indexInSame["setB"].length; j++)
    	{
    		self.selectedElements["eventInSetB"].push(indexInSame["setB"][j]);
    		self.setElementsInSelection(datasetB[indexInSame["setB"][j]], "B");
    	}
    }
    /*self.getSelectedElementsMessage();*/
    self.getRelatededElementsMessage();
}

//Get the related event in set(A/B).
//The function returns an array with related index in dataSet.
matrix.prototype.getNodeEvents = function(dataSet, nodeId, step, type)
{
    var self = this;
    step = (+step);
    var relatedArr = [];
    var relatedEventArr = dataSet;
    var len = relatedEventArr.length;
    var index;
    for(var i= 0; i< len; i++)
    {
    	index = relatedEventArr[i];
    	index = (+index);
    	if(type == "A" || type == "a")
    	{
    		if(datasetA[index]["sequence"][step] == nodeId)
	    	{
	            relatedArr.push(index);
	    	}
    	}
    	else
    	{
    		if(type == "B" || type == "b")
    		{
    			if(datasetB[index]["sequence"][step] == nodeId)
    			{
    				relatedArr.push(index);
    			}
    		}
    	}
    }
    return relatedArr;
}

//Set the related nodes and links
//type == A, means SetA. type == B, means SetB;
matrix.prototype.setElementsInSelection = function(dataSet, type)
{
	var self = this;
	var len = dataSet["sequence"].length;
	var id;
	var node;
	var sourceNode;
	var targetNode;
	var edge;
	//related node
	for(var i =0; i< len; i++)
	{
		node = dataSet["sequence"][i];
		if(nodeSet[node] != undefined)
		{
			id = "step" + i + "id" + dataSet["sequence"][i];  //e.g. step0idA;
			if(self.selectedElements["relatedNode"][id] == undefined)
			{
				self.selectedElements["relatedNode"][id] = {};
				self.selectedElements["relatedNode"][id]["id"] = dataSet["sequence"][i];
				self.selectedElements["relatedNode"][id]["step"] = i;
				self.selectedElements["relatedNode"][id]["volume"] = {};
				self.selectedElements["relatedNode"][id]["volume"]["setA"] = 0;
				self.selectedElements["relatedNode"][id]["volume"]["setB"] = 0;
				self.selectedElements["relatedNode"][id]["volume"]["sum"] = 0;
			}
			if(type == "A" || type == "a")
			{
				self.selectedElements["relatedNode"][id]["volume"]["setA"] += dataSet["volume"]; 
			}
			if(type == "B" || type == "b")
			{
				self.selectedElements["relatedNode"][id]["volume"]["setB"] += dataSet["volume"];
			}
			self.selectedElements["relatedNode"][id]["volume"]["sum"] += dataSet["volume"];
		}
	}
   // related link
   for(var i =0; i< len- 1; i ++)
   {
   	  sourceNode = dataSet["sequence"][i];
   	  targetNode = dataSet["sequence"][i + 1];
   	  edge = sourceNode + targetNode;
   	  if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined && edgeSet[edge] != undefined)
   	  {
   	  	 id = "step" + i + "id" + dataSet["sequence"][i] + dataSet["sequence"][i + 1];
	   	  if(self.selectedElements["relatedLink"][id] == undefined)
	   	  {
	   	  	 self.selectedElements["relatedLink"][id] = {};
	   	  	 self.selectedElements["relatedLink"][id]["step"] = i;
	   	  	 self.selectedElements["relatedLink"][id]["sourceId"] = dataSet["sequence"][i];
	   	  	 self.selectedElements["relatedLink"][id]["targetId"] = dataSet["sequence"][i + 1];
	   	  	 self.selectedElements["relatedLink"][id]["volume"] = {};
	   	  	 self.selectedElements["relatedLink"][id]["volume"]["setA"] = 0;
	   	  	 self.selectedElements["relatedLink"][id]["volume"]["setB"] = 0;
	   	  	 self.selectedElements["relatedLink"][id]["volume"]["sum"] = 0;
	   	  }
	   	  if(type == "A" || type == "a")
	   	  {
	   	  	self.selectedElements["relatedLink"][id]["volume"]["setA"] += dataSet["volume"];
	   	  }
	   	  if(type == "B" || type == "b")
	   	  {
	   	  	self.selectedElements["relatedLink"][id]["volume"]["setB"] += dataSet["volume"];
	   	  }
	   	  self.selectedElements["relatedLink"][id]["volume"]["sum"] += dataSet["volume"];
   	  }
   }
}

matrix.prototype.selectLink = function(sourceId, targetId, step)
{
	var self = this;
    var obj = {};
    step = (+step);
    obj["type"] = "link";
    obj["sourceId"] = sourceId;
    obj["targetId"] = targetId;
    obj["step"] = step;
    obj["volume"] = {};
    obj["volume"]["setA"] = 0;
    obj["volume"]["setB"] = 0;
    obj["volume"]["sum"] = 0;
    self.selectedElements["elements"].push(obj);
    self.setStrokeColor(obj);
    var indexInSame = {};
        indexInSame["setA"] = [];
        indexInSame["setB"] = [];
    var relatedArrInSetA;
    var relatedArrInSetB;
    var linkId = sourceId  + targetId;
    console.log("linkId: " + linkId);
    relatedArrInSetA = self.getLinkEvents(edgeSet[linkId]["event"]["setA"],sourceId, targetId, step, "A");
    relatedArrInSetB = self.getLinkEvents(edgeSet[linkId]["event"]["setB"], sourceId, targetId, step, "B");
    //There is no any other selected element
    if(self.selectedElements["elements"].length == 1)
    {
    	for(var i =0; i < relatedArrInSetA.length; i++)
    	{
    		relatedArrInSetA[i] = (+relatedArrInSetA[i]);
    		self.selectedElements["eventInSetA"].push(relatedArrInSetA[i]);
            self.setElementsInSelection(datasetA[relatedArrInSetA[i]], "A");
    	}
    	for(var j =0; j < relatedArrInSetB.length; j++)
    	{
    		relatedArrInSetB[j] = (+relatedArrInSetB[j]);
    		self.selectedElements["eventInSetB"].push(relatedArrInSetB[j]);
    		self.setElementsInSelection(datasetB[relatedArrInSetB[j]], "B");
    	}
    }
     //There are some other selected elements
     else
     {
     	indexInSame["setA"] = [];
     	for(var i =0; i< relatedArrInSetA.length; i++)
     	{
     		relatedArrInSetA[i] = (+relatedArrInSetA[i]);
     		for(var k= 0; k < self.selectedElements["eventInSetA"].length; k ++)
     		{
                if(self.selectedElements["eventInSetA"][k] == relatedArrInSetA[i])
                {
                	indexInSame["setA"].push(relatedArrInSetA[i]);
                }
     		}
     	}
     	indexInSame["setB"] = [];
     	for(var j =0; j< relatedArrInSetB.length; j ++)
     	{
     		relatedArrInSetB[i] = (+relatedArrInSetB[i]);
     		for(var k =0; k< self.selectedElements["eventInSetB"].length; k++)
     		{
     			if(self.selectedElements["eventInSetB"][k] == relatedArrInSetB[j])
     			{
     				indexInSame["setB"].push(relatedArrInSetB[j]);
     			}
     		}
     	}
     	self.selectedElements["eventInSetA"] = [];
     	self.selectedElements["eventInSetB"] = [];
     	self.selectedElements["relatedNode"] = {};
     	self.selectedElements["relatedLink"] = {};
        self.unselectDelHighlight();
     	for(var i =0; i<indexInSame["setA"].length; i++)
     	{
     		self.selectedElements["eventInSetA"].push(indexInSame["setA"][i]);
     		self.setElementsInSelection(datasetA[indexInSame["setA"][i]], "A");
     	}
     	for(var j =0; j< indexInSame["setB"].length; j++)
     	{
     		self.selectedElements["eventInSetB"].push(indexInSame["setB"][j]);
     		self.setElementsInSelection(datasetB[indexInSame["setB"][j]], "B");
     	}
     }
     /*self.getSelectedElementsMessage();*/
     self.getRelatededElementsMessage();
}

//Get the events related with the selected link.
//The function would return an array.
matrix.prototype.getLinkEvents = function(dataSet, sourceId, targetId, step, type)
{
	var self = this;
        step = (+step);
    var relatedArr = [];
    var len = dataSet.length;
    var index;
    for(var i =0; i < len; i++)
    {
    	index = dataSet[i];
    	index = (+index);
    	if(type == "A" || type == "a")
    	{
    		if(datasetA[index]["sequence"][step] == sourceId && datasetA[index]["sequence"][step + 1] == targetId)
    		{
    			relatedArr.push(index);
    		}
    	}
    	if(type == "B" || type == "b")
    	{
    		if(datasetB[index]["sequence"][step] == sourceId && datasetB[index]["sequence"][step + 1] == targetId)
    		{
    			relatedArr.push(index);
    		}
    	}
    }
    return relatedArr;
}

matrix.prototype.nodeSelectHighlight = function (nodeId, step)
{
	var self = this;
	self.selectNode(nodeId, step);
	//High light related elements
	self.elementsHighlighting();
}

matrix.prototype.linkSelectHighlight = function(sourceId, targetId, step)
{
	var self = this;
	self.selectLink(sourceId, targetId, step);
	//High light related elements
	self.elementsHighlighting();
}

//In selection, high light related elements
matrix.prototype.elementsHighlighting = function ()
{
   var self = this;
   var eventInSetA = self.selectedElements["eventInSetA"];
   var eventInSetALen = eventInSetA.length;
   var eventInSetB = self.selectedElements["eventInSetB"];
   var eventInSetBLen = eventInSetB.length;
   var selectedElements = self.selectedElements["elements"];
   var selectedElementsLen = selectedElements.length;
   var step;
   var type;
   var name;

   if(self.selectedElements["elements"].length == 0)
   {
   	  self.svg.selectAll("rect").classed("unselected", false);
   }
   else
   {
	   	//set all the elements with class unselected
	   self.svg.selectAll("rect").classed("unselected", true);
	   //deal with the related event in set A
	   for(var i =0; i< eventInSetALen; i++)
	   {
	   	  eventInSetA[i] = (+eventInSetA[i]);
	   	  self.rectHighLighting(datasetA[eventInSetA[i]]["sequence"]);
	   }
	   //deal with th related event in set B
	   for(var i =0; i < eventInSetBLen; i++)
	   {
	   	 eventInSetB[i] = (+eventInSetB[i]);
	   	 self.rectHighLighting(datasetB[eventInSetB[i]]["sequence"]);
	   }
	   //highlight the selected elements
	   for(var i =0; i< selectedElementsLen; i++)
	   {
	   	    step = selectedElements[i]["step"];
	   	    step = (+step);
	   	    type = selectedElements[i]["type"];
	       if(type == "node")
	       {
	       		self.matrixWaveNodeRect[step].selectAll("rect." + selectedElements[i]["id"])
	       		                             .classed("unselected", false);
	       }
	       if(type == "link")
	       {
	       	   name = "step" + step + "s" + selectedElements[i]["sourceId"] + "t" + selectedElements[i]["targetId"];
	       	   self.matrixWave[step].selectAll("rect." + name)
	       	                        .classed("unselected", false);
	       	   name = "rectInRect" + name;
	       	   self.matrixWave[step].selectAll("rect." + name)
	       	                        .classed("unselected", false);
	       }
	   }
   }

}

//A inner function of function elementsHighlighting.
matrix.prototype.rectHighLighting = function (sequence)
{
	var self = this;
	var sequenceLen = sequence.length;
	var node;
	var sourceNode;
	var targetNode;
	var edge;
	for(var j =0; j< sequenceLen -1; j++)
    {
    	node = sequence[j];
    	if(nodeSet[node] != undefined)
    	{
    		self.matrixWaveNodeRect[j].selectAll("rect." + sequence[j])
    	                          .classed("unselected", false);
    	}

    	sourceNode = sequence[j];
    	targetNode = sequence[j+1];
    	edge = sourceNode + targetNode;
    	if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined && edgeSet[edge] != undefined)
    	{
    		name = "step" + j + "s" + sequence[j] + "t" + sequence[j+1];
	        self.matrixWave[j].selectAll("rect." + name)
	                          .classed("unselected", false);
	        name = "rectInRect" + name;
	        self.matrixWave[j].selectAll("rect." + name)
	                          .classed("unselected", false);
    	}
    }
    node = sequence[sequenceLen - 1];
    if(nodeSet[node] != undefined)
    {
    	self.matrixWaveNodeRect[sequenceLen - 1].selectAll("rect." + sequence[sequenceLen - 1])
    									    .classed("unselected", false);
    }
}

matrix.prototype.unselectDelHighlight = function (nodeId, step)
{
	var self = this;
	//delete all highlighting
	self.svg.selectAll("rect").classed("unselected", false);
    self.removeRelatedNodeVis();
    self.removeRelatedLinkVis();
	//highlight the exist selected elements
	self.elementsHighlighting();
}

//delete the unselected node in selectedElements
matrix.prototype.nodeUnselectDelHighlight = function (nodeId, step)
{
    var self = this;
        step = (+step);
    var selectedElementsArr = [];
    var selectedElementsLen = self.selectedElements["elements"].length;
    var obj;

    for(var i =0; i< selectedElementsLen; i++)
    {
    	obj = {};
    	obj["step"] = self.selectedElements["elements"][i]["step"];
        obj["type"] = self.selectedElements["elements"][i]["type"];
        if(self.selectedElements["elements"][i]["type"] == "node")
        {
            if(self.selectedElements["elements"][i]["id"] != nodeId || self.selectedElements["elements"][i]["step"] != step)
            {
            	obj["id"] = self.selectedElements["elements"][i]["id"];
            	selectedElementsArr.push(obj);
            }
        }
        if(self.selectedElements["elements"][i]["type"] == "link")
        {
        	obj["sourceId"] = self.selectedElements["elements"][i]["sourceId"];
        	obj["targetId"] = self.selectedElements["elements"][i]["targetId"];
        	selectedElementsArr.push(obj);
        }
    }

    self.selectedElements["elements"] = [];
    self.selectedElements["eventInSetA"] = [];
    self.selectedElements["eventInSetB"] = [];
    self.selectedElements["relatedNode"] = {};
    self.selectedElements["relatedLink"] = {};
    self.svg.selectAll("rect").classed("clickStrokeColor", false);
    for(var i =0; i < selectedElementsArr.length; i++)
    {
    	if(selectedElementsArr[i]["type"] == "node")
    	{
    		self.selectNode(selectedElementsArr[i]["id"], selectedElementsArr[i]["step"]);
    	}
    	if(selectedElementsArr[i]["type"] == "link")
    	{
    		self.selectLink(selectedElementsArr[i]["sourceId"], selectedElementsArr[i]["targetId"], selectedElementsArr[i]["step"]);
    	}
    }

    self.unselectDelHighlight();
}

//delete the unselected link in selectedElements
matrix.prototype.linkUnselectDelHighlight = function (sourceId, targetId, step)
{
	var self = this;
	step = (+step);
	var selectedElementsArr = [];
    var selectedElementsLen = self.selectedElements["elements"].length;
    var obj;

    for(var i =0; i< selectedElementsLen; i++)
    {
    	obj = {};
    	obj["step"] = self.selectedElements["elements"][i]["step"];
        obj["type"] = self.selectedElements["elements"][i]["type"];
        if(self.selectedElements["elements"][i]["type"] == "link")
        {
            if(self.selectedElements["elements"][i]["sourceId"] != sourceId 
            	|| self.selectedElements["elements"][i]["targetId"] != targetId
            	|| self.selectedElements["elements"][i]["step"] != step)
            {
            	obj["sourceId"] = self.selectedElements["elements"][i]["sourceId"];
            	obj["targetId"] = self.selectedElements["elements"][i]["targetId"];
            	selectedElementsArr.push(obj);
            }
        }
        if(self.selectedElements["elements"][i]["type"] == "node")
        {
        	obj["id"] = self.selectedElements["elements"][i]["id"];
        	selectedElementsArr.push(obj);
        }
    }

    self.selectedElements["elements"] = [];
    self.selectedElements["eventInSetA"] = [];
    self.selectedElements["eventInSetB"] = [];
    self.selectedElements["relatedNode"] = {};
    self.selectedElements["relatedLink"] = {};
    self.svg.selectAll("rect").classed("clickStrokeColor", false);

    for(var i =0; i < selectedElementsArr.length; i++)
    {
    	if(selectedElementsArr[i]["type"] == "node")
    	{
    		self.selectNode(selectedElementsArr[i]["id"], selectedElementsArr[i]["step"]);
    	}
    	if(selectedElementsArr[i]["type"] == "link")
    	{
    		self.selectLink(selectedElementsArr[i]["sourceId"], selectedElementsArr[i]["targetId"], selectedElementsArr[i]["step"]);
    	}
    }

    self.unselectDelHighlight();
}

//set the selected elements with color yellow
matrix.prototype.setStrokeColor = function(dataObject)
{
	var self = this;
	var step;
	var name;
	var type;
    type = dataObject["type"];
    step = dataObject["step"];
    step = (+step);
    if(type == "node")
    {
    	name = dataObject["id"];
    	self.matrixWaveNodeRect[step].select("rect." + name)
    	                             .classed("clickStrokeColor", true);
    }
    if(type == "link")
    {
    	name = "step" + step + "s" + dataObject["sourceId"] + "t" + dataObject["targetId"];
    	self.matrixWave[step].select("rect." + name)
    	                     .classed("clickStrokeColor",true)
    }
}

matrix.prototype.delStrokeColor = function(dataObject)
{
	var self = this;
	var step;
	var name;
	var type;
	type = dataObject["type"];
	step = dataObject["step"];
	step = (+step);
	if(type == "node")
	{
		name = dataObject["id"];
		self.matrixWaveNodeRect[step].select("rect." + name)
		                             classed("clickStrokeColor", false);
	}
	if(type == "link")
	{
		name = "step" + step + "s" + dataObject["sourceId"] + "t" + dataObject["targetId"];
		self.matrixWave[step].select("rect." + name)
		                     .classed("clickStrokeColor", false);
	}
}

matrix.prototype.drawEventPath = function ()
{
	var self = this;
    var eventInSetA = self.selectedElements["eventInSetA"];
    var eventInSetALen = eventInSetA.length;
    var eventInSetB = self.selectedElements["eventInSetB"];
    var eventInSetBLen = eventInSetB.length;
    var name;
    var place_str;
    var place;
    self.svg.selectAll("g.clickSelected").remove();
    for(var i =0; i < eventInSetALen; i ++)
    {
    	eventInSetA[i] = (+eventInSetA[i]);
    	self.drawEventPathDetail(datasetA[eventInSetA[i]]["sequence"]);
    }
    for(var i =0; i< eventInSetBLen; i ++ )
    {
    	eventInSetB[i] = (+eventInSetB[i]);
    	self.drawEventPathDetail(datasetB[eventInSetB[i]]["sequence"]);
    }
}

matrix.prototype.drawEventPathDetail = function(dataSet)
{
	var self = this;
    var place_str;
    var place;
    var name;
    var len = dataSet.length;
    var sourceNode;
    var targetNode;
    var edge;

    for(var i =0; i< len -1; i++)
    {
    	sourceNode = dataSet[i];
    	targetNode = dataSet[i + 1];
    	edge = sourceNode + targetNode;
    	if(nodeSet[sourceNode] != undefined && nodeSet[targetNode] != undefined && edgeSet[edge] != undefined)
    	{
    	   name = "step" + i + "s" + dataSet[i] + "t" + dataSet[i+1];
	       place_str = self.matrixWave[i].select("g." + name)
	                                 .attr("transform");
	       place = self.getLinkPlace(place_str);
		    if(i%2 == 0)
	    	{
	           self.matrixWave[i].append("g")
	                             .attr("class", "clickSelected")
	                             .datum(place)
	                             .attr("transform", function(d_data, i_data){
	                             	return "translate(0, " + (place["y"] + self.rect/2) + ")";
	                             })
	                             .append("path")
	                             .attr("d", function(){
	                             	return "M 0 0 L " + (place["x"] )+ " 0";
	                             })
	                             .attr("stroke", "blue");
	           self.matrixWave[i].append("g")
	                             .attr("class", "clickSelected")
	                             .datum(place)
	                             .attr("transform", function(d_data, i_data){
	                             	return "translate(" + (place["x"] + self.rect/2) + ", " + (place["y"] + self.rect) + ")";
	                             })
	                             .append("path")
	                             .attr("d", function(){
	                             	return "M 0 0 L 0 " + (dataInStep[i]["rectHeight"] - place["y"] - self.rect);
	                             })
	                             .attr("stroke", "blue");
	    	}
	    	if(i%2 == 1)
	    	{
	            self.matrixWave[i].append("g")
	                              .attr("class", "clickSelected")
	                              .datum(place)
	                              .attr("transform", function(d_data, i_data){
	                              	return "translate(" + (place["x"] + self.rect/2) + " ,0)"; 
	                              })
	                              .append("path")
	                              .attr("d", function(){
	                              	return "M 0 0 L 0 " + (place["y"]);
	                              })
	                              .attr("stroke", "blue");
	            self.matrixWave[i].append("g")
	                              .attr("class", "clickSelected")
	                              .datum(place)
	                              .attr("transform", function(d_data, i_data){
	                              	return "translate(" + (place["x"] + self.rect) + " , " + (place["y"] + self.rect/2) +")";
	                              })
	                              .append("path")
	                              .attr("d", function(){
	                              	 return "M 0 0 L " + (dataInStep[i]["rectWidth"] - place["x"]-self.rect) + " 0";
	                              })
	                              .attr("stroke", "blue");
	    	}
    	}
    }
}

//get the element`s transform
matrix.prototype.getLinkPlace = function (place_str)
{
	var self = this;
	var place = {};
	var p1, p2, p3;
	p1 = place_str.indexOf("(");
	p2 = place_str.indexOf(",");
	p3 = place_str.indexOf(")");
	place["x"] = place_str.substring(p1+1, p2);
	place["y"] = place_str.substring(p2+1, p3);
	place["x"] = (+place["x"]);
	place["y"] = (+place["y"]);
	return place;
}

//get the selected elements`s message, such as volume, width, color and so on.
matrix.prototype.getRelatededElementsMessage = function ()
{
    var self = this;
    self.getRelatedNodesSizeAndColor();
    self.getRelatedLinksSizeAndColor();
}

//get related nodes`size and color
matrix.prototype.getRelatedNodesSizeAndColor = function ()
{
    var self = this;
    var keys = Object.keys(self.selectedElements["relatedNode"]);
    var lenKeys = keys.length;
    var volumeA;
    var volumeB;
    var size;
    for(var i =0; i< lenKeys; i++)
    {
       volumeA = self.selectedElements["relatedNode"][keys[i]]["volume"]["setA"];
       volumeB = self.selectedElements["relatedNode"][keys[i]]["volume"]["setB"];
       size = (volumeA + volumeB) /2;
       self.selectedElements["relatedNode"][keys[i]]["size"] = self.nodeScale(size);
       size = (volumeA - volumeB)/(volumeA + volumeB);
       size = size.toFixed(1);
       size = size * 10;
       if(size % 2 != 0)
       {
         size = size + 1;
       }
       size = size * 0.1;
       size = size.toFixed(1);
       self.selectedElements["relatedNode"][keys[i]]["color"] = colorSelected["selection"][size];
       self.selectedElements["relatedNode"][keys[i]]["colorSize"] = size;
    }
}

matrix.prototype.getRelatedLinksSizeAndColor = function ()
{
    var self = this;
    var keys = Object.keys(self.selectedElements["relatedLink"]);
    var lenKeys = keys.length;
    var size;
    var volumeA;
    var volumeB;
    for(var i =0; i< lenKeys; i++)
    {
        volumeA = self.selectedElements["relatedLink"][keys[i]]["volume"]["setA"];
        volumeB = self.selectedElements["relatedLink"][keys[i]]["volume"]["setB"];
        size = (volumeA + volumeB)/2;
        self.selectedElements["relatedLink"][keys[i]]["size"] = self.linkScale(size);
        size = (volumeA - volumeB)/(volumeA + volumeB);
        size = size.toFixed(1);
        size = size * 10;
        if(size % 2 != 0)
        {
          size = size + 1;
        }
        size = size * 0.1;
        size = size.toFixed(1);
        self.selectedElements["relatedLink"][keys[i]]["colorSize"] = size;
        self.selectedElements["relatedLink"][keys[i]]["color"] = colorSelected["selection"][size]; 
    }
}

matrix.prototype.drawRelatedNode = function ()
{
    var self = this;
    var keys = Object.keys(self.selectedElements["relatedNode"]);
    var lenKeys = keys.length;
    var step;
    var id;
    for(var i =0; i< lenKeys; i++)
    {
        step = self.selectedElements["relatedNode"][keys[i]]["step"];
        id = self.selectedElements["relatedNode"][keys[i]]["id"];
        self.matrixWaveNodeRect[step].select("g.nodeRect"+ step +"." + id)
            .append("rect")
            .attr("class", "rect" + step + " " + id + " smallRect")
            .attr("x", function(){
                if(step %2 == 0)
                {
                    return -self.selectedElements["relatedNode"][keys[i]]["size"]/2;
                }
                else
                {
                    return 0;
                }
            })
            .attr("y", function(){
                if(step%2 == 1)
                {
                    return -self.selectedElements["relatedNode"][keys[i]]["size"]/2;
                }
                else
                {}
            })
            .attr("width", function(){
                if(step %2 == 0)
                {
                    return self.selectedElements["relatedNode"][keys[i]]["size"];
                }
                else
                {
                    return self.rect;
                }
            })
            .attr("height", function(){
                if(step %2 == 0)
                {
                   return self.rect;
                }
                else
                {
                    return self.selectedElements["relatedNode"][keys[i]]["size"];
                }
            })
            .attr("fill", function(){
                var size = self.selectedElements["relatedNode"][keys[i]]["colorSize"];
                return colorSelected["selection"][size];
            })
            .attr("stroke", "black");
    }
}

matrix.prototype.drawRelatedLink = function ()
{
    var self = this;
    var keys = Object.keys(self.selectedElements["relatedLink"]);
    var lenKeys = keys.length;
    var step;
    var sourceId;
    var targetId;
    var name;
    for(var i =0; i< lenKeys; i ++)
    {
        step = self.selectedElements["relatedLink"][keys[i]]["step"];
        sourceId = self.selectedElements["relatedLink"][keys[i]]["sourceId"];
        targetId = self.selectedElements["relatedLink"][keys[i]]["targetId"];
        name = "step" + step + "s" + sourceId + "t" + targetId;
        self.matrixWave[step].select("g." + name)
            .append("path")
            .attr("class", name + " smallTriangle")
            .attr("d", function(){
                return "M 0 " + self.rect + " L "+ self.rect + " " + self.rect + " L "+ self.rect + " 0" + " L 0 " + self.rect;
            })
            .attr("fill", function(){
                return self.selectedElements["relatedLink"][keys[i]]["color"];
            })
            .attr("stroke", "white");
            /*.attr("stroke", "rgb(234, 233, 233)");*/

        self.matrixWave[step].select("g." + name)
            .append("path")
            .attr("class", "triInTri" + name + " smallTriangle")
            .attr("d", function(){
                var triSize = self.selectedElements["relatedLink"][keys[i]]["size"];
                return "M " + (self.rect/2 - triSize/2) + " " + (self.rect/2 + triSize/2) + " L" + (self.rect/2 + triSize/2) +" "
                       + (self.rect/2 + triSize/2) + " L " + (self.rect/2 + triSize/2) + " " + (self.rect/2 - triSize/2)
                       + " L " + (self.rect/2 - triSize/2) + " " + (self.rect/2 + triSize/2);
            })
            .attr("fill", self.rectFill);
    }
}

matrix.prototype.removeRelatedNodeVis = function ()
{
    var self = this;
    self.svg.selectAll(".smallRect").remove();
}

matrix.prototype.removeRelatedLinkVis = function ()
{
    var self = this;
    self.svg.selectAll(".smallTriangle").remove();
}


