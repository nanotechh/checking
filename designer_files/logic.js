var trace = function(str){
	$('#ta').val($('#ta').val() + str + '\n');
	$('#ta').scrollTop($('#ta')[0].scrollHeight);
};


var query = new Array();
var options = parseUri(window.location.href).query.split('&');
for(var i=0;i<options.length;i++){
	var property = options[i].split('=');
	query[property[0]] = property[1];
}


var currentMaterial;
var addMaterials = function(){
	
	var html='';
	
	for(var i=0;i<materials.length;i++){
		html += '<div class="m_category">';
		html +=	'<span>'+materials[i].title+'</span>';
		for(var j=0;j<materials[i].colors.length;j++){
			html +=	'<div id="'+materials[i].colors[j].mid+'" class="colorThumbnail" src="'+materials[i].colors[j].src+'" alt="'+materials[i].title+' - '+materials[i].colors[j].text+'" style="background-position: -'+materials[i].colors[j].x+'px -'+materials[i].colors[j].y+ 'px;"></div>';
			
		}
		html += '</div>';
		html += '</div>';
		//trace('    MATERIAL COLOR---- '+materials[i].title);
	}
	$('#material_list').html(html);
	$('.colorThumbnail').bind('click',function(e){
		if(currentMaterial){
			$(currentMaterial).removeClass('colorSelected');
		}
		$(this).addClass('colorSelected');
		
		currentMaterial = this;
		
		updateTextureOption();
	});
	$('.colorThumbnail').bind('mouseenter',function(e){
		$('.tooltip').css('left',e.pageX+20);
		$('.tooltip').css('top',e.pageY+20);
		$('.tooltip span').html($(this).attr('alt'));
		$('.tooltip').fadeIn();
	});
	$('.colorThumbnail').bind('mouseleave',function(e){
		$('.tooltip').css('display','none');
	});
}

$('.remove_option').bind('click',function(){
	$(this).parent().fadeOut();
});

$(window).resize(function() {
	adjustLayout();
});

var updateTextureOption = function(){
   $('#loader .percentage').html('0%');
	var value = $(currentMaterial).attr('alt').split('-');
	
	$('.texture_option_chosen').html("You've chosen "+value[1]+" "+value[0]);
	$('.material_tex').attr('src',$(currentMaterial).attr('src'));
	$('#texture_option').fadeIn();
	if(partSelected){	
		materialList[partSelected].id = $(currentMaterial).attr('id');
		materialList[partSelected].src = $(currentMaterial).attr('src');
		//toplayer=$(currentMaterial).attr('id');	
		loadModel();		
	}else{
		alert('please select a layer!');
	}
}

var adjustLayout = function (){	
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],windowWidth=w.innerWidth||e.clientWidth||g.clientWidth,windowHeight=w.innerHeight||e.clientHeight||g.clientHeight;
	
	$('.lrLayer').css({"top": windowHeight-parseInt($('.lrLayer').css('height')),"left": (windowWidth-parseInt($('.lrLayer').css('width')))/2});
	$('#3dview').css({"top": (windowHeight-parseInt($('#3dview').css('height')))/2,"left": (windowWidth-parseInt($('#3dview').css('width')))/2});
	$('#loader').css({"top": (windowHeight-parseInt($('#loader').css('height')))/2,"left": (windowWidth-parseInt($('#loader').css('width')))/2});
}
//addMaterials();
//adjustLayout();

var viewAvaliable = false;
var totalView = 8;
var counter = 0;
var current = 0;

var materialList = new Object();
var upperlayer = 'M21';
var base = 'M21';
var toplayer = 'M22';

//var model = 'LadyShoe';
var model = query['model'];//'LadyShoe001';
var modelUrl = '';
		
var add3dView = function(){	
	for(var k=0;k<parts.length;k++){
		materialList[parts[k].pid] = new Object();
		materialList[parts[k].pid].id = parts[k].mid;
		materialList[parts[k].pid].src = parts[k].src;
		materialList[parts[k].pid].title = parts[k].title;
		
	}	
	
	$('#loader').parent().removeClass('visible-off').addClass('visible-on');
	for(var i=0;i<totalView;i++){
		$('#3dview').append('<img id="view_'+i+'" class="viewImgRotating" count="'+i+'" style="display:none; position:absolute; top:0px; left:0px;" status="0">');
		$('#view_'+i).error(function(e){
			var vid = e.currentTarget.id.split('_')[1];
			$('#view_'+counter).attr('status',0);
			
			counter++;
			
			if(counter<totalView){
				generateUrl();
				//var modelUrl=  'http://python.logicitsolution.com/practicedate31/project30/generate.php?upperlayer='+materialList['upperlayer'].id+'&base='+materialList['base'].id+'&toplayer='+materialList['toplayer'].id+'&model='+model+'&total='+totalView+'&count='+counter+'&width=640&height=480';
				
				$('#view_'+counter).attr('src',modelUrl).attr('status',1);
			}else{
				$('#loader').parent().fadeOut();
				$('#3dview').bind('mousedown', onMouseDown);
				$('#3dview').bind('mouseenter', onMouseEnter);
			}
			console.log("Error occurs in the image : "+counter);
		});
		
		$('#view_'+i).load(function(e){
			var vid = e.currentTarget.id.split('_')[1];
			
			if(current==vid)$(this).fadeIn();
			$('#view_'+counter).attr('status',1);
			//trace("Loading image is : "+counter);
			counter++;
			var percentage = Math.round(100/(totalView/counter));
			
			$('#loader .percentage').html(percentage+'%');
			
			if(counter<totalView){
				generateUrl();
				//var modelUrl='http://python.logicitsolution.com/practicedate31/project30/generate.php?upperlayer='+materialList['upperlayer'].id+'&base='+materialList['base'].id+'&toplayer='+materialList['toplayer'].id+'&model='+model+'&total='+totalView+'&count='+counter+'&width=640&height=480';
				$('#view_'+counter).attr('src',modelUrl);
			}else{
				$('#loader').parent().fadeOut();
				$('#3dview').bind('mousedown', onMouseDown);
				$('#3dview').bind('mouseenter', onMouseEnter);
			}
		});
	}	
	//var modelUrl='http://python.logicitsolution.com/practicedate31/project30/generate.php?upperlayer='+materialList['upperlayer'].id+'&base='+materialList['base'].id+'&toplayer='+materialList['toplayer'].id+'&model='+model+'&total='+totalView+'&count='+counter+'&width=640&height=480';
	generateUrl();
	$('#view_'+counter).attr('src',modelUrl);
	viewAvaliable = true;			
};

var generateUrl = function(){		
	modelUrl = "http://python.logicitsolution.com/practicedate31/project30/generate.php?total="+totalView+"&count="+counter+"&width=640&height=480";	
	if(modelId == query['model']){				
		modelUrl+='&model='+query['model'];		
		for(var i=0;i < parts.length ; i++){				
				modelUrl+='&'+parts[i].pid+'='+materialList[parts[i].pid].id;				
			}			
	}		
}
//add3dView();
var partSelected;
var loadModel = function(){
	$('#3dview').unbind('mousedown', onMouseDown);
	$('#3dview').unbind('mouseenter', onMouseEnter);
				
	$('#loader').parent().fadeIn();
	counter = 0;
	generateUrl();
	$('#view_'+counter).attr('src',modelUrl);
}
var c = function(o) {
	for (var i in o) {		
		if( typeof o[i] == 'object')
		c(o[i]);	
	}
};
/** Manage the niddle show and hide in using addHelper method  **/
var addHelper = function(){	
     $('#helper .niddle').remove(); //uncomment it
	if(current<niddles.length){					 
		for(var i=0;i<niddles[current].helper.length;i++){  // Length is two for
			$('#helper').append('<div id="helper_'+niddles[current].helper[i].pid+'" class="niddle" title="'+materialList[niddles[current].helper[i].pid].title+'"><img class="line" src="images/line.png" style="position:absolute;"/><div class="material"></div><div class="top n-unselected"></div></div>');			
			//Manage the css of the niddles..
			$('#helper_'+niddles[current].helper[i].pid).css({'left':(niddles[current].helper[i].x-15),'top':(niddles[current].helper[i].y-15)});
			//console.log("niddle y is :"+niddles[current].helper[i].y);
			$('#helper_'+niddles[current].helper[i].pid+' .material').css('background','url('+materialList[niddles[current].helper[i].pid].src+')');			
			var hx = 15;
			var hy = 15;
			var hw = 2;
			var hh = 2;
			if(niddles[current].helper[i].r==0){
				hw = niddles[current].helper[i].d;
			}else if(niddles[current].helper[i].r==180){
				hx = 15-niddles[current].helper[i].d;
				hw = niddles[current].helper[i].d;
			}
			if(niddles[current].helper[i].r==90){
				hh = niddles[current].helper[i].d;
			}else if(niddles[current].helper[i].r==270){
				hy = 15-niddles[current].helper[i].d;
				hh = niddles[current].helper[i].d;
			}
			
			$('#helper_'+niddles[current].helper[i].pid+' .line').css({'width':hw,'height':hh,'left':hx,'top':hy});			
			 
			if(partSelected == niddles[current].helper[i].pid){
				$('#helper_'+niddles[current].helper[i].pid+' .top').removeClass('n-unselected').addClass('n-selected');				
			}
				$('#helper').append('<div id="tlpForIcn"> </div>');
				$('#helper_'+niddles[current].helper[i].pid).bind("mouseover",onMouseOverOnIcon);
				$('#helper_'+niddles[current].helper[i].pid).bind("mouseout",onMouseUpOutOnIcon);
		}							
	}	
}

onMouseOverOnIcon=function(e){
			$('#tlpForIcn').html('');	
			var id=$(this).attr('id');
			var imgSrc=($('#'+id+' .material').attr('style').split('/')[1]).split('.')[0];	
			var colorInfo=imgSrc.split('_')[0];
			var leftl=Number($('#'+e.currentTarget.id).position().left)+40;			
			$('#tlpForIcn').append('<div id="tlpForIcn"  style="position:absolute;z-index:40;background-color:#000;color:#FFF; text-align:center;width:120px;height:23px;left:'+leftl+';top:'+($('#'+e.currentTarget.id).position().top)+';" alt="toolTipForLayer"> '+colorInfo+' color </div>');//$('#'+e.currentTarget.id).attr('title')            
}
onMouseUpOutOnIcon=function(){			
			$('#tlpForIcn').html('');
}
var startDragging = false;
var distanceCovered = 1;
var localClickPoint = new Object();
var onMouseEnter = function(e){		
	$('#helper .niddle').remove(); 
	addHelper();
	$('#3dview').bind('mouseleave', onMouseLeave);
}
var onMouseLeave = function(e){
	$('#helper .niddle').remove();   //UNCOMMENT IT
	$('#3dview').unbind('mouseleave', onMouseLeave);
}
var onMouseDown = function(e){ 	
	if($(e.target).hasClass('top')){
		if(partSelected){
			$('#helper_'+partSelected+' .top').removeClass('n-selected').addClass('n-unselected');
		}
		partSelected = $(e.target).parent().attr('id').split('_')[1];
		$(e.target).removeClass('n-unselected').addClass('n-selected');		
	}else{
		localClickPoint.x = e.pageX;
		startDragging = true;
		$('#3dview').bind('mousemove', onMouseMove);
		$('#3dview').bind('mouseup', onMouseUp);
		$('#3dview').bind('mouseout', onMouseOut);
		$('#helper .niddle').remove(); //UNCOMMENT IT
	}
	return false;
}
var onMouseMove = function(e){
	if(startDragging){
		if(localClickPoint.x < e.pageX){
			distanceCovered = distanceCovered+1;
			if(distanceCovered%10==0){
				if(current<totalView){
					$("#view_"+current).hide();
					current=current+1;
					showNextImage(0);
				}
				localClickPoint.x = e.pageX;				
			}
		}
		else if(localClickPoint.x > e.pageX){
			distanceCovered = distanceCovered+1;
			if(distanceCovered%10==0){
				if(current>=0){
					$("#view_"+current).hide();
					current=current-1;
					showPrevImage(0);
				}
				localClickPoint.x = e.pageX;
				
			}
		}
	}
	return false;
}
var onMouseUp = function(e){
	
	addHelper(); 
	$('#3dview').unbind('mousemove', onMouseMove);
	$('#3dview').unbind('mouseup', onMouseUp);
	$('#3dview').unbind('mouseout', onMouseOut);
}
var onMouseOut = function(e){
	
	$('#3dview').unbind('mousemove', onMouseMove);
	$('#3dview').unbind('mouseup', onMouseUp);
	$('#3dview').unbind('mouseout', onMouseOut);
}
var showNextImage = function(hits){
	if(current==totalView)current=0;
	if($("#view_"+current).attr('status')==1){
		$("#view_"+current).show();
	}else{
		if(hits>=totalView){
			return;
		}
		current++;
		showNextImage(++hits);
	}
}
var showPrevImage = function(hits){
	if(current<0)current=totalView-1;
	if($("#view_"+current).attr('status')==1){
		$("#view_"+current).show();
	}else{
		if(hits>=totalView){
			return;
		}
		current--;
		showPrevImage(++hits);
	}
}

$('.titleBar').mousedown(function(){	
	$('.tooltip').hide();
	$(this).parent().draggable('enable');
	$(this).parent().draggable({containment: "parent"});
});
$('.titleBar').mouseup(function(){
	$(this).parent().draggable('disable');
});
$('.titleBar').mouseout(function(){
	$(this).parent().draggable('disable');
});

$("#goleft").hover(
   function() {
      $($(this).children()[0]).animate({paddingRight: 35}, 'fast');
   },
   function() {
      $($(this).children()[0]).animate({paddingRight: 0}, 'fast');
   });
$("#goleft").click(function(e){
	$("#view_"+current).hide();
	current=current-1;
	showPrevImage(0);
});
$("#goright").hover(
   function() {
      $($(this).children()[0]).animate({paddingLeft: 35}, 'fast');
   },
   function() {
      $($(this).children()[0]).animate({paddingLeft: 0}, 'fast');
   });
$("#goright").click(function(e){
	$("#view_"+current).hide();
	current=current+1;
	showNextImage(0);
});
	var modelId='';
  function init(reqId) {				
				var phphttp = new XMLHttpRequest();				
				phphttp.open("GET", "getdata.php?model="+$.trim(reqId), true);				
				phphttp.send();				
				phphttp.onreadystatechange = function() {
					if(phphttp.readyState == 4) { 						
						var jsonString = phphttp.responseText;
						
						var obj = eval(jsonString);						
						materials = obj[0].materials;
						parts = obj[1].parts;
						niddles = obj[2].niddles;	
						modelId = obj[3].modelcode;						
						$('#loader').parent().fadeIn();
						$('#loader .percentage').html('0%');	
						counter = 0;
						$('#3dview').unbind('');
						$(".viewImgRotating").remove();						
						add3dView();
						addMaterials();	
						adjustLayout();	
					}
				}
			}
	
	init(query['model']);		
   
  /**------------ MENU JS --------------------------  **/ 
  
 /*$("#coolMenu li ul li").click(function(e){
          $("#ta").val('');		  
		  var curText=$(this).text();
		   if($.trim(curText)==$.trim('FIRST MODEL'))
						{
							model = 'LadyShoe';
							init(1);	
							trace("Text of li is : "+$(this).text());
						}
			else if($.trim(curText)==$.trim('SECOND MODEL'))
						{
							model = 'LadyShoe001';
							init(2);	
							trace("Text of li is : "+$(this).text());
						}					 		 
	}); */
	
$("#coolMenu li:first").click(function(){
  window.location.href = "choose-model.html";
});

/** ..................END OF MENU JS...........    **/	