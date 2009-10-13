// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

function SendPing(button) {
	if  (document.getElementById("message").value != '') {
		if ($(button).attr("class") == 'greenButton') {
			$(button).html('<div id="Spinner" class="GreenSpinner" style="margin-top:15px">&nbsp;&nbsp;</div>')
			$('#message').css({opacity:.5})
			$.post("messages", { message: document.getElementById("message").value, reciever_id: document.getElementById("reciever_id").value, authenticity_token: window._token}, 
			function(data){
				$(button).html("Ping Sent");
				$(button).removeClass("greenButton");
				$(button).addClass("whiteButton");
				setTimeout("window.location.href = WindowHistory.pop()", 500);
			});
		}
	}	
}

function LogIn() {
	$.post("/login", { email: document.getElementById("email").value, password: document.getElementById("password").value}, 
	function(data){
		var error = data.getElementsByTagName("error")[0].childNodes[0].nodeValue;
		if(error == 0) {		
			location.reload(true);
		} else {
			if (error == 2) {
				alert('Credentials denied.  Wrong email/password combination.')
			 } else {
				if (error == 1) {
					alert(document.getElementById("email").value+' does not exist.  Would you like to create a new account?')
				} else {
					$("#LoginLayer").hide()
					$("#RegisterLayer").show()
					var user_id = data.getElementsByTagName("user_id")[0].childNodes[0].nodeValue;
					document.getElementById('user_id').value = user_id
				}
			}
		}
	});
}

function Register() {
	$.post("/register", { email: document.getElementById("email").value, password: document.getElementById("password").value, device_id: document.getElementById("device_id").value, authenticity_token: window._token}, 
	function(data){
		var error = data.getElementsByTagName("error")[0].childNodes[0].nodeValue;
		if(error == 0) {	
			$("#LoginLayer").hide()
			$("#RegisterLayer").show()
			var user_id = data.getElementsByTagName("user_id")[0].childNodes[0].nodeValue;
			document.getElementById('user_id').value = user_id
		} else {
			if (error == 1) {
				alert(document.getElementById("email").value+'account already exists. Incorrect password.')
			 } else {
				if (error == 2) {
					location.reload(true);
				} else {
					$("#LoginLayer").hide()
					$("#RegisterLayer").show()
					var user_id = data.getElementsByTagName("user_id")[0].childNodes[0].nodeValue;
					document.getElementById('user_id').value = user_id
				}
			}
		}
	});
}

function Register2() {
	$.post("/register", { user_id: document.getElementById("user_id").value, first_name: document.getElementById("first_name").value, last_name: document.getElementById("last_name").value, phone: document.getElementById("phone").value, authenticity_token: window._token}, 
	function(data){
		var error = data.getElementsByTagName("error")[0].childNodes[0].nodeValue;
		if(error == 0) {	
			$("#RegisterLayer").hide()
			$("#GeocodeLayer").show()
		} else {
			alert('error')
		}
	});
}

function Geocode() {
	$.post("/user_locations", { user_id: document.getElementById("user_id").value, geocode: document.getElementById("geocode").value, authenticity_token: window._token}, 
	function(data){
		location.reload(true);
	});
}

function LogOut(button) {
	$(button).css({ opacity:.5 })
	$(button).html('<div id="Spinner" class="GreenSpinner" style="margin-top:10px;">&nbsp;&nbsp;</div>')
	
	$.post("/logout", { authenticity_token: window._token }, 
	function(data){			
			//location.reload(true);
	});
	window.location.href = 'usonar://logout/'
}



//need better method of indentifiying the page
function LoadContactPopUp() {
	
	$("#ContactPop").show()
	$('#ContactPop').css({ opacity:.8 })
	setTimeout("$('#ContactButtons').show()",100);
}

function CloseContactPopUp() {
	$("#ContactButtons").hide()
	$('#ContactPop').css({ opacity: 0 })
	setTimeout("$('#ContactPop').hide()",100);
}

function AddtoFriends(button, friend_id) {
	if ($(button).attr("class") == 'greenButton') {
			$(button).removeClass("greenButton");
			$(button).addClass("whiteButton");
			$(button).html("Sending...");
			$.post("/users/"+friend_id+"/friendships", { friend_id: friend_id, authenticity_token: window._token }, function(data){
			  	$(button).html("Request Pending");
			});
	}
} 

function RemoveFriend(button, friend_id) {
	if ($(button).attr("class") == 'redButton') {
		$(button).removeClass("redButton");
		$(button).addClass("whiteButton");
		$(button).html("Sending...");
		$.post("/users/"+friend_id+"/friendships/"+friend_id, { friend_id: friend_id, _method: 'delete', authenticity_token: window._token }, function(data){
			$(button).html("Friend Removed");
		});
	}
}

	already_added = 0;
function ApproveFriend(button, user_id, friend_id, action) {
	
	request_id = $('#request_id').text()
	num_friends = $('#num_friends').text()
	num_friends = parseInt(num_friends)

	
	$('#Approve').removeClass("whiteButton");
	$('#Ignore').removeClass("whiteButton");
	$('#Deny').removeClass("whiteButton");
	$('#Approve').addClass("greenButton");
	$('#Ignore').addClass("blackButton");
	$('#Deny').addClass("redButton");
	
	$(button).removeClass("redButton");
	$(button).removeClass("greenButton");
	$(button).removeClass("blackButton");
	$(button).addClass("whiteButton");
	$(button).html("Sending...");
	
	if (action == "accept") {
		$.post("/users/"+user_id+"/friendships/"+friend_id, { friend_id: friend_id, _method: 'put', the_action: 'accept', authenticity_token: window._token }, function(data){
			$(button).html("Approved");
			$('#R_'+request_id).remove();
			num_friends = num_friends + 1
			already_added = 1
			$('#num_friends').html(num_friends)
		});	
	}
	if (action == "deny") {
		$.post("/users/"+user_id+"/friendships/"+friend_id, { friend_id: friend_id, _method: 'put', the_action: 'deny', authenticity_token: window._token }, function(data){
			$(button).html("Denied");
			$('#R_'+request_id).remove();
			if (already_added == 1) {
				already_added = 0
				num_friends = num_friends - 1
				$('#num_friends').html(num_friends)
			}	
		});	
	}
	if (action == "ignore") {
		$.post("/users/"+user_id+"/friendships/"+friend_id, { friend_id: friend_id, _method: 'put', the_action: 'ignore', authenticity_token: window._token }, function(data){
			$(button).html("Ignored");
			$('#R_'+request_id).remove();
			if (already_added == 1) {
				already_added = 0
				num_friends = num_friends - 1
				$('#num_friends').html(num_friends)
			}
		});	
	}
}


	function Track(button, blip_id, user_id, privacy, track_id) {
		
		if ($('#TrackButton').text() == "Track") {
			$('#TrackButton').html('Untrack');
			$(button).html('<div id="Spinner" class="GreenSpinner" style="margin-top:10px;">&nbsp;&nbsp;</div>')
			$.post("/tracks", { blip_id: blip_id, user_id: user_id, privacy: privacy, authenticity_token: window._token }, function(data){
			  LastMessage = data
				$('#TrackButton').removeClass("greenButton");
				$('#TrackButton').addClass("redButton");
				document.getElementById('track_id').value = LastMessage
			  CloseTrack();
			});
		} else {
			$('#TrackButton').html('Track');
			$('#TrackButton').removeClass("redButton");
			$('#TrackButton').addClass("greenButton");
			$.post("/tracks"+track_id, { track_id: track_id, _method: 'delete', authenticity_token: window._token }, function(data){
			  LastMessage = data
			  setTimeout("window.location.href = WindowHistory.pop()", 100);
			  $('#Track_'+blip_id).remove();
			});
		}
	}
	
	function CloseTrack() {
		$('#TrackButtons').hide(); $('#TrackPop').hide(); $('#TrackPop').css({opacity:0})
	}
function OpenTrack(button, blip, user, tracked) {
	if (button.innerHTML == "Untrack") {
	
		Track(button, blip, user, 0, tracked); 
	} else {
		$('#TrackButtons').show(); 
		$('#TrackPop').show(); 
		$('#TrackPop').css({opacity:1})
	}
}

function OpenVote(button, blip, user, tracked) {
	if ($(button).css("opacity") == 1) {
		$('#VoteButtons').show(); 
		$('#VotePop').show(); 
		$('#VotePop').css({opacity:1})
	}
}
function CloseVote() {
	$('#VoteButtons').hide(); $('#VotePop').hide(); $('#VotePop').css({opacity:0})
}
function Vote(button, blip_id, user_id, vote, track_id) {
	
	if (vote == 1) {
		$(button).html('<div id="Spinner" class="GreenSpinner" style="margin-top:10px;">&nbsp;&nbsp;</div>')
	} else {
		$(button).html('<div id="Spinner" class="RedSpinner" style="margin-top:10px;">&nbsp;&nbsp;</div>')
	}
	$.post("/blip_categories/1/blips/"+blip_id, { blip_id: blip_id, vote: vote, _method: "put", authenticity_token: window._token }, function(data){
	    LastMessage = data
		$('#VoteButton').html("Voted")
	    $('#VoteButton').css({ opacity:.5})
	    CloseVote();
	});
}

loadedEveryone = 0;
loadedFriends = 0;
	function ToggleNeighbors(skip) {
		HidePopUp();

	
	

		
		if (neighborSwitch == "Everyone") {
			
			if (friend_sort == 'distance') {
				$('#SortDropDownSelected').html('Distance')
			}
			if (friend_sort == 'last_login') {
				$('#SortDropDownSelected').html('Last Login')
			}
			if (friend_sort == 'reputation') {
				$('#SortDropDownSelected').html('Reputation')
			}
			
			$('#toggleEveryone').removeClass("turnBlue");
			$('#toggleFriends').addClass("turnBlue");
			neighborSwitch = "Friends";
			
			$('#ThumbnailView_Everyone').hide();
			$('#ThumbnailView_Friends').hide();
			$('#ListView_Friends').hide();
			$('#ListView_Everyone').hide();
			
			$('#'+toggle+'_Friends').show();
			$('#'+toggle+'_Friends').css({ opacity:1});
			
			sort = friend_sort
			
			
			if (loadedFriends == 0) {
				resortUsers(friend_sort, "Friends", skip)
				//populateNeighbors("Friends", sort)
			}
		} else {
			
			if (everyone_sort == 'distance') {
				$('#SortDropDownSelected').html('Distance')
			}
			if (everyone_sort == 'last_login') {
				$('#SortDropDownSelected').html('Last Login')
			}
			if (everyone_sort == 'reputation') {
				$('#SortDropDownSelected').html('Reputation')
			}
			
			$('#toggleFriends').removeClass("turnBlue");
			$('#toggleEveryone').addClass("turnBlue");
			
			neighborSwitch = "Everyone";
			
			$('#ThumbnailView_Everyone').hide();
			$('#ThumbnailView_Friends').hide();
			$('#ListView_Friends').hide();
			$('#ListView_Everyone').hide();
			$('#'+toggle+'_Everyone').show();
			$('#'+toggle+'_Everyone').css({ opacity:1});
			
			sort = everyone_sort 
			if (loadedEveryone == 0) {
				resortUsers(everyone_sort, "Everyone")
				//populateNeighbors("Everyone", sort)
		
			}
		}
	}
	
	
function resortUsers(sortOption, type, skip) {
	if (neighborSwitch == "Friends") {   	
		$("#ListView_Friends").empty();
		$("#ListView_Friends").height(182)
		$("#ListView_Friends").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')

		$("#ThumbnailView_Friends").empty();
		$("#ThumbnailView_Friends").height(118)
		$("#ThumbnailView_Friends").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')
		
		if (skip) {
				$("#ListView_Friends").css('height','')
				$("#ListView_Friends").html('')
				$("#ThumbnailView_Friends").css('height','')
				$("#ThumbnailView_Friends").html('')
				populateNeighbors("Friends", sortOption)
		} else {
			$.getJSON("users.js?friends=1&order="+sortOption,
			function(json){
				$("#ListView_Friends").css('height','')
				$("#ListView_Friends").html('')
				$("#ThumbnailView_Friends").css('height','')
				$("#ThumbnailView_Friends").html('')
				PopUpData_Friends = json
				populateNeighbors("Friends", sortOption)
		});
		}
		friend_sort = sortOption
		sort = sortOption
	} else {
		
		$("#ListView_Everyone").empty()
		$("#ListView_Everyone").height(182)
		$("#ListView_Everyone").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')

		$("#ThumbnailView_Everyone").empty();
		$("#ThumbnailView_Everyone").height(118)
		$("#ThumbnailView_Everyone").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')

		$.getJSON("users.js?order="+sortOption,
		        function(json){
					$("#ListView_Everyone").css('height','')
					$("#ListView_Everyone").html('')
					$("#ThumbnailView_Everyone").css('height','')
					$("#ThumbnailView_Everyone").html('')
					PopUpData_Everyone = json
					populateNeighbors("Everyone", sortOption)
		        });	
		everyone_sort = sortOption
		sort = sortOption
	}
	
	
}

function populateNeighbors(type, sortOption, append) {

		if (append) {
			eval("Data = PopUpData_"+append+"_"+type)
			if (type == "Everyone") {
				offset = everyone_offset
				listlayer = 'A'   //used to make layers in list have different ids
				
			} else {
				offset = friend_offset
				listlayer = 'B'
				
			}
		} else {
			if (type=="Everyone") {
				Data = PopUpData_Everyone
				loadedEveryone = 1;
				listlayer = 'A'
				offset = everyone_offset
			} else {
				Data = PopUpData_Friends
				loadedFriends = 1;
				listlayer = 'B'
				offset = friend_offset
			}
			//append=''
			//offset=0
		}
	

		for(var i = 0; i < Data.length; ++i) {
			newDiv = document.createElement("div");
			z = i 
			newDiv.id = "Thumb"+type+"_"+z;
			newDiv.className = "Thumbnail";  
		
			if (Data[i].avatar_file_name == null) {
				newDiv.innerHTML = '<img src="../images/no_avatar.png" width="50" height="50">';
			} else {
				newDiv.innerHTML = '<img src="../users/avatars/'+Data[i].id+'/small_'+Data[i].avatar_file_name+'" width="50" height="50">';
			}
			ThumbParent = document.getElementById("ThumbnailView_"+type);
			ThumbParent.appendChild(newDiv, ThumbParent.lastChild);
			$(newDiv).bind("click", function(){
		     PopPic(this.id,5)
		    });
		}
		for(var i = 0; i < Data.length; ++i) {
			newDiv = document.createElement("div");
			newDiv.id = listlayer+'_'+Data[i].id;
			newDiv.className = "row";  
			html = '<profilepic id="TopPic">'
			if (Data[i].avatar_file_name == null) {
				html = html + '<img src="../images/no_avatar.png" width="36" height="36">'
			} else {
				html = html + '<img src="../users/avatars/'+Data[i].id+'/small_'+Data[i].avatar_file_name+'" width="36" height="36">'	
			}

			html = html + '</profilepic><img src="../images/iconStatus_'+Data[i].status+'.png" width="15" height="15" class="ListStatus">'
	        html = html + '<sort style="right:30px;">'
			if (sortOption == 'distance') {
				html = html + DistanceDecimal(Data[i].distance) +'m</sort>'
			}
			if (sortOption == 'reputation') {
				html = html + Data[i].reputation +'%</sort>'
			}
			if (sortOption == 'last_login') {
				html = html + Data[i].last_login_display +'</sort>'
			}
	        html = html + '<profilemsg style="height:30px"><span class="boldedname">'+Data[i].first_name+' '+Data[i].last_name+'</span> ' +Data[i].tweet+'</profilemsg></div>'

			newDiv.innerHTML = html;
			

			ListParent = document.getElementById("ListView_"+type);
			ListParent.appendChild(newDiv, ListParent.lastChild);
				
			$(newDiv).bind("touchstart", function(){
		     touch_started(this);
		    });
			$(newDiv).bind("touchmove", function(){
		     touch_moved()
		    });
			$(newDiv).bind("touchend", function(){
			  theid = this.id.substring(2,this.id.length);
		      LoadNewPage(this,"users/"+theid);
		    });
			if (mobile_format != 'iPhone') {
				$(newDiv).bind("click", function(){
				  theid = this.id.substring(2,this.id.length);
			      LoadNewPage(this,"users/"+theid);
			    });
			}
	
		}
		if (Data.length == 10) {
			newDiv = document.createElement("div");
			newDiv.id = "ListLoad_"+type;
			newDiv.className = "row";
			if (offset == 0) {
				newDiv.innerHTML = "<div class='ListLoadMore'>Load More Results ></div>"
				ListParent.appendChild(newDiv, ListParent.lastChild);
				newDiv2 = document.createElement("div");
				newDiv2.id = "ThumbLoad_"+type;;
				newDiv2.className = "ThumbLoadMore";
				newDiv2.innerHTML = "Load More Results >"
				ThumbParent.appendChild(newDiv2, ThumbParent.lastChild);
				$(newDiv).bind("click", function(){
			      	loadMoreUsers(type, 1); 
			    });
				$(newDiv2).bind("click", function(){
			      	loadMoreUsers(type, 1);  
			    });	
			} else {
				newDiv.innerHTML = "<div id='ListLoadMore' style='float:left' class='ListLoadMore' onclick='loadMoreUsers(\""+type+"\", 1)'>Load More Results > </div> <div id='ListPrev' style='float:left' class='ListLoadMore' onclick='loadMoreUsers(\""+type+"\", -1)'><  Load Previous Results</div>"
				ListParent.appendChild(newDiv, ListParent.lastChild);
				
				newDiv2 = document.createElement("div");
				newDiv2.id = "ThumbLoad_"+type;;
				newDiv2.className = "ThumbLoadMore";
				newDiv2.innerHTML = "<div style='float:right' onclick='loadMoreUsers(\""+type+"\", 1)'>Load More > </div> <div style='float:left' onclick='loadMoreUsers(\""+type+"\", -1)'><  Load Previous</div>"
				ThumbParent.appendChild(newDiv2, ThumbParent.lastChild);
			}
		} else {
			if (offset > 0) {
				newDiv4 = document.createElement("div");
				newDiv4.id = "back";
				newDiv4.className = "row";
				newDiv4.innerHTML = "<div class='ListLoadMore'>< Load Prev Results</div>"
				ListParent.appendChild(newDiv4, ListParent.lastChild);
				newDiv2 = document.createElement("div");
				newDiv2.id = "ThumbLoad_"+type;;
				newDiv2.className = "ThumbLoadMore";
				newDiv2.innerHTML = "< Load Prev Results"
				ThumbParent.appendChild(newDiv2, ThumbParent.lastChild);
				$(newDiv4).bind("click", function(){
			      	loadMoreUsers(type, -1); 
			    });
				$(newDiv2).bind("click", function(){
			      	loadMoreUsers(type, -1);  
			    });
			}
		}
}

function DistanceDecimal(distance) {
	if (distance < 10) {
		return Math.round(distance * 10) / 10
	} else {
		return Math.round(distance * 1) / 1
	}
}

function loadMoreUsers(type, direction) {
	
	HidePopUp()
	$("#ListLoad_"+type).html("<div class='ListLoadMore' style='float:left; width:150px'>Retrieving Records</div><div style='float:right; margin-right:40px; margin-top:5px'><img src=\"images/pinwheel-w.gif\" /></div>")
	$("#ThumbLoad_"+type).html("<div class='ListLoadMore' style='margin-left:130px'><img src=\"images/pinwheel-w.gif\" /></div>")
	
	if (type == "Everyone") {
		
		$("#ListView_Everyone").empty()
		$("#ListView_Everyone").height(182)
		$("#ListView_Everyone").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')

		$("#ThumbnailView_Everyone").empty();
		$("#ThumbnailView_Everyone").height(118)
		$("#ThumbnailView_Everyone").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')


		everyone_offset = everyone_offset + (10*direction)
		append = everyone_offset / 10
		$.getJSON("users.js?order="+everyone_sort+"&offset="+everyone_offset,
			function(json){
				$("#ListView_Everyone").css('height','')
				$("#ListView_Everyone").html('')
				$("#ThumbnailView_Everyone").css('height','')
				$("#ThumbnailView_Everyone").html('')
				
				PopUpData_Everyone  = json
				populateNeighbors("Everyone", everyone_sort)				
		});
	} else {
		
		$("#ListView_Friends").empty();
		$("#ListView_Friends").height(182)
		$("#ListView_Friends").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')

		$("#ThumbnailView_Friends").empty();
		$("#ThumbnailView_Friends").height(118)
		$("#ThumbnailView_Friends").html('<p align="center" style="margin-top:50px"><img src="images/pinwheel-w.gif" alt="" /><br>Retrieving Records</p>')
		
		
		friend_offset = friend_offset + (10*direction)
		append = friend_offset / 10
	
		$.getJSON("users.js?friends=1&order="+friend_sort+"&offset="+friend_offset,
			function(json){
				$("#ListView_Friends").css('height','')
				$("#ListView_Friends").html('')
				$("#ThumbnailView_Friends").css('height','')
				$("#ThumbnailView_Friends").html('')
				
				PopUpData_Friends  = json
				populateNeighbors("Friends", friend_sort)				
		});
	}
}

	function loadMoreBlips(direction) {
		$("#BlipList").empty()
		$("#LoadingLayer").show()
		$("#BlipList").hide()
		
			offset = offset + (20*direction)
				$.getJSON("blip_categories/"+catID+".js?order="+sort+"&sub_category_id="+sub_category+"&offset="+offset,
				function(json){
					$("#LoadingLayer").hide()
					$("#BlipList").show()
					Data = json
					populateBlips(1, sort)				
			});

	}

function resortBlips(sortOption, subcategoryOption) {
	$("#BlipList").empty()
	$("#LoadingLayer").show()
	$("#BlipList").hide()

	catID = $("#CategoryID").text()
	$.getJSON("blip_categories/"+catID+".js?order="+sortOption+"&sub_category_id="+subcategoryOption,
	        function(json){
				$("#LoadingLayer").hide()
				$("#BlipList").show()
				Data = json
				populateBlips(1, sortOption)
	        });
	
	sort = sortOption
	sub_category = subcategoryOption
}

function populateBlips(category, sortOption) {
		
		for(var i = 0; i < Data.length; ++i) {
			nopic = 0
			newDiv = document.createElement("div");
			newDiv.id = Data[i].id;
			newDiv.className = "row";  
			newDiv.style = "margin-top:5px; height:50px"
			html = '<profilepic id="TopPic" style="margin-top:6px">'
			if (Data[i].photo_file_name == null) {
				if (Data[i].photo_external_link == null) { 
					if (Data[i].anon == '1') {
						//html = html + '<img src="images/no_avatar.png" height="36 width=36">'
						nopic = 1
					} else {
						if (Data[i].avatar_file_name == null) {
							//html = html + '<img src="images/no_avatar.png" height="36 width=36">'
							nopic = 1
						} else {
							html = html + '<img src="users/avatars/'+ Data[i].user_id + '/small_' + Data[i].avatar_file_name +'" height="36" width="36">'
						}
					}
				} else {
					nopic = 1
					//html = html + '<img src="'+Data[i].photo_external_link+'" height="36" width="36" alt="">'	
				}
			} else {
				html = html + '<img src="blips/photos/'+ Data[i].id + '/small_' + Data[i].photo_file_name +'" height="36" width="36">'
			}
			html = html + '</profilepic>'
			if (sortOption == 'distance') {
				html = html + '<sort style="right:30px; margin-top:9px">' +DistanceDecimal(Data[i].distance) + 'm</sort>'	
			}
			if (sortOption == 'created_at') {
				html = html + '<sort style="right:30px; margin-top:3px">'+ Data[i].created_at_display +'</sort>'	
			}
			if (sortOption == 'expire') {
				html = html + '<sort style="right:30px; margin-top:3px">'+ Data[i].expire_display +'</sort>'	
			}
			if (sortOption == 'votes') {
				html = html + '<sort style="right:30px; margin-top:9px">'+ Data[i].votes_display +'</sort>'	
			}
			html = html + '<profilemsg style="font-size:12px; font-weight:100; margin-top:1px;'
			if (nopic == 1) {
				html = html + 'margin-left:5px; width:230px'
			}
			html = html +'"><span class="boldedname">'+Data[i].title+'</span> '+Data[i].description+' </profilemsg>'
			html = html + '</div>'
			newDiv.innerHTML = html;
			ListParent = document.getElementById("BlipList");
			ListParent.appendChild(newDiv, ListParent.lastChild);
			$(newDiv).bind("touchstart", function(){
		     touch_started(this);
		    });
			$(newDiv).bind("touchmove", function(){
		     touch_moved()
		    });
			$(newDiv).bind("touchend", function(){
		     LoadNewPage(this,"blip_categories/1/blips/"+this.id);
		    });
			if (mobile_format != 'iPhone') {
				$(newDiv).bind("click", function(){
			     LoadNewPage(this,"blip_categories/1/blips/"+this.id);
			    });
			}
	
		}
		if (Data.length == 20) { 
			newDiv = document.createElement("div");
			newDiv.id = "ListLoad";
			newDiv.className = "rowoption";
			if (offset == 0) {
				newDiv.innerHTML = "<div class='ListLoadMore'>Load More Results > </div>"
				$(newDiv).bind("click", function(){
				    loadMoreBlips(1); 
				});
			} else {
				newDiv.innerHTML = "<div id='ListMore' style='float:left' class='ListLoadMore' onclick='loadMoreBlips(1)'>Load More Results > </div> <div id='ListPrev' style='float:left' class='ListLoadMore' onclick='loadMoreBlips(-1)'><  Load Previous Results</div>"
			}
			ListParent.appendChild(newDiv, ListParent.lastChild);

		} else {
			if (offset > 0) {
				newDiv = document.createElement("div");
				newDiv.id = "ListLoad";
				newDiv.className = "rowoption";
				newDiv.innerHTML = "<div id='ListPrev' style='float:left' class='ListLoadMore'><  Load Previous Results</div>"
				ListParent.appendChild(newDiv, ListParent.lastChild);
				$(newDiv).bind("click", function(){
				    loadMoreBlips(-1); 
				});
			}
		}
}




TapOnce=false;
function DetectDoubleTap() {
	
	if (TapOnce) {
		TapOnce=false;
		return true;
	} else {
		TapOnce=true;
		setTimeout("TapOnce=false;",500);
		return false;
	}
	
}

	function ThumbListSwitcher(type) {
		HidePopUp();
		

		
		if (toggle=='ThumbnailView') {
			$('.SwitchList').addClass('SwitchThumb').removeClass('SwitchList');
			
			$('#ThumbnailView_Everyone').hide();
			$('#ThumbnailView_Friends').hide();
			$('#ListView_Friends').hide();
			$('#ListView_Everyone').hide();
			
			 $('#ThumbnailView_'+neighborSwitch).show();
			 $('#ListView_'+neighborSwitch).hide();
			
			 $('#ListView_'+neighborSwitch).show();
			 $('#ThumbnailView_'+neighborSwitch).hide();
			 $('#ListView_'+neighborSwitch).css({ opacity:1});
			 $('#ThumbnailView_'+neighborSwitch).css({ opacity:0});
			toggle='ListView';
		} else {
			$('.SwitchThumb').addClass('SwitchList').removeClass('SwitchThumb');
			
			$('#ThumbnailView_Everyone').hide();
			$('#ThumbnailView_Friends').hide();
			$('#ListView_Friends').hide();
			$('#ListView_Everyone').hide();
			
			$('#ThumbnailView_'+neighborSwitch).show();
			$('#ListView_'+neighborSwitch).hide();
			$('#ListView_'+neighborSwitch).css({ opacity:0});
			$('#ThumbnailView_'+neighborSwitch).css({ opacity:1});
			toggle='ThumbnailView';
		}
	}
	
	
	
	function DropDown(el) {
		if (el.id == 'SortDropDown') {
			$('#'+el.id+'Selected').text("Sort By:");
		} else {
			$('#'+el.id+'Selected').text("Choose Category:");
		}
		
		if (el.style.height == '32px') {
			if (el.id == 'SortDropDown') {
				el.style.height='250px'; 
			} else {
				el.style.height='300px'; 
			}
		} else {
			el.style.height='32px'; 
			if (el.id == 'SortDropDown') {
				$('#'+el.id+'Selected').text(SortDropDown);
			} else {
				$('#'+el.id+'Selected').text(TagDropDown);
			}
		}
	}
	TagDropDown = 'All Categories';

	function CloseDrop(sortID, controlID, script) {
		var pos=sortID.indexOf("Selected");
		if (pos == -1) {
			sortText = $('#'+sortID).html();
			$('#'+controlID+'Selected').text(sortText);
			if (controlID == 'SortDropDown') {
				SortDropDown = sortText;
				func = script+'(sortID, sub_category)'
			} else {
				TagDropDown = sortText;
				func = script+'(sort, sortID)'	
			}
			offset=0
			friend_offset = 0
			everyone_offset = 0
			eval(func)
		}
	}
	
	
	
	function TransformSpotlightWindow(theWindow) {
		if (document.getElementById(theWindow).style.height == '270px') {
			document.getElementById(theWindow).style.height = '140px'; 
			document.getElementById(theWindow+'_Triangle').src = triangle_down.src
		}  else {
			document.getElementById(theWindow).style.height = '270px'; 
			document.getElementById(theWindow+'_Triangle').src = triangle_up.src
		}
	}



	function HighlightRow(therow) {
	  if (moved_after_touch) {
	    return;
	  }

	  //$('#'+therow.id).css("background-color","#2C68E4");
	  $(therow).addClass("Row_Active");
	
	  $('#'+therow.id+' > ProfileMsg > span').addClass("RowWhite");
	
	  $('#'+therow.id+' > * ').each(
			function( intIndex ){			  
				 $(this).addClass("RowWhite");
				}
			);
	}
	function UnHighlightRow(therow) {
		
		//$('#'+therow.id).css("background-color","white");
		$(therow).removeClass("Row_Active");
		$('#'+therow.id+' > ProfileMsg > span').removeClass("RowWhite");
	    $('#'+therow.id+' > * ').each(
			function( intIndex ){			  
			 $(this).removeClass("RowWhite");
			}
		);}


		
		
