//use the labelColor to show the color, use the attribute name if existed, if not, then use attribute id
matrix.prototype.drawMatrixWaveLabel = function()
{
	// console.log("drawLabel start")
	var self = this;
	self.matrixWaveNodeLabel = [];
	var lenStep = dataInStep.length;
	var lenNodes;
	for(var i =0; i< lenStep -1; i++)
	{
		self.matrixWaveNodeLabel[i] = self.gMatrixWave.append("g")
		    .datum(i)
		    .attr("class", "labelStep" + i )
		    .attr("transform", function(){
		    	if(i%2 == 0)
		    	{
		    		return "translate(" + (dataInStep[i]["place"]["x"] + dataInStep[i + 1]["nodes"].length * self.rect + self.rect * 0.3) + "," + dataInStep[i]["place"]["y"] + ")"; 
		    	}
		    	else
		    	{
		    		return "translate(" + dataInStep[i]["place"]["x"] + "," + (dataInStep[i]["place"]["y"] + dataInStep[i + 1]["nodes"].length * self.rect + self.rect * 0.3) + ")";
		    	}
		    });

        d3.select("g.labelStep" + i)
          .selectAll("g")
	       .data(dataInStep[i]["nodes"])
	       .enter()
	       .append("g")
	       .attr("class", function(d_data, i_data){
	       	 return "gLabelNode" + d_data["id"] + " " + d_data["id"];
	       })
	       .attr("transform", function(d_data, i_data){
	       	if(i%2 == 0)
	       	{
	       		return "translate(" + self.rect/2 + "," + ((+d_data["orderIndex"])*self.rect + self.rect/2) + ")";
	       	}
	       	if(i %2 == 1)
	       	{
	       		return "translate(" + ((+d_data["orderIndex"]) * self.rect + self.rect/2) + "," + self.rect/2 + ')';
	       	}
	       });

	    lenNodes = dataInStep[i]["nodes"].length;
	    for(var j =0; j< lenNodes; j++)
	    {
	    	d3.select("g.labelStep" + i)
	    	  .select(".gLabelNode" + dataInStep[i]["nodes"][j]["id"])
	    	  .append("circle")
	    	  .datum(dataInStep[i]["nodes"][j])
	    	  .attr("r", self.rect/2)
              .attr("x", 0)
              .attr("y", 0)
              .attr("fill", function(d_data, i_data){
              	return self.labelColor(d_data["id"]);
              });

            d3.select("g.labelStep" + i)
              .select(".gLabelNode" + dataInStep[i]["nodes"][j]["id"])
              .append("text")
              .datum(dataInStep[i]["nodes"][j])
              .text(function(d_data, i_data){
              	if(d_data["name"] != undefined)
              	{
              		return d_data["name"];
              	}
              	else
              	{
              		return d_data["id"];
              	}
              })
              .attr("transform", function(d_data, i_data){
              	if(i %2 == 0)
              	{
              		return "translate(" + self.rect*0.8 + "," + self.rect* 0.2 +")" ;
              	}
              	else
              	{
              		return "translate(" + (-self.rect * 0.2) + "," + self.rect *0.8 + ") rotate(90)";
              	}
              })
              .attr("font-size", function(d_data, i_data){
              	return self.rect/2 + "px";
              })
        }
	}
		self.matrixWaveNodeLabel[lenStep - 1] = self.gMatrixWave.append("g")
		    .datum(lenNodes- 1)
		    .attr("class", "labelStep" + (lenStep -1 ))
		    .attr("transform", function(){
		    	if(lenStep%2 == 1)
		    	{
		    		return "translate(" + ( dataInStep[lenStep - 2]["nodes"].length * self.rect + dataInStep[lenStep - 2]["place"]["x"] + self.textRectWidth * 1.8 + self.rect * 0.3) + "," + dataInStep[lenStep - 2]["place"]["y"] + ")"; 
		    	}
		    	else
		    	{
		    		return "translate(" + dataInStep[lenStep - 2]["place"]["x"] + "," + ( dataInStep[lenStep - 2]["place"]["y"] + dataInStep[lenStep - 2]["nodes"].length * self.rect + self.textRectWidth * 1.8 + self.rect * 0.3) + ")";
		    	}
		    });

        d3.select("g.labelStep" + (lenStep - 1))
          .selectAll("g")
	       .data(dataInStep[lenStep - 1]["nodes"])
	       .enter()
	       .append("g")
	       .attr("class", function(d_data, i_data){
	       	 return "gLabelNode" + d_data["id"] + " " + d_data["id"];
	       })
	       .attr("transform", function(d_data, i_data){
	       	if((lenStep -1 )%2 == 0)
	       	{
	       		return "translate(" + self.rect/2 + "," + ((+d_data["orderIndex"])*self.rect + self.rect/2) + ")";
	       	}
	       	if((lenStep - 1) %2 == 1)
	       	{
	       		return "translate(" + ((+d_data["orderIndex"]) * self.rect + self.rect/2) + "," + self.rect/2 + ')';
	       	}
	       });

	    lenNodes = dataInStep[lenStep - 1]["nodes"].length;
	    for(var j =0; j< lenNodes; j++)
	    {
	    	d3.select("g.labelStep" + (lenStep -1 ))
	    	  .select(".gLabelNode" + dataInStep[lenStep - 1]["nodes"][j]["id"])
	    	  .append("circle")
	    	  .datum(dataInStep[lenStep - 1]["nodes"][j])
	    	  .attr("r", self.rect/2)
              .attr("x", 0)
              .attr("y", 0)
              .attr("fill", function(d_data, i_data){
              	return self.labelColor(d_data["id"]);
              });

            d3.select("g.labelStep" + (lenStep - 1))
              .select(".gLabelNode" + dataInStep[lenStep -1 ]["nodes"][j]["id"])
              .append("text")
              .datum(dataInStep[lenStep - 1]["nodes"][j])
              .text(function(d_data, i_data){
              	if(d_data["name"] != undefined)
              	{
              		return d_data["name"];
              	}
              	else
              	{
              		return d_data["id"];
              	}
              })
              .attr("transform", function(d_data, i_data){
              	if(i %2 == 0)
              	{
              		return "translate(" + self.rect*0.8 + "," + self.rect* 0.2 +")" ;
              	}
              	else
              	{
              		return "translate(" + (-self.rect * 0.2) + "," + self.rect *0.8 + ") rotate(90)";
              	}
              })
              .attr("font-size", function(d_data, i_data){
              	return self.rect/2 + "px";
              })
        }

	// console.log("draw label end!")
}

//is show the matrixwave label?
matrix.prototype.isShowMatrixWaveLabel = function ()
{
	var self = this;
	var len = self.matrixWaveNodeLabel.length;
	if(iconPanel.icon["nodeLabelShow"] == false)
	{
        for(var i =0; i< len; i++)
        {
        	self.matrixWaveNodeLabel[i].classed("nodeLabelShow", false);
        	self.matrixWaveNodeLabel[i].classed("nodeLabelUnshow", true);
        }
	}
	else
	{
		for(var i =0; i< len; i++)
		{
			self.matrixWaveNodeLabel[i].classed("nodeLabelShow", true);
        	self.matrixWaveNodeLabel[i].classed("nodeLabelUnshow", false);
		}
	}
}

//is show the matrix grid ?
matrix.prototype.isShowMatrixGrid = function ()
{
	var self = this;
	if(iconPanel.icon["matrixGridShow"] == true)
	{
		self.svg.selectAll(".linkCell").classed("matrixGridShow", true);
	}
	else
	{
		self.svg.selectAll(".linkCell").classed("matrixGridShow", false);
	}
}