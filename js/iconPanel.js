var iconpanel = function ()
{
    this.icon = {};
    this.icon["matrixGridShow"] = false;
    this.icon["nodeLabelShow"] = true;
    this.icon["specificVolumeShow"] = false;

    this.config();
    this.init();
}

iconpanel.prototype.config = function ()
{
	var self = this;
	var keys = Object.keys(self.icon);
	var lenKeys = keys.length;
	console.log("config")
	for(var i =0; i < lenKeys; i++)
	{
		if(self.icon[keys[i]] == false)
		{
			$(".btn-" + keys[i]).addClass("icon-unselected");
		}
		else
		{
			$(".btn-" + keys[i]).addClass("icon-selected");
		}
	}

}
iconpanel.prototype.init = function ()
{
	var self = this;
  $(".btn-pictureSave").addClass("icon-unselected");
   $(".btn-pictureSave").click(function(){
    console.log("save picture")
       saveSvgAsPng(document.getElementById("matrixwaveSvg"), "matrixwave.png");
   });
   
   $(".btn-matrixGridShow").click(function(){
   		if(self.icon.matrixGridShow == false)
   		{
   			self.icon.matrixGridShow = true;
   			$(".btn-matrixGridShow").removeClass("icon-unselected");
   			$(".btn-matrixGridShow").addClass("icon-selected");
   			console.log("you choose to show the matrix grid!");
        self.showMatrixGrid();
   		}
   		else
   		{
   			self.icon.matrixGridShow = false;
   			$(".btn-matrixGridShow").removeClass("icon-selected");
   			$(".btn-matrixGridShow").addClass("icon-unselected");
   			console.log("you choose not to show the matrix grid!");
        self.unshowMatrixGrid();
   		}
   });
   $(".btn-nodeLabelShow").click(function(){
   		if(self.icon.nodeLabelShow == false)
   		{
   			self.icon.nodeLabelShow = true;
   			$(".btn-nodeLabelShow").removeClass("icon-unselected");
   			$(".btn-nodeLabelShow").addClass("icon-selected");
   			console.log("you choose to show the node label!");
        self.showNodeLabel();
   		}
   		else
   		{
   			self.icon.nodeLabelShow = false;
   			$(".btn-nodeLabelShow").removeClass("icon-selected");
   			$(".btn-nodeLabelShow").addClass("icon-unselected");
   			console.log("you choose not to show the node label!");
        self.unshowNodeLabel();
   		}
   });
   $(".btn-specificVolumeShow").click(function(){
   		if(self.icon.specificVolumeShow == false)
   		{
   			self.icon.specificVolumeShow = true;
   			$(".btn-specificVolumeShow").removeClass("icon-unselected");
   			$(".btn-specificVolumeShow").addClass("icon-selected");
   			console.log("you choose to show the specific volume!");
        self.showSpecificVolume();
   		}
   		else
   		{
   			self.icon.specificVolumeShow = false;
   			$(".btn-specificVolumeShow").removeClass("icon-selected");
   			$(".btn-specificVolumeShow").addClass("icon-unselected");
   			console.log("you choose not to show specific volume!");
        self.unshowSpecificVolume();
   		}
   });
}

iconpanel.prototype.showEmptyNode = function ()
{
  var self = this;

}

iconpanel.prototype.unshowEmptyNode = function ()
{
   var self = this;
}

iconpanel.prototype.showMatrixGrid = function ()
{
  var self = this;
  matrixWave.svg.selectAll(".linkCell").classed("matrixGridShow", true);
}

iconpanel.prototype.unshowMatrixGrid = function ()
{
   var self = this;
   matrixWave.svg.selectAll(".linkCell").classed("matrixGridShow", false);
}

iconpanel.prototype.showNodeLabel = function ()
{
    var self = this;
    var len = matrixWave.matrixWaveNodeLabel.length;
    for(var i =0; i< len; i++)
    {
       matrixWave.matrixWaveNodeLabel[i].classed("nodeLabelUnshow", false);
       matrixWave.matrixWaveNodeLabel[i].classed("nodeLabelShow", true);
    }
}

iconpanel.prototype.unshowNodeLabel = function ()
{
   var self = this;
   var len = matrixWave.matrixWaveNodeLabel.length;
   for(var i =0; i< len; i++)
   {
     matrixWave.matrixWaveNodeLabel[i].classed("nodeLabelShow", false);
     matrixWave.matrixWaveNodeLabel[i].classed("nodeLabelUnshow", true);
   }
}

iconpanel.prototype.showSpecificVolume = function ()
{
   var self = this;
   matrixWave.drawRelatedNode();
   matrixWave.drawRelatedLink();
}

iconpanel.prototype.unshowSpecificVolume = function ()
{
   var self = this;
   matrixWave.removeRelatedNodeVis();
   matrixWave.removeRelatedLinkVis();
}