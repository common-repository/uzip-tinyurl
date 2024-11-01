// Docu : http://wiki.moxiecode.com/index.php/TinyMCE:Create_plugin/3.x#Creating_your_own_plugins
var uzip_pluginUrl = '';

(function() {
	// Load plugin specific language pack
	//tinymce.PluginManager.requireLangPack('uzip_tinyurl');
	
	
	tinymce.create('tinymce.plugins.uzip_tinyurl', {
		
		init : function(ed, url) {
		// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');

			uzip_pluginUrl = url;
			ed.addCommand('settinyurl', uzip_makeTinyUrl);

			// Register example button
			ed.addButton('maketiny', {
				title : '有籽网址缩短',
				cmd : 'settinyurl',
				image : url + '/uzip_button.png'
			});
			
			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('maketiny', n.nodeName == 'IMG');
			});
		},
		createControl : function(n, cm) {
			return null;
		},
		getInfo : function() {
			return {
					longname  : '有籽网址缩短',
					author 	  : 'SEVEN',
					authorurl : 'http://blog.sevendot.com',
					infourl   : 'http://uzip.net',
					version   : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('uzip_tinyurl', tinymce.plugins.uzip_tinyurl);
})();

function uzip_makeTinyUrl() {

	var tagtext;
	var inst = tinyMCE.getInstanceById('content');
	var html = inst.selection.getContent();
	
	if(html!=''){
		
		uzip_loading();
		jQuery.getScript(uzip_pluginUrl + '/jquery-1.4.2.min.js', function(){
			
			jQuery.ajax({
				url:'http://uzip.net/api/jsonp/uzip_showPopup/' + encodeURIComponent(html),
				success: uzip_showPopup,
				error: function(){
					uzip_showPopup({url:'', err:"暂时无法连接服务器"});
				},
				dataType: 'jsonp',
				type:'GET'
			});
		});
	}
	else{
		uzip_showPopup({url:'', err:'请先选择一个网址'});
	}
	
	return;
}

function uzip_showPopup(data){
	html = '<a href="' + data.url + '" target="_blank">' + data.url + '</a>';
	err = data.err;
	
	var willIntert = false;
	
	if(err==''){
		willIntert = true;
		tagtext = "<strong>缩短后的网址:</strong><br />" + html;
	}
	else{
		tagtext = "<strong>出错啦</strong><br />" + err;
	}
	
	var mcebutton = document.getElementById("content_maketiny");
	var uzip_popup = document.getElementById("uzip_popup");
	
	jQuery("#uzip_popup").remove();
	
	uzip_popup = document.createElement("div");
	uzip_popup.innerHTML = tagtext;
	uzip_popup.style.display = "none";
	uzip_popup.id = 'uzip_popup';
	mcebutton.appendChild(uzip_popup);
	
	jQuery("#uzip_popup").css({
		"border":"1px solid #ff8a00",
		"padding":"10px",
		"position":"relative",
		"width":"150px",
		"font-size":"12px",
		"background-color": "#fffddd",
		"-moz-border-radius": "5px",
		"-khtml-border-radius": "5px",
		"-webkit-border-radius": "5px",
		"border-radius": "5px"
	}).find("strong").css({
		"color":"#ff8a00",
		"font-weight":"bold"
	});
	jQuery("#uzip_popup").show().animate({opacity:1}, 2000, function(){
		jQuery(this).fadeOut(500);
	});;
	
	if(willIntert){
		window.tinyMCE.execInstanceCommand('content', 'mceInsertContent', false, html);
	}
	
}

function uzip_loading(){
	var mcebutton = document.getElementById("content_maketiny");
	var uzip_popup = document.getElementById("uzip_popup");
	
	jQuery("#uzip_popup").remove();
	
	uzip_popup = document.createElement("div");
	uzip_popup.innerHTML = "<img src='" + uzip_pluginUrl + "/uzip_calling.gif'/> 缩短服务请求中";
	uzip_popup.style.display = "none";
	uzip_popup.id = 'uzip_popup';
	mcebutton.appendChild(uzip_popup);
	
	jQuery("#uzip_popup").css({
		"border":"1px solid #ff8a00",
		"padding":"10px",
		"position":"relative",
		"width":"150px",
		"font-size":"12px",
		"background-color": "#fffddd",
		"-moz-border-radius": "5px",
		"-khtml-border-radius": "5px",
		"-webkit-border-radius": "5px",
		"border-radius": "5px"
	}).show();
}
