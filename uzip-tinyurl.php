<?php
/*
Plugin Name: UZIP tinyurl
Plugin URI: http://wordpress.org/extend/plugins/uzip-tinyurl/
Description: A plug-in to make your long link url be tiny in your post.
Version: 1.0.1
Author: SEVEN
Author URI: http://blog.sevendot.com
*/
?>
<?php 

function uzip_tinyurl_addbuttons() {
   // Don't bother doing this stuff if the current user lacks permissions
   //if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
   //  return;
 
   // Add only in Rich Editor mode
   if ( get_user_option('rich_editing') == 'true') {
     add_filter("mce_external_plugins", "add_uzip_tinyurl_tinymce_plugin");
     add_filter('mce_buttons', 'register_uzip_tinyurl_button');
   }
}
 
function register_uzip_tinyurl_button($buttons) {
   array_push($buttons, "separator", "maketiny");
   return $buttons;
}
 
// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function add_uzip_tinyurl_tinymce_plugin($plugin_array) {
	
	$langFileName = '';
	switch (WPLANG)
	{
		case 'zh_CN':
			$langFileName = '';
			break;
		default:
			$langFileName = '_en';
			break;
	}
	
	$plugin_array['uzip_tinyurl'] = get_option('siteurl')."/wp-content/plugins/uzip-tinyurl/editor_plugin$langFileName.js";

	return $plugin_array;
}


// init process for button control
add_action('init', 'uzip_tinyurl_addbuttons');

?>
