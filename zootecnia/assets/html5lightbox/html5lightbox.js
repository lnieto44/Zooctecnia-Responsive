/**
    HTML5 Image and Video LightBox
    Description: A jQuery image and video lightbox plugin - adds awesome HTML5 and jQuery LightBox effect to your web site, 
                 supports images, Flash SWF files, YouTube, Vimeo and local videos, 
                 works on Windows, Linux, Mac, iPhone, iPad, Android, Windows Phone and all modern web browsers.
    
    Website: http://html5box.com/
    Version: 1.9
    Author: HTML5Box.com
    
    ------------------- Features -------------------------
    
    1. Support images, Flash, YouTube, Vimeo and local Videos
    2. Support mp4, m4v, flv, ogg, ogv and webm video formats
    3. Works on Windows, Linux, Mac, iPhone, iPad, Android, Windows Phone and all modern web browsers
    4. Switch to HTML5 video player on mobile/tablet
    5. Automatically load jQuery from Google cloud if jQuery is not included in the web page
    6. Easy installation and configuration
    
    ------------- Installation Guide ---------------------
    
    http://html5box.com/html5lightbox/index.php#quickinstallation
    
    --------------- Version History -----------------------
    Version 1.9:
    	1. Fix the bug under Opera
    	2. Support all kinds of Youtube video link addresses
    	 
    Version 1.8:
        1. Fix the bug in Inetnet Explorer 9 compatibility mode
        
    Version 1.7:
    	1. Add an option "html5player" with default value as true. This option will make the LightBox player HTML5 preferable, 
    	   and it will only fallback to Flash player when HTML5 is not supported.
    	2. MP4/M4V video format is supported by HTML5 player of most modern devices and web browsers: 
    	   iPhone, iPad, Android, Chrome, Safari, Internet Explorer 9. But there is one exception, Mozilla Firefox. 
    	   Firefox only supports WebM and Ogg/Ogv video format. To make HTML player works on Firefox, 
    	   you need to provide a WebM or Ogg video. You can now use data tag data-webm or data-ogg to provide an 
    	   alternative video format. An example code is as following:
           <a class="html5lightbox" href="images/Big_Buck_Bunny_1.m4v" data-webm="images/Big_Buck_Bunny_1.webm"><img src="images/Big_Buck_Bunny_1.jpg"></a>
           If WebM or Ogg video is not supported, on Firefox, it will fallback to Flash player.
    	3. Fix the bug when there are spaces in the file or url address
    	4. JavaScript API function to show lightbox:
    	   
    	   The function prototype is:
    	   html5Lightbox.showLightbox = function(type, href, title, width, height, webm, ogg)
    	   type: 0 - IMAGE, 1 - FLASH, 2 - VIDEO,  3 - YOUTUBE, 4 - VIMEO, 5 - PDF, 6 - MP3, 7 - WEB
    	   
    	   To show image:
    	   html5Lightbox.showLightbox(0, 'images/Toronto_1024.jpg', 'Image lightbox');
    	   
    	   To show Video:
    	   html5Lightbox.showLightbox(2, 'images/Big_Buck_Bunny_1.m4v', 'Video lightbox', 480, 270, 'images/Big_Buck_Bunny_1.webm');
    	   
    	   To show YouTube Video:
    	   html5Lightbox.showLightbox(3, 'http://www.youtube.com/embed/YE7VzlLtp-4', 'YouTube lightbox');
    	
    Version 1.6:
    	1. Remove loading jQuery from cloud
    	
    Version 1.5:
    	1. Add an option "auotplay" with default value as true. This option will enable video automatically playing
    	2. Remove "Related Videos" at the end of YouTube video playing
    	
    Version 1.4:
    	1. Fix the bug under IE7 and IE8
    	2. Read configuration from web page and easy branding
    	
    Version 1.3:
    	1. Fix the bug: navigation buttons display below the YouTube player
    	2. Fix the bug under IE8
    	
    Version 1.2:
        1. Change license to GPL2
        2. Move the navigation buttons to left and right side of the pop-up box
        
    ------------------- License ---------------------------
    
    Copyright 2012 HTML5Box.com

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
    
*/


/**
 * Check jQuery, if not loaded, automatically load from google cloud or from local if loading from cloud failed in 5 seconds
 */
(function() {
	
	var scripts = document.getElementsByTagName("script");
	var jsSrc = scripts[scripts.length-1].src;
	var jsFolder = jsSrc.substr(0, jsSrc.lastIndexOf("/") + 1);
	
	if ((typeof jQuery == 'undefined') || (parseFloat(/^\d\.\d+/i.exec(jQuery.fn.jquery)) < 1.6)) {
	
		var head = document.getElementsByTagName("head")[0];
	    var script = document.createElement('script');
	    script.setAttribute('type', 'text/javascript');	    
	    if (script.readyState)
    	{
    		script.onreadystatechange = function() {
    			if (script.readyState == 'loaded' || script.readyState == 'complete')
    			{
    				script.onreadystatechange = null;
    				loadHtml5LightBox(jsFolder);
    	        }
    	    };
    	} 
    	else 
    	{
    		script.onload = function() {
    			loadHtml5LightBox(jsFolder);
    	    };
    	}
	    script.setAttribute('src', jsFolder + "jquery.js");
	    head.appendChild(script);
	}
	else
	{
		loadHtml5LightBox(jsFolder);
	}
	
})();

/**
 * Call back of check jQuery
 * @param jsFolder
 */
function loadHtml5LightBox(jsFolder) {
	
	/**
	 * jQuery plugin
	 */
	(function($) {
	
		$.fn.html5lightbox = function(options) {
				
			var inst = this;
			
			inst.options = jQuery.extend({
				
				// autoplay
				autoplay: 				true,
				html5player:			true,
				
				// look
				overlaybgcolor: 		"#000000",
				overlayopacity:			0.9,
				bgcolor:				"#ffffff",
				bordersize:				8,
				barheight:				36,
				
				// init
				loadingwidth:			64,
				loadingheight:			64,
				
				// speed
				resizespeed:			400,
				fadespeed:				400,
				
				// skins
				skinfolder:				"skins/default/",
				
				// title
				titlecss:				"{color:#333333; font-size:16px; font-family:Armata,sans-serif,Arial; overflow:hidden; white-space:nowrap;}",
				
				// error
				errorwidth:				280,
				errorheight:			48,
				errorcss:			    "{text-align:center; color:#ff0000; font-size:14px; font-family:Arial, sans-serif;}",
				
				// free version
				version:				"1.8",
				stamp:					false,
				freemark:				"html5box.com",
				freelink:				"http://html5box.com/",
				watermark:				"",
				watermarklink:			""
								
			}, options);
			
			if ( (typeof html5lightbox_options != 'undefined') && html5lightbox_options )
				jQuery.extend(inst.options, html5lightbox_options);
			
			// folders
			inst.options.htmlfolder = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1);
			inst.options.jsfolder = jsFolder;
							
			if ((inst.options.skinfolder.charAt(0) != "/") && (inst.options.skinfolder.substring(0, 5) != "http:") && (inst.options.skinfolder.substring(0, 6) != "https:"))
				inst.options.skinfolder = jsFolder + inst.options.skinfolder;
			
			// types
			inst.options.types = ["IMAGE", "FLASH", "VIDEO", "YOUTUBE", "VIMEO", "PDF", "MP3", "WEB"];
			
			// run time			
			
			// Array(type, href, title, group, width, height)
			inst.elemArray = new Array();					
			inst.options.curElem = -1;					
							
			// environment
			inst.options.flashInstalled = false;
			try 
			{
				if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) 
					inst.options.flashInstalled = true;
			}
			catch(e) 
			{
				if (navigator.mimeTypes["application/x-shockwave-flash"]) 
					inst.options.flashInstalled = true;
			}
			inst.options.html5VideoSupported = (!!document.createElement('video').canPlayType);
			inst.options.isChrome = (navigator.userAgent.match(/Chrome/i) != null);
			inst.options.isFirefox = (navigator.userAgent.match(/Firefox/i) != null);
			inst.options.isOpera = (navigator.userAgent.match(/Opera/i) != null);
			inst.options.isSafari = (navigator.userAgent.match(/Safari/i) != null);
			inst.options.isIE9 = $.browser.msie && inst.options.html5VideoSupported;
			inst.options.isIE678 = $.browser.msie && !inst.options.isIE9;	
			inst.options.isAndroid = (navigator.userAgent.match(/Android/i) != null);
			inst.options.isIPad = (navigator.userAgent.match(/iPad/i) != null);
			inst.options.isIPhone = ((navigator.userAgent.match(/iPod/i) != null) || (navigator.userAgent.match(/iPhone/i) != null));
			inst.options.isMobile = (inst.options.isAndroid || inst.options.isIPad || inst.options.isIPhone);
						
			inst.options.resizeTimeout = -1;
			
			var inst = this;
			
			/**
			* Init plugin
			*/
			inst.init = function() 
			{	
				inst.readData();
				inst.createMarkup();
			};
			
			var ELEM_TYPE = 0, ELEM_HREF = 1, ELEM_TITLE = 2, ELEM_GROUP = 3, ELEM_WIDTH = 4, ELEM_HEIGHT = 5, ELEM_HREF_WEBM = 6, ELEM_HREF_OGG = 7;
			/**
			* Read list from HTML codes
			*/
			inst.readData = function()
			{	
				inst.each( function() {
					
					if (this.nodeName.toLowerCase() != 'a')
						return;
					
					var $this = $(this);
					
					var fileType = inst.checkType($this.attr('href'));
					if (fileType < 0)
						return;
						
					inst.elemArray.push(new Array(fileType, $this.attr('href'), $this.attr('title'), $this.data('group'), $this.data('width'), $this.data('height'), $this.data('webm'), $this.data('ogg')));
				});
				
				
			};
			
			/**
			* Create HTML markup of Lightbox
			*/
			inst.createMarkup = function()
			{
				// google font
				var fontRef = ('https:' == document.location.protocol ? 'https' : 'http') + "://fonts.googleapis.com/css?family=Armata";
				var fontLink = document.createElement("link");
				fontLink.setAttribute("rel", "stylesheet");
				fontLink.setAttribute("type", "text/css");
				fontLink.setAttribute("href", fontRef);
				document.getElementsByTagName("head")[0].appendChild(fontLink);
				
				// css
				var styleCss = "#html5-text " + inst.options.titlecss;
				styleCss += ".html5-error " + inst.options.errorcss;
				$("head").append("<style type='text/css'>" + styleCss + "</style>");
				
				inst.$lightbox = jQuery("<div id='html5-lightbox' style='display:none;position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:999;'>" +
						"<div id='html5-lightbox-overlay' style='display:block;position:absolute;top:0px;left:0px;width:100%;height:100%;background-color:" + inst.options.overlaybgcolor + ";opacity:" + inst.options.overlayopacity + ";filter:alpha(opacity=" + Math.round(inst.options.overlayopacity * 100) + ");'></div>" +
						"<div id='html5-lightbox-box' style='display:block;position:relative;margin:0px auto;overflow:hidden;'>" +
							"<div id='html5-elem-box' style='display:block;position:relative;margin:0px auto;text-align:center;'>" +
								"<div id='html5-elem-wrap' style='display:block;position:relative;margin:0px auto;text-align:center;background-color:" + inst.options.bgcolor + ";'>" + 
									"<div id='html5-loading' style='display:none;position:absolute;top:0px;left:0px;text-align:center;width:100%;height:100%;background:url(\"" + inst.options.skinfolder + "loading.gif\") no-repeat center center;'></div>" +
									"<div id='html5-error' class='html5-error' style='display:none;position:absolute;padding:" + inst.options.bordersize + "px;text-align:center;width:" + inst.options.errorwidth + "px;height:" + inst.options.errorheight + "px;'>" + "The requested content cannot be loaded.<br />Please try again later." + "</div>" +
									"<div id='html5-image' style='display:none;position:absolute;top:0px;left:0px;padding:" + inst.options.bordersize + "px;text-align:center;'></div>" +
								"</div>" + 
								"<div id='html5-next' style='display:none;cursor:pointer;position:absolute;right:" + inst.options.bordersize + "px;top:40%;'><img src='" + inst.options.skinfolder + "next.png'></div>" +
								"<div id='html5-prev' style='display:none;cursor:pointer;position:absolute;left:" + inst.options.bordersize + "px;top:40%;'><img src='" + inst.options.skinfolder + "prev.png'></div>" +							
							"</div>" +
							"<div id='html5-elem-data-box' style='display:none;position:relative;width:100%;margin:0px auto;height:" + inst.options.barheight + "px;background-color:" + inst.options.bgcolor + ";'>" +
								"<div id='html5-text' style='display:block;float:left;overflow:hidden;margin-left:" + inst.options.bordersize + "px;'></div>" +
								"<div id='html5-close' style='display:block;cursor:pointer;float:right;margin-right:" + inst.options.bordersize + "px;'><img src='" + inst.options.skinfolder + "close.png'></div>" +
							"</div>" +
							"<div id='html5-watermark' style='display:none;position:absolute;left:" + String(inst.options.bordersize + 2) + "px;top:" + String(inst.options.bordersize + 2) + "px;'></div>" + 
						"</div>" +
					"</div>");
				
				inst.$lightbox.appendTo("body");
				
				inst.$lightboxBox = $("#html5-lightbox-box", inst.$lightbox);
				inst.$elem = $("#html5-elem-box", inst.$lightbox);
				inst.$elemWrap = $("#html5-elem-wrap", inst.$lightbox);
				inst.$loading = $("#html5-loading", inst.$lightbox);
				inst.$error = $("#html5-error", inst.$lightbox);
				inst.$image = $("#html5-image", inst.$lightbox);
				inst.$elemData = $("#html5-elem-data-box", inst.$lightbox);				
				inst.$text = $("#html5-text", inst.$lightbox);
				inst.$next = $("#html5-next", inst.$lightbox);
				inst.$prev = $("#html5-prev", inst.$lightbox);
				inst.$close = $("#html5-close", inst.$lightbox);
				
				inst.$watermark = $("#html5-watermark", inst.$lightbox);
				if (inst.options.stamp)
				{
					inst.$watermark.html("<a href='" + inst.options.freelink + "' style='text-decoration:none;'><div style='display:block;width:120px;height:20px;text-align:center;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;filter:alpha(opacity=60);opacity:0.6;background-color:#333333;color:#ffffff;font:12px Armata,sans-serif,Arial;'><div style='line-height:20px;'>" + inst.options.freemark + "</div></div></a>");
				}
				else if (inst.options.watermark)
				{
					var html = "<img src='" + inst.options.watermark + "' style='border:none;' />";
					if (inst.options.watermarklink)
						html = "<a href='" + inst.options.watermarklink + "' target='_blank'>" + html + "</a>";
					inst.$watermark.html(html);
				}
				
				$("#html5-lightbox-overlay", inst.$lightbox).click(inst.finish);
				inst.$close.click(inst.finish);
				inst.$next.click(function(){
						inst.gotoSlide(-1);
					});
				inst.$prev.click(function(){
						inst.gotoSlide(-2);
					});
				
				$(window).resize(function(){
					
					if (!inst.options.isMobile)
					{
						clearTimeout(inst.options.resizeTimeout);
						inst.options.resizeTimeout = setTimeout(function(){ inst.resizeWindow(); }, 500);
					}
				});
				
				$(window).scroll(function(){
					
						inst.scrollBox();
				});
	
				$(window).bind('orientationchange', function(e){
					
					if (inst.options.isMobile)
						inst.resizeWindow();
				});
			};
			
			/**
			 * Calc next and previous tiem
			 */
			inst.calcNextPrevElem = function()
			{
				inst.options.nextElem = -1;
				inst.options.prevElem = -1;
				
				var j, curGroup = inst.elemArray[inst.options.curElem][ELEM_GROUP];
				if ((curGroup != undefined) && (curGroup != null))
				{	
					for (j= inst.options.curElem + 1; j< inst.elemArray.length; j++)
					{
						if ( inst.elemArray[j][ELEM_GROUP] == curGroup )
						{
							inst.options.nextElem = j;
							break;
						}
					}	
					if (inst.options.nextElem < 0)
					{
						for (j= 0; j< inst.options.curElem; j++)
						{
							if ( inst.elemArray[j][ELEM_GROUP] == curGroup )
							{
								inst.options.nextElem = j;
								break;
							}
						}
					}
					
					if (inst.options.nextElem >= 0)
					{
						for (j= inst.options.curElem -1; j>= 0; j--)
						{
							if ( inst.elemArray[j][ELEM_GROUP] == curGroup )
							{
								inst.options.prevElem = j;
								break;
							}
						}
						if (inst.options.prevElem < 0)
						{
							for (j = inst.elemArray.length -1; j> inst.options.curElem; j--)
							{
								if ( inst.elemArray[j][ELEM_GROUP] == curGroup )
								{
									inst.options.prevElem = j;
									break;
								}
							}
						}
					}
				}
			};
			
			/**
			* Start image displaying
			*/
			inst.clickHandler = function()
			{
				if (inst.elemArray.length <= 0)
					return true;
				
				var $this = $(this);
				
				// hide elements
				inst.hideObjects();
				
				// get current elem
				for (var i= 0; i< inst.elemArray.length; i++)
				{
					if ( inst.elemArray[i][ELEM_HREF] == $this.attr("href") )
						break;
				}
				if (i == inst.elemArray.length)
					return true;
				
				inst.options.curElem = i;
				inst.options.nextElem = -1;
				inst.options.prevElem = -1;
								
				// calc next and previous elem
				inst.calcNextPrevElem();
				
				// hide navigation buttons
				inst.$next.hide();
				inst.$prev.hide();
				
				// show overlay
				inst.reset();
				
				inst.$lightbox.show();
				inst.$lightbox.css("top", $(window).scrollTop());
				
				// load loading box
				var boxW = inst.options.loadingwidth + 2* inst.options.bordersize;
				var boxH = inst.options.loadingheight + 2* inst.options.bordersize;
				var boxT = Math.round($(window).height() /2 - (boxH + inst.options.barheight)/2);
				inst.$lightboxBox.css({"margin-top": boxT, "width": boxW, "height": boxH});
				inst.$elemWrap.css({"width": boxW, "height": boxH});
				
				inst.loadCurElem();
				
				// disable link
				return false;
			};
			
			/**
			 * load elem
			 */
			inst.loadElem = function(elem)
			{
				// unbind show navgiation buttons
				inst.$elem.unbind("mouseenter").unbind("mouseleave").unbind("mousemove");
				inst.$next.hide();
				inst.$prev.hide();
				
				// show loading
				inst.$loading.show();
				
				// load image and load SWF, video or PDF
				switch (elem[ELEM_TYPE])
				{
					case 0:
						var imgLoader = new Image();
						$(imgLoader).load(function() {
							inst.showImage(elem, imgLoader.width, imgLoader.height);
						});
						$(imgLoader).error(function() {
							inst.showError();
						});
						imgLoader.src = elem[ELEM_HREF];
						break;
						
					case 1:
						inst.showSWF(elem);
						break;
					
					case 2:
						inst.showVideo(elem);
						break;
					
					case 3:
					case 4:
						inst.showYoutubeVimeo(elem);
						break;
					
					case 5:
						inst.showPDF(elem);
						break;
					
					case 6:
						inst.showMP3(elem);
						break;
						
					case 7:
						inst.showWeb(elem);
						break;	
				}
			};
			
			/**
			* Load current elem: ["IMAGE", "FLASH", "VIDEO", "YOUTUBE", "VIMEO", "PDF", "MP3", "WEB"];
			*/
			inst.loadCurElem = function()
			{
				inst.loadElem(inst.elemArray[inst.options.curElem]);
			};
			
			/**
			* Show error message of current element
			*/
			inst.showError = function()
			{
				inst.$loading.hide();
				
				inst.resizeLightbox(inst.options.errorwidth, inst.options.errorheight, true, function(){
					
					inst.$error.show();
					inst.$elem.fadeIn(inst.options.fadespeed, function(){					
						
						// show image data
						inst.showData();
					});
				});
			};
			
			/**
			 * Calc width of title, leave space for play/pause and close buttons
			 */
			inst.calcTextWidth = function(objW)
			{
				var textW = objW - 36;
				if ((inst.options.prevElem > 0) || (inst.options.nextElem > 0))
					textW -= 36;
				return textW;
			};
			
			/**
			* Show image, callback of function loadElem
			*/
			inst.showImage = function(elem, imgW, imgH)
			{
				var elemW, elemH;
				if (elem[ELEM_WIDTH])
				{
					elemW = elem[ELEM_WIDTH];
				}
				else
				{
					elemW = imgW;
					elem[ELEM_WIDTH] = imgW;
				}
				
				if (elem[ELEM_HEIGHT])
				{
					elemH = elem[ELEM_HEIGHT];
				}
				else
				{
					elemH = imgH;
					elem[ELEM_HEIGHT] = imgH;
				}
				
				var sizeObj = inst.calcElemSize({w: elemW, h: elemH});
				
				// resize container box
				inst.resizeLightbox(sizeObj.w, sizeObj.h, true, function(){
					
					// show image	
					inst.$text.css({width: inst.calcTextWidth(sizeObj.w)});
					inst.$text.html(elem[ELEM_TITLE]);
					
					inst.$image.show().css({width: sizeObj.w, height: sizeObj.h});
					inst.$image.html("<img src='" + elem[ELEM_HREF] + "' width='" + sizeObj.w + "' height='" + sizeObj.h + "' />");
					inst.$elem.fadeIn(inst.options.fadespeed, function(){
						
						// show image data
						inst.showData();
					});
				});
			};
			
			/**
			* Show Flash SWF
			*/
			inst.showSWF = function(elem)
			{
				var dataW = (elem[ELEM_WIDTH]) ? elem[ELEM_WIDTH] : 480;
				var dataH = (elem[ELEM_HEIGHT]) ? elem[ELEM_HEIGHT] : 270;
				
				var sizeObj = inst.calcElemSize({w: dataW, h: dataH});
				dataW = sizeObj.w;
				dataH = sizeObj.h;
				
				inst.resizeLightbox(dataW, dataH, true, function(){
					
					// show image		
					inst.$text.css({width: inst.calcTextWidth(dataW)});
					inst.$text.html(elem[ELEM_TITLE]);
					inst.$image.html("<div id='html5lightbox-swf' style='display:block;width:" + dataW + "px;height:" + dataH + "px;'></div>").show();
					inst.embedFlash($("#html5lightbox-swf"), dataW, dataH, elem[ELEM_HREF], 'window', {width:dataW, height:dataH});

					inst.$elem.show();
					inst.showData();		
				});

			};
			
			/**
			* Show video
			*/
			inst.showVideo = function(elem)
			{
				var dataW = (elem[ELEM_WIDTH]) ? elem[ELEM_WIDTH] : 480;
				var dataH = (elem[ELEM_HEIGHT]) ? elem[ELEM_HEIGHT] : 270;
				var sizeObj = inst.calcElemSize({w: dataW, h: dataH});
				dataW = sizeObj.w;
				dataH = sizeObj.h;
				
				inst.resizeLightbox(dataW, dataH, true, function(){
					
					// show image	
					inst.$text.css({width: inst.calcTextWidth(dataW)});
					inst.$text.html(elem[ELEM_TITLE]);
					inst.$image.html("<div id='html5lightbox-video' style='display:block;width:" + dataW + "px;height:" + dataH + "px;'></div>").show();
					
					var isHTML5 = false;
					
					// html5 preferable, mobile or when flash not installed
					if (inst.options.isMobile)
					{
						isHTML5 = true;
					}
					else if ( (inst.options.html5player || !inst.options.flashInstalled) && inst.options.html5VideoSupported)
					{
						if ((!inst.options.isFirefox && !inst.options.isOpera) || ((inst.options.isFirefox || inst.options.isOpera) && (elem[ELEM_HREF_OGG] || elem[ELEM_HREF_WEBM])))
							isHTML5 = true;
					}
					
					if (isHTML5)
					{
						var videoSrc = elem[ELEM_HREF];
						if (inst.options.isFirefox || inst.options.isOpera || !videoSrc)
							videoSrc = elem[ELEM_HREF_WEBM] ? elem[ELEM_HREF_WEBM] : elem[ELEM_HREF_OGG];

						inst.embedHTML5Video($("#html5lightbox-video"), dataW, dataH, videoSrc, inst.options.autoplay);
					}
					else
					{
						var videoFile = elem[ELEM_HREF];
						if ((videoFile.charAt(0) != "/") && (videoFile.substring(0, 5) != "http:") && (videoFile.substring(0, 6) != "https:"))
							videoFile = inst.options.htmlfolder + videoFile;
						inst.embedFlash($("#html5lightbox-video"), dataW, dataH, inst.options.jsfolder + "html5boxplayer.swf", 'transparent', {width:dataW, height:dataH, videofile: videoFile, autoplay: (inst.options.autoplay ? "1" : "0"), errorcss: ".html5box-error" + inst.options.errorcss, id: 0});
					}
					
					inst.$elem.show();
					inst.showData();						
				});
			};
			
			/**
			 * Convert Youtube href to http://www.youtube.com/embed/id
			 * @param href
			 */
			inst.prepareYoutubeHref = function(href)
			{
				var youtubeId = '';
				
				var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			    var match = href.match(regExp);
			    if ( match && match[7] && (match[7].length==11) )
			        youtubeId = match[7];
			   
			    return 'http://www.youtube.com/embed/' + youtubeId;
			};
			
			/**
			 * Show YouTube and Vimeo
			 */
			inst.showYoutubeVimeo = function(elem)
			{
				
				var dataW = (elem[ELEM_WIDTH]) ? elem[ELEM_WIDTH] : 480;
				var dataH = (elem[ELEM_HEIGHT]) ? elem[ELEM_HEIGHT] : 270;
				var sizeObj = inst.calcElemSize({w: dataW, h: dataH});
				dataW = sizeObj.w;
				dataH = sizeObj.h;
				
				inst.resizeLightbox(dataW, dataH, true, function(){
					
					// show image	
					inst.$text.css({width: inst.calcTextWidth(dataW)});
					inst.$text.html(elem[ELEM_TITLE]);
					inst.$image.html("<div id='html5lightbox-video' style='display:block;width:" + dataW + "px;height:" + dataH + "px;'></div>").show();
					
					var href = elem[ELEM_HREF];
					if (elem[ELEM_TYPE] == 3)
						href = inst.prepareYoutubeHref(href);
					
					if (inst.options.autoplay)
					{
						if (href.indexOf("?") < 0)
							href += "?autoplay=1";
						else
							href += "&autoplay=1";
					}
					
					if (elem[ELEM_TYPE] == 3)
					{
						if (href.indexOf('?') < 0)
							href += '?wmode=transparent&rel=0';
						else
							href += '&wmode=transparent&rel=0';
						
						if (inst.options.html5player)
							href += "&html5=1";
					}
					
					$("#html5lightbox-video").html("<iframe width='" + dataW + "' height='" + dataH + "' src='" + href + "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");

					inst.$elem.show();
					inst.showData();		
				});	
			};
			
			/**
			* Show PDF
			*/
			inst.showPDF = function(elem)
			{
			};
			
			/**
			* Show MP3
			*/
			inst.showMP3 = function(elem)
			{
			};
			
			/**
			 * Show Webpage
			 */
			inst.showWeb = function(elem)
			{
				var dataW = (elem[ELEM_WIDTH]) ? elem[ELEM_WIDTH] : $(window).width();
				var dataH = (elem[ELEM_HEIGHT]) ? elem[ELEM_HEIGHT] : $(window).height();
				var sizeObj = inst.calcElemSize({w: dataW, h: dataH});
				dataW = sizeObj.w;
				dataH = sizeObj.h;
				
				inst.resizeLightbox(dataW, dataH, true, function(){
					
					// show image	
					inst.$text.css({width: inst.calcTextWidth(dataW)});
					inst.$text.html(elem[ELEM_TITLE]);
					inst.$image.html("<div id='html5lightbox-web' style='display:block;width:" + dataW + "px;height:" + dataH + "px;'></div>").show();
					$("#html5lightbox-web").html("<iframe width='" + dataW + "' height='" + dataH + "' src='" + elem[ELEM_HREF] + "' frameborder='0'></iframe>");

					inst.$elem.show();
					inst.showData();		
				});

			};
			
			/**
			 * Scroll box
			 */
			inst.scrollBox = function()
			{
				inst.$lightbox.css("top", $(window).scrollTop());
			};
			
			/**
			 * Resize the lightbox window
			 */
			inst.resizeWindow = function()
			{
				var boxT = Math.round($(window).height() /2 - (inst.$lightboxBox.height() + inst.options.barheight)/2);
				inst.$lightboxBox.animate({"margin-top": boxT}, inst.options.resizespeed);
			};
			
			/**
			 * Calculate image or elem size according to the window size
			 */
			inst.calcElemSize = function(sizeObj)
			{	
				// resize according to window size
				var h0 = $(window).height() - inst.options.barheight - 2 * inst.options.bordersize;
				if (sizeObj.h > h0)
				{
					sizeObj.w = Math.round(sizeObj.w * h0 / sizeObj.h);
					sizeObj.h = h0;
				}
				
				var w0 = $(window).width() - 2 * inst.options.bordersize;
				if (sizeObj.w > w0)
				{
					sizeObj.h = Math.round(sizeObj.h * w0 / sizeObj.w);
					sizeObj.w = w0;
				}
				
				return sizeObj;
			};
			
			/**
			 * Resize lightbox to show data
			 */
			inst.showData = function()
			{
				inst.$elemData.show();
				inst.$lightboxBox.animate({height: inst.$lightboxBox.height() + inst.options.barheight}, {queue: true, duration: inst.options.resizespeed});
			};
			
			/**
			 * Resize lightbox according to elem width and height
			 */
			inst.resizeLightbox = function(elemW, elemH, bAnimate, onFinish)
			{
				var speed = (bAnimate) ? inst.options.resizespeed: 0;
				var boxW = elemW + 2* inst.options.bordersize;
				var boxH = elemH + 2* inst.options.bordersize;
				var boxT = Math.round($(window).height() /2 - (boxH + inst.options.barheight)/2);
				
				if ((boxW == inst.$elemWrap.width()) && (boxH == inst.$elemWrap.height()))
					speed = 0;
				
				// hide loading before resize
				inst.$loading.hide();
				
				// hide watermark
				inst.$watermark.hide();
				
				inst.$lightboxBox.animate({"margin-top": boxT}, speed, function(){
					inst.$lightboxBox.css({"width": boxW, "height": boxH});
					inst.$elemWrap.animate({width: boxW}, speed)
						.animate({height: boxH}, speed, function() {
							
							// show loading
							inst.$loading.show();
							
							// show watermark
							inst.$watermark.show();
							
							// show navigation buttons on mouse move and enter
							inst.$elem.bind("mouseenter mousemove", function(){
								if ((inst.options.prevElem >= 0) || (inst.options.nextElem >= 0))
								{
									inst.$next.fadeIn();
									inst.$prev.fadeIn();
								}
							});
							
							inst.$elem.bind("mouseleave", function(){
								inst.$next.fadeOut();
								inst.$prev.fadeOut();
							});
							
							onFinish();
						});
				});
			};
			
			/**
			 * Reset lightbox
			 */
			inst.reset = function()
			{
				if (inst.options.stamp)
					inst.$watermark.hide();
				
				inst.$image.empty();
				inst.$text.empty();
				
				inst.$error.hide();
				inst.$loading.hide();
				inst.$image.hide();
				
				inst.$elemData.hide();
				
			};
			/****************************************************************************
			* Helper functions
			*/
			
			/**
			* Close lightbox
			*/
			inst.finish = function()
			{
				inst.reset();
				inst.$lightbox.hide();
				inst.showObjects();
			};
			
			/**
			* Pause auto slideshow
			*/
			inst.pauseSlide = function()
			{
			};
			
			/**
			* start auto slideshow
			*/
			inst.playSlide = function()
			{
			};
			
			/**
			 * goto prev or next slide
			 */
			inst.gotoSlide = function(slide)
			{
				if (slide == -1)
				{
					if (inst.options.nextElem < 0)
						return;
					inst.options.curElem = inst.options.nextElem;
				}
				else if (slide == -2)
				{
					if (inst.options.prevElem < 0)
						return;
					inst.options.curElem = inst.options.prevElem;
				}
				
				inst.calcNextPrevElem();
					
				// load elem
				inst.reset();
				inst.loadCurElem();
			};
			
			/**
			* Enable keyboard switch
			*/
			inst.enableKeyboard = function()
			{
			};
			
			/**
			* Enable swipe switch on touch devices
			*/
			inst.enableSwipe = function()
			{
			};
			
			/**
			* Hide Flash and other objects on the HTML page
			*/
			inst.hideObjects = function()
			{
				$('select, embed, object').css({'visibility': 'hidden'});
			};
			
			/**
			 * Show Flash and other objects
			 */
			inst.showObjects = function()
			{
				$('select, embed, object').css({'visibility': 'visible'});
			};
			
			/**
			 * Embed video with HTML5 video tag
			 */
			inst.embedHTML5Video = function($container, w, h, src, autoplay)
			{
				
				$container.html("<div style='position:absolute;display:block;width:" + w + "px;height:" + h + "px;'><video width=" + w + " height=" + h + ((autoplay) ? " autoplay" : "") + " controls='controls' src='" + src + "'></div>");
				
				if (inst.options.isAndroid)
				{
					var $play = $("<div style='position:absolute;display:block;cursor:pointer;width:" + w + "px;height:" + h + "px;background:url(\"" + inst.options.skinfolder + "playvideo_64.png\") no-repeat center center;'></div>").appendTo($container);;
					
					$play.unbind('click').click(function(){
						
						$(this).hide();
						$("video", $(this).parent())[0].play();
					});
				}
			};
			  
			/**
			 * Embed Flash
			 */
			inst.embedFlash = function($container, w, h, src, wmode, flashVars)
			{
				if (inst.options.flashInstalled)
				{
					var htmlOptions = {
							pluginspage: "http://www.adobe.com/go/getflashplayer",
							quality: "high",
							allowFullScreen: "true",
							allowScriptAccess: "always",
							type: "application/x-shockwave-flash"
						};
					
					htmlOptions.width = w;
					htmlOptions.height = h;
					htmlOptions.src = src;
					htmlOptions.flashVars = $.param(flashVars);
					htmlOptions.wmode = wmode;
					
					var htmlString = "";
					for (var key in htmlOptions)
						htmlString += key + "=" + htmlOptions[key] + " ";
					
					$container.html("<embed " + htmlString + "/>");
				}
				else
				{
					$container.html("<div class='html5lightbox-flash-error' style='display:block; position:relative;text-align:center; width:" + w + "px; left:0px; top:" + Math.round(h /2 - 10) + "px;'><div class='html5-error'><div>The required Adobe Flash Player plugin is not installed</div><br /><div style='display:block;position:relative;text-align:center;width:112px;height:33px;margin:0px auto;'><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player' width='112' height='33'></img></a></div></div>");
				}
			};
			
			/**
			 * Check file type
			 */
			inst.checkType = function(href)
			{
				if (!href)
					return -1;
				
				if (href.match(/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i))
					return 0;
				
				if (href.match(/[^\.]\.(swf)\s*$/i))
					return 1;
				
				if ( href.match(/\.(flv|mp4|m4v|ogv|ogg|webm)(.*)?$/i) ) 
					return 2;
				
				if ( (href.match(/\:\/\/.*(youtube\.com)/i)) || (href.match(/\:\/\/.*(youtu\.be)/i)) )
					return 3;
				
				if (href.match(/\:\/\/.*(vimeo\.com)/i)) 
					return 4;
				
				if (href.match(/[^\.]\.(pdf)\s*$/i))
					return 5;
				
				if (href.match(/[^\.]\.(mp3)\s*$/i))
					return 6;
				
				return 7;
			};
			
			/**********************************************************************
			 * API functions
			 */
			
			/**
			 * Show LightBox
			 * type: 0 - IMAGE, 1 - FLASH, 2 - VIDEO,  3 - YOUTUBE, 4 - VIMEO, 5 - PDF, 6 - MP3, 7 - WEB
			 */
			inst.showLightbox = function(type, href, title, width, height, webm, ogg)
			{
				// hide navigation buttons
				inst.$next.hide();
				inst.$prev.hide();
				
				// show overlay
				inst.reset();
				
				inst.$lightbox.show();
				inst.$lightbox.css("top", $(window).scrollTop());
				
				// load loading box
				var boxW = inst.options.loadingwidth + 2* inst.options.bordersize;
				var boxH = inst.options.loadingheight + 2* inst.options.bordersize;
				var boxT = Math.round($(window).height() /2 - (boxH + inst.options.barheight)/2);
				inst.$lightboxBox.css({"margin-top": boxT, "width": boxW, "height": boxH});
				inst.$elemWrap.css({"width": boxW, "height": boxH});

				inst.loadElem(new Array(type, href, title, null, width, height, webm, ogg));
			};
			
			/**
			 * Add items to arrays
			 */
			inst.addItem = function(href, title, group, width, height, webm, ogg)
			{
				type = inst.checkType(href);
				inst.elemArray.push(new Array(type, href, title, group, width, height, webm, ogg));
			};
			
			/**
			 * show item added by addItem, support group
			 * @param href
			 * @returns {Boolean}
			 */
			inst.showItem = function(href)
			{
				if (inst.elemArray.length <= 0)
					return true;
				
				// hide elements
				inst.hideObjects();
				
				// get current elem
				for (var i= 0; i< inst.elemArray.length; i++)
				{
					if ( inst.elemArray[i][ELEM_HREF] == href )
						break;
				}
				if (i == inst.elemArray.length)
					return true;
				
				inst.options.curElem = i;
				inst.options.nextElem = -1;
				inst.options.prevElem = -1;
								
				// calc next and previous elem
				inst.calcNextPrevElem();
				
				// hide navigation buttons
				inst.$next.hide();
				inst.$prev.hide();
				
				// show overlay
				inst.reset();
				
				inst.$lightbox.show();
				inst.$lightbox.css("top", $(window).scrollTop());
				
				// load loading box
				var boxW = inst.options.loadingwidth + 2* inst.options.bordersize;
				var boxH = inst.options.loadingheight + 2* inst.options.bordersize;
				var boxT = Math.round($(window).height() /2 - (boxH + inst.options.barheight)/2);
				inst.$lightboxBox.css({"margin-top": boxT, "width": boxW, "height": boxH});
				inst.$elemWrap.css({"width": boxW, "height": boxH});
				
				inst.loadCurElem();
				
				return false;
			};
			
			/**********************************************************************
			* Do things here
			*/
			inst.init();
			return inst.unbind('click').click(inst.clickHandler);
			
		};
	})(jQuery);
	
	/**
	 * Apply jQuery plugin for class html5lightbox
	 */
	jQuery(document).ready(function(){
		
		if ( typeof html5Lightbox === 'undefined' )
			html5Lightbox = jQuery(".html5lightbox").html5lightbox();
	});
}