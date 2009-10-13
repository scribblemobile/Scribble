function submitentersplash(myfield,e)
{
var keycode;
if (window.event) keycode = window.event.keyCode;
else if (e) keycode = e.which;
else return true;

if (keycode == 13)
   {
	window.location.href = '/printer?password='+myfield
   return false;
   }
else
   return true;
}

function selectAllNone(link) {
	if ($(link).html() == "Select all") {
            $("#group INPUT[type='checkbox']").attr('checked', true);
			$(link).html("Select none")
      } else {
		$("#group INPUT[type='checkbox']").attr('checked', false);
		$(link).html("Select all")
	}
}


function MarkMailStatus(link) {
	
	status = 0
	
	if ($(link).html() == "Mark as mailed") {
		status = 1
		alert('hi')
	} else {
		status = 0
	}
	
	
	$("#group INPUT[type='checkbox']").each(
	  function() {
		if ($(this).is(':checked')) {
			$.getJSON("/mailed/"+$(this).attr('id')+".js?status="+status,
		        function(json){
					$("#row"+json).hide();
			});
		}
	  }
	);
}