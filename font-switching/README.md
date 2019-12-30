# Font switching
This utility allows the font contained in some HTML tag types to be increased for people who find larger fonts easier to read.

As written the script is designed to support three buttons that switch the size of text to small, medium or large. The change of font size is applied to HTML tags with a CSS class of CssSwitchable. This allows control of which key areas of the page are affected. This makes it easier to manage the changes in pay layout.

How to use
------------
The script AccessibilitySwitcherNoButtons.js script needs to be include by making an entry inside the <head>
    tags e.g.
	
```<script src="AccessibilitySwitcherNoButtons.js" type="application/javascript" /></script>```
  
Creation of the CssSwitch object needs to be added to the onload event of the <body>
    e.g.
	
```<body onload="cssSwitch = new CssSwitch();">```


If there are already other enties in the onload tigger make sure they finish with a semicolon and add cssSwitch = new CssSwitch();

Add "CssSwitchable" to the class of the div that contains the content that can
    be switched e.g.
    
```<div id="contentleft" class="CssSwitchable">```

Add one onclick event to each of the three font switching images.
    e.g.  
    
```onclick="javascript:cssSwitch.switchFontSize(0);```

Pass in 0 for small, 1 for medium and 3 for large.


Add the font-size: (or any other characteristics to change) paragraphs for the
    tags to be switched into the css. For each tag type you will need three class
    entries, one for each of  'size-small','size-medium', 'size-large'.

Here is an example:
```
	#contentleft p.size-small {
		font-size: 14px;
	}
	#contentleft p.size-medium {
		font-size: 18px;
	}
	#contentleft p.size-large {
		font-size: 24px;
	}
	#contentleft a.size-small {
		font-size: 14px;
	}
	#contentleft a.size-medium {
		font-size: 18px;
	}
	#contentleft a.size-large {
		font-size: 24px;
	}
	#contentleft h1.size-small {
		font-size: 30px;
		line-height: 34px;
	}
	#contentleft h1.size-medium {
		font-size: 34px;
		line-height: 38px;
	}
	#contentleft h1.size-large {
		font-size: 38px;
		line-height: 40px;
```
