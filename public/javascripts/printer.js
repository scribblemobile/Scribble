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