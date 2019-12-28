//-----------------------------------------------------------------------
// SwitchConfiguration Class 
//
// The values used to configure the cookie, which CSS to use and the 
// URLs of the CSS files and the button images.
//
// To configure HTML to use this Javascript five things need to be done
//
// 1. This script needs to be include by making an entry inside the <head>
//    tags e.g.
//   <script src="AccessibilitySwitcherNoButtons.js" type="application/javascript" /></script>
//  
// 2. Creation of the CssSwitch needs to be added to the onload event of the <body>
//    e.g.
//    <body onload="cssSwitch = new CssSwitch();">
//
//    If there are already other enties in the onload tigger make sure they finish with
//    a semicolon and add cssSwitch = new CssSwitch();
//
// 3. Add "CssSwitchable" to the class of the div that contains the content that can
//    be switched e.g.
//    <div id="contentleft" class="CssSwitchable">
//
// 4. Add one onclick event to each of the three font switching images.
//    e.g.  onclick="javascript:cssSwitch.switchFontSize(0);
//    Pass in 0 from small, 1 for medium and 3 for large.
//
//
// 5. Add the font-size: (or any other charateristics to change) paragraphs for the
//    tags to be switched into the css. For each tag type you will need three class
//    entries, one for each of  'size-small','size-medium', 'size-large.
//
//    Here is an example:
//
//	#contentleft p.size-small {
//		font-size: 14px;
//	}
//	#contentleft p.size-medium {
//		font-size: 18px;
//	}
//	#contentleft p.size-large {
//		font-size: 24px;
//	}
//	#contentleft a.size-small {
//		font-size: 14px;
//	}
//	#contentleft a.size-medium {
//		font-size: 18px;
//	}
//	#contentleft a.size-large {
//		font-size: 24px;
//	}
//	#contentleft h1.size-small {
//		font-size: 30px;
//		line-height: 34px;
//	}
//	#contentleft h1.size-medium {
//		font-size: 34px;
//		line-height: 38px;
//	}
//	#contentleft h1.size-large {
//		font-size: 38px;
//		line-height: 40px;
//
//-----------------------------------------------------------------------
function SwitchConfiguration()
{
}

// Cookie management
SwitchConfiguration.cookieName       = "nnstyle";

// Size options
SwitchConfiguration.small   = 0;
SwitchConfiguration.medium  = 1;
SwitchConfiguration.large   = 2;
SwitchConfiguration.defaultFont = SwitchConfiguration.small;

// CSS class names
SwitchConfiguration.cssFontSizeClasses = ['size-small','size-medium', 'size-large'];

// CSS class name for switchable DIvs
SwitchConfiguration.switchableDivClass = "CssSwitchable";

// Name of tags inside switchable div that can be switched
// 
// Add other tags to the comma separated list if needed.
//
SwitchConfiguration.switchableTags = ['P','H1', 'A'];


SwitchConfiguration.hasIncludedTagName = function (tagName) 
{ 
    for (var i=0; i < SwitchConfiguration.switchableTags.length; i++)
    {
        if (SwitchConfiguration.switchableTags[i] == tagName)
           {
           return true;
           }
    }
    return false;
}

//-----------------------------------------------------------------------
//CookieManager Class
//
// Sets a cookie that expires at the end of the browser session by not
// including expiry in the cookie
//
// Sets a cookie if a font other than the default is requested
// or if the default is requested and there is already a cookie set.  
//-----------------------------------------------------------------------
CookieManager.emptyCookie   = "";
CookieManager.nameAndEquals = SwitchConfiguration.cookieName +  '=';
function CookieManager()
{
}

function CookieManager_removeSpaces(text) 
{
   var modifiedText = text;
   while (modifiedText.charAt(0) == ' ')
   {
      modifiedText = modifiedText.substring(1, modifiedText.length);
   }
 return modifiedText;

}
CookieManager.removeSpaces = CookieManager_removeSpaces;

function CookieManager_findCssIndexCookie() 
{
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) 
    {
        var cookie  = CookieManager.removeSpaces(cookies[i]);
        if (cookie.indexOf(CookieManager.nameAndEquals) == 0)
        {
           return cookie;
        }
    }
    return CookieManager.emptyCookie;
}
CookieManager.findCssIndexCookie  = CookieManager_findCssIndexCookie;

// Set a cookie only if the font is not default or a cookie has already been set
// This is because if a non default has already been set and a the default is required
// then we need to overwritee the cookie contents.
function CookieManager_cookieNeedsSetting(cssIndex) 
{
   var cssCookie = CookieManager.findCssIndexCookie();

   if ( cssCookie != CookieManager.emptyCookie && cssIndex == SwitchConfiguration.defaultFont) 
     {
        return true;
     }

    if (cssIndex != SwitchConfiguration.defaultFont)
    {
        return true;
    }

    return false;
}
CookieManager.cookieNeedsSetting = CookieManager_cookieNeedsSetting;

function CookieManager_setCssIndex(cssIndex) 
{
   var cssCookie = CookieManager.findCssIndexCookie();
   if ( CookieManager.cookieNeedsSetting(cssIndex))
     {
        document.cookie = this.nameAndEquals + cssIndex + ";  path=/";
     }
}
CookieManager.setCssIndex = CookieManager_setCssIndex;

function CookieManager_getCssIndex() 
{
    var cssCookie = CookieManager.findCssIndexCookie()  
    if  (cssCookie == CookieManager.emptyCookie)
    {
       return this.defaultCssIndex;
    }
    return cssCookie.substring(this.nameAndEquals.length, cssCookie.length);
}
CookieManager.getCssIndex = CookieManager_getCssIndex;


//-----------------------------------------------------------------------
//SwitcherDocumentManager Class
//-----------------------------------------------------------------------
function SwitcherDocumentManager() 
{
	this.cssSwitchableNodes =  this.locateDivsWithClassName(SwitchConfiguration.switchableDivClass);
}

SwitcherDocumentManager.prototype.locateDivsWithClassName = function(aClassName)
{	
	var inputNodes = document.getElementsByTagName("div");
        var candidateFields = new Array();
	for (var i = 0; i < inputNodes.length; i++)
		{
                   var divClass = inputNodes[i].getAttribute("class");
                   if (divClass != null && divClass.indexOf(aClassName) > -1)
			   {
			   candidateFields[candidateFields.length] = inputNodes[i];
			   }
		}    

         if (candidateFields.length < 1 )
           {
           throw new Error("No HTML input fields with class containing " + aClassName +  " found");
           }
            
        return candidateFields;
}

SwitcherDocumentManager.prototype.switchClassOfDivs = function(cssIndex)
{
          for (var i = 0; i < this.cssSwitchableNodes.length; i++)
          {
             this.cssSwitchableNodes[i].className = 
                      this.switchClassOfAnElement(this.cssSwitchableNodes[i].className, cssIndex);
             this.switchClassOfTagsInElement(this.cssSwitchableNodes[i], cssIndex);
          } 
}

SwitcherDocumentManager.prototype.switchClassOfTagsInElement = function(parentElement, cssIndex)
{
        var elements = parentElement.childNodes;
        if (elements == null )
        {
            return;
        }

        for (var i = 0; i < elements.length; i++)
        { 
           if (SwitchConfiguration.hasIncludedTagName(elements[i].tagName))
            {
              elements[i].className = 
                    this.switchClassOfAnElement(elements[i].className, cssIndex);
              this.switchClassOfTagsInElement(elements[i], cssIndex);

            }

        }
}
SwitcherDocumentManager.prototype.switchClassOfAnElement = function(className, cssIndex)
{
      var modifiedClassName = className;
      if (modifiedClassName.length)
      {
          for (var i = 0; i < SwitchConfiguration.cssFontSizeClasses.length; i++)
          {
            modifiedClassName = modifiedClassName.replace(' ' + SwitchConfiguration.cssFontSizeClasses[i],'');  
          }
      }
      return  modifiedClassName + ' ' + SwitchConfiguration.cssFontSizeClasses[cssIndex];
}

//-----------------------------------------------------------------------
//CssSwitch Class
//-----------------------------------------------------------------------

function CssSwitch() 
{
  try
    {
    this.documentManager = new SwitcherDocumentManager() 
    this.setFontSize( );
    }
  catch(exception)
    {
    alert("JAVASCRIPT INTEGRATION PROBLEM \n\n " +  exception);
    } 
		  
}

function CssSwitch_switchFontSize(cssIndex) 
{
    CookieManager.setCssIndex(cssIndex);
    this.setCssAndRerender(cssIndex);
}
CssSwitch.prototype.switchFontSize = CssSwitch_switchFontSize;

function CssSwitch_setFontSize() 
{
    var cssIndex = CookieManager.getCssIndex();
    this.setCssAndRerender(cssIndex);
}
CssSwitch.prototype.setFontSize = CssSwitch_setFontSize;

function CssSwitch_setCssAndRerender(cssIndex) 
{
    this.documentManager.switchClassOfDivs(cssIndex);
}
CssSwitch.prototype.setCssAndRerender = CssSwitch_setCssAndRerender;
