function LoadNewPageByID(row, id) {
	UnHighlightRow(row);  
	if (moved_after_touch || inProgress) {
    	return;
  	}
WindowHistory.push(window.location.href)
	inProgress=true;
	setTimeout("inProgress=false",1000);
	iui.showPageById(id)
}

var WindowHistory = new Array();



function LoadNewPage_OBJC(thelink) {
	$('#OBJC_POP').show();
  	inProgress=true;
	WindowHistory.push(window.location.href)
	isPop=2;

    if (thelink) {
	   
		function unselect() { 
			$('#OBJC_POP').hide();
			setTimeout("inProgress=false",300);
			isPop=0; 
			thePage = returnDocument();
			theClass = thelink.substring(0, thelink.indexOf("/"));
			theLink = thelink
			initPage(thePage)
			HidePopUp();
		}
		iui.showPageByHref(thelink, null, null, null, unselect);      
	 }
}




function LoadNewPage(row,thelink,head,fromDiv) {
	UnHighlightRow(row);  
	if (moved_after_touch || inProgress) {
    return;
  }
  	inProgress=true;
	
	WindowHistory.push(window.location.href)
	
	isPop=2;
	oldMessage=$('#'+row.id).html();
	var therow = row;
    if (thelink)
	
	if (fromDiv) {
		showDiv = fromDiv;
	}
	

	
    {
        function unselect() { 
			therow.removeAttribute("selected");
			setTimeout("inProgress=false",300);
			isPop=0; 
			if (therow.className=='BlueButton') {
					therow.innerHTML=oldMessage;
			} 

			if (therow.className=='BlueButton') {
				if (oldMessage=='Message') {
					setTimeout("$('#MsgText').focus();",300);   //doesn't work
				}
			}
		
			
			

			thePage = returnDocument();
			theClass = thelink.substring(0, thelink.indexOf("/"));
			theLink = thelink
			initPage(thePage)
			HidePopUp();
		}
        
			therow.setAttribute("selected", "progress");
			
			if (therow.className=='BlueButton') {
					therow.innerHTML='<div id="Spinner" class="BlueSpinner" style="margin-top:10px;">&nbsp;&nbsp;</div>';
			}
		
		    iui.showPageByHref(thelink, null, null, null, unselect);
               
    }
}


function initPage(thePage) {
	
	if(theClass == 'messages') {
		updateConversation(document.getElementById('user_id').value)
	}
	
	thePage = thePage.toLowerCase();

	if (theClass == 'blip_categories') {
	
		if (theLink.indexOf('blips') ==-1) {  //make sure not on blip show page
		
			if ($('#CategoryID').text() == 4 || $('#CategoryID').text() == 5 || $('#CategoryID').text() == 6)  {
				sort='expire'
				$('#SortDropDownSelected').html('Start Time')
			} else {
				sort='distance'
			}
		
			sub_category=0
			offset=0
			currentButton="Blip_Info"
			resortBlips(sort, sub_category)
		}
	}

	if (theClass == 'users') {
			sort='last_login'
			currentButton="Profile_Personal"
			$('#leftButton').hide();
			$('#rightButton').hide();
			id=$('#user_id').text()
		
			$.getJSON("users/"+id+".js?req=friends",
		        function(json){
					ThumbFriends2 = json
				});
				$.getJSON("users/"+id+".js?req=blips",
					function(json){
						
						ProfileBlip = json
					
					});
		}
		if (theLink.indexOf('blips') != -1) {
			$.getJSON("tracks/"+document.getElementById('blip_id').value+".js",
		        function(json){
					ThumbTracks = json
					
			});
		}
	
}

	currentButton = 'Profile_Personal';
	function SwitchSubMenu(id) {
	
	 	//$(".SubMenuButtonOver").removeClass("SubMenuButtonOver").addClass("SubMenuButton");
		//$(id).addClass("SubMenuButtonOver").removeClass("SubMenuButton");
			
			
			
			
		if (id.id.indexOf('Blip_') != -1) {
			  $('#SubMenuBlip > * ').each(
					function( intIndex ){			  
						$(this).addClass("SubMenuButton");
						$(this).removeClass("SubMenuButtonOver");
					}
				);
				$("#Blip_Info_Layer").hide();
				$("#Blip_Tracks_Layer").hide();
				$("#Blip_Comments_Layer").hide();
		} else {
			if (id.id.indexOf('Profile_') != -1) {
				  $('#SubMenuProfile > * ').each(
						function( intIndex ){			  
							$(this).addClass("SubMenuButton");
							$(this).removeClass("SubMenuButtonOver");
							}
						);
						$("#Profile_Personal_Layer").hide();
						$("#Profile_Friends_Layer").hide();
						$("#Profile_Blips_Layer").hide();
			} else {
				if (id.id.indexOf('You') != -1) {
					 $('#SubMenuYou > * ').each(
							function( intIndex ){			  
								$(this).addClass("SubMenuButton");
								$(this).removeClass("SubMenuButtonOver");
								}
							);
							$("#You_Info_Layer").hide();
							$("#You_Inbox_Layer").hide();
							$("#You_Tracking_Layer").hide();
				}
			}
		}
	
	
		//$("#"+currentButton).addClass("SubMenuButton");
		//$("#"+currentButton).removeClass("SubMenuButtonOver");
		//$("#"+currentButton+"_Layer").hide();

		//alert($("#Profile_Personal_Layer").text())

		 $(id).addClass("SubMenuButtonOver");
		 $(id).removeClass("SubMenuButton");
		$("#"+id.id+"_Layer").show();

		 currentButton=id;

		 HidePopUp();
	}





function SwitchTab(theTab) {
	//window.location.hash=theTab;

	showHideLayer('Messages','','hide');
	showHideLayer('GeoChat','','hide');
	showHideLayer('Boards','','hide');

	document.getElementById('Messages').setAttribute("selected", ""); 
	document.getElementById('Boards').setAttribute("selected", ""); 
	document.getElementById('GeoChat').setAttribute("selected", ""); 


	document.getElementById('MenuChat_Messages').style.backgroundColor = '';
	document.getElementById('MenuChat_Boards').style.backgroundColor = '';
	document.getElementById('MenuChat_GeoChat').style.backgroundColor = '';

	document.getElementById('MenuChat_'+theTab).style.backgroundColor = '#0357BE';
	showHideLayer(theTab,'','show');

	document.getElementById(theTab).setAttribute("selected","true");
}



function SwitchProfileTab(theTab) {
	//window.location.hash=theTab;

	showHideLayer('Profile_Info','','hide');
	showHideLayer('Profile_Saved','','hide');
	showHideLayer('Profile_Inbox','','hide');

   document.getElementById('Profile_Info').removeAttribute("selected");
    document.getElementById('Profile_Saved').removeAttribute("selected");
	 document.getElementById('Profile_Inbox').removeAttribute("selected");

	document.getElementById('MenuProfile_Info').style.backgroundColor = '';
	document.getElementById('MenuProfile_Saved').style.backgroundColor = '';
	document.getElementById('MenuProfile_Inbox').style.backgroundColor = '';

	document.getElementById('MenuProfile_'+theTab).style.backgroundColor = '#0357BE';
	showHideLayer('Profile_'+theTab,'','show');

	document.getElementById('Profile_'+theTab).setAttribute("selected","true");				   
}


// track if we moved following a touchstart
var moved_after_touch = false;

// called for touch move events on groups
function touch_started (therow) {

  if (inProgress) {
    return;
  }
  moved_after_touch = false;
  
  if (therow.className != 'BlueButton') {
  	HighlightRow(therow);
  }
}

// called for touch move events on groups
function touch_moved (event) {
  moved_after_touch = true;
};

function Transitions () {
  this.instantOperations = new Function (); 
  this.deferredOperations = new Function (); 
};

Transitions.DEFAULTS = {
  duration : 1,   
  properties : []
};


Transitions.prototype.add = function (params) {
  var style = params.element.style;
  var properties = (params.properties) ? params.properties : Transitions.DEFAULTS.properties;
  var duration = ((params.duration) ? params.duration : Transitions.DEFAULTS.duration) + 's';
  var durations = [];
  for (var i = 0; i < properties.length; i++) {
    durations.push(duration);
  }
  if (params.from) {
    this.addInstantOperation(function () {
      style.webkitTransitionProperty = 'none';
      for (var i = 0; i < properties.length; i++) {
		  
        style.setProperty(properties[i], params.from[i], '');
      }
    });
    this.addDeferredOperation(function () {
      style.webkitTransitionProperty = properties.join(', ');
      style.webkitTransitionDuration = durations.join(', ');
      for (var i = 0; i < properties.length; i++) {
        
		style.setProperty(properties[i], params.to[i], '');
      }
    });
  }
  else {
    this.addDeferredOperation(function () {
      style.webkitTransitionProperty = properties.join(', ');
      style.webkitTransitionDuration = durations.join(', ');
      for (var i = 0; i < properties.length; i++) {
        style.setProperty(properties[i], params.to[i], '');
      }
    });
  }
};
Transitions.prototype.addInstantOperation = function (new_operation) {
  var previousInstantOperations = this.instantOperations;
  this.instantOperations = function () {
    previousInstantOperations();
    new_operation();
  };
};
Transitions.prototype.addDeferredOperation = function (new_operation) {
  var previousDeferredOperations = this.deferredOperations;
  this.deferredOperations = function () {
    previousDeferredOperations();
    new_operation();
  };
};
Transitions.prototype.apply = function () {
  this.instantOperations();
  var _this = this;
  setTimeout(_this.deferredOperations, 0);
};
function get_header_transform_for_x (x) {
  return 'translate(' + x + 'px, 5px)';
};

function get_page_transform_for_x (x) {
  return 'translateX(' + x + 'px)';
};

function to_px (value) {
  return value + 'px';
};

