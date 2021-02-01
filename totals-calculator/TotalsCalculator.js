// ----------------------------------------------------------
// Configuration
// ----------------------------------------------------------

function TotalCostCalculatorConfig() {}
function TotalCostCalculatorConfig_getTotalCostConfig(anItemTypeName) {

    var actualTypeName = anItemTypeName.substring(0,anItemTypeName.indexOf("Quantity"));
    for (var i=0; i < TotalCostCalculatorConfig.TotalCostCategories.length; i++)
    {
        if (TotalCostCalculatorConfig.TotalCostCategories[i].hasItemTypeName(actualTypeName))
        {
          return TotalCostCalculatorConfig.TotalCostCategories[i];
        }
    
    }
    throw new Error("No matching TotalCostConfig for " + actualTypeName);
        
}
TotalCostCalculatorConfig.getTotalCostConfig = TotalCostCalculatorConfig_getTotalCostConfig;

TotalCostCalculatorConfig.TotalCostCategories = new Array();

// Add a new line for a new Category where 
//      the first argument is id of the form
//      the second argument is the unit cost in POUNDS
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("BubbleWrap", 15.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("ClearTape", 1.50);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("StickyTape", 3.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("ReamOfPaper", 7.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("SmallBoxes", 2.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("MediumBoxes", 3.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("LargeBoxes", 4.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("SingleCover", 4.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("DoubleCover", 5.00);
TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] 
    = new TotalCostCategory("WarDrobe", 12.00);


//-----------------------------------------------------------------------
//  TotalCost Category class
//-----------------------------------------------------------------------

function TotalCostCategory(itemTypeName, costInPounds) 
{
       this.itemTypeName = itemTypeName;
       this.mutiplier = costInPounds;
}

TotalCostCategory.prototype.hasItemTypeName = function(aName) 
{
       return this.itemTypeName == aName;
}

TotalCostCategory.prototype.TotalCost = function(aValue) 
{
       return parseFloat(aValue) * this.mutiplier;
}

TotalCostCategory.prototype.getItemTypeName = function() 
{
       return this.itemTypeName;
}

  //-----------------------------------------------------------------------
  //  ArrayHandler Class
  //
  //  Provides a function to total values in array of document fields
  //-----------------------------------------------------------------------
function ArrayHandler() {}

function ArrayHandler_totalAnArrayOfValues(aValueBoxArray) {
    var total = 0;


    for (var i=0; i < aValueBoxArray.length; i++)
    {
        var amount = parseFloat(aValueBoxArray[i].value);
        if (! isNaN(amount))
        {
          total += amount;
        }
    
    }
    return total;
        
}
ArrayHandler.totalAnArrayOfValues = ArrayHandler_totalAnArrayOfValues;

  //-----------------------------------------------------------------------
  //  TotalsManager Class
  //-----------------------------------------------------------------------
  
function TotalsManager() 
{ 
    this.attachSourceBoxes();
    this.attachTotalsBox();
        
}


TotalsManager.prototype.attachTotalsBox = function() 
{
   this.totalCostBox =  this.findDocumentElement("finaltotal");

   var errors = "";
     if (this.totalCostBox == null)
         {
         errors = errors + "Form has no HTML Input with id=finaltotal.\n\n";
         }
    
       if (errors != "")
         {
         throw new Error(errors);
         }
}

	
TotalsManager.prototype.getSourceBoxByName = function(anItemTypeName , aSourceBoxName, anErrorMessage) {
	 var sourceBox = this.findDocumentElement(aSourceBoxName);
     if (sourceBox  == null)
         {
         anErrorMessage = anErrorMessage + "Item  " + anItemTypeName + " has no HTML Input with name" + aSourceBoxName + ".\n\n";
         }
	return sourceBox;
}		 
		 
	
TotalsManager.prototype.addSourceBoxes = function(anItemTypeName) {

     var errors = "";
	 var itemTotalBox = this.getSourceBoxByName(anItemTypeName, anItemTypeName + "Total", errors);
	 var itemQuantityBox = this.getSourceBoxByName(anItemTypeName, anItemTypeName + "Quantity", errors);
     if (errors != "")
         {
         throw new Error(errors);
         }
		 
	  itemQuantityBox.onkeyup=function(){write_TotalCosts(itemQuantityBox);};
	  itemQuantityBox.onclick=function(){write_TotalCosts(itemQuantityBox);};
	  this.totalCostBoxes[this.totalCostBoxes.length] = itemTotalBox;
      this.quantityBoxes[this.quantityBoxes.length] = itemQuantityBox;
        
}

TotalsManager.prototype.attachSourceBoxes = function() 
{
    this.totalCostBoxes = new Array();
    this.quantityBoxes = new Array();


      for (var i=0; i < TotalCostCalculatorConfig.TotalCostCategories.length; i++ )
         {
         this.addSourceBoxes(TotalCostCalculatorConfig.TotalCostCategories[i].getItemTypeName());
 
         }      
}


TotalsManager.prototype.writeTotalCosts = function()
{
     for (var t=0; t < this.totalCostBoxes.length; t++ )
         {
         var anItemQuantityBox = this.quantityBoxes[t];
         var aTotalCostCategory = TotalCostCalculatorConfig.getTotalCostConfig(anItemQuantityBox.id);
		 var aTotalCostBox = this.totalCostBoxes[t];
		 if (aTotalCostBox ) 
		   {
			 this.write(aTotalCostBox, aTotalCostCategory.TotalCost(anItemQuantityBox.value)); 
		   }
		 else 
		   {
			 throw "No total box for " + aTotalCostCategory.getItemTypeName;
		   }
         
         }   
}

TotalsManager.prototype.writeTotals = function()
{
    this.writeTotalCosts();   
	this.totalCostBox.value  = ArrayHandler.totalAnArrayOfValues(this.totalCostBoxes).toFixed(2);
}

TotalsManager.prototype.write = function(textBox, anAmount)
   {
     if (isNaN(anAmount) || anAmount == 0)
         {
         textBox.value = "";
         }
      else
         {
         textBox.value = anAmount.toFixed(2);
         }
   }


TotalsManager.prototype.findDocumentElement= function(elementId)
{
    var element = document.getElementById(elementId);
    if (element != null)
    {
       return element; 
    }

    throw new Error("Cannot find document element with an id of " + elementId);
}

 
  

   //-----------------------------------------------------------------------
   //  Write TotalCosts function
   //-----------------------------------------------------------------------
   function write_TotalCosts(anItemQuantityBox)

    {
       if (validateSpendField(anItemQuantityBox)) 
       { 
          try
           {
           totalsManager.writeTotals();
           }
          catch(exception)
           {
           alert("TOTALS MANAGER ERROR\n" + exception.message);
           }
         }
     }


     function validateSpendField(aSpendField) {
           if (aSpendField.value == "") 
           {
              return true;
           }

           var errors = validateNumeric(aSpendField.value);
           if ( errors > 0 ) {
              alert("The amount for " + aSpendField.id + " is not numeric.\n Please try again."); 
              aSpendField.focus();
              return false;
           }
         return true;

     } 

     function validateNumeric(aValue){
          var amount  = parseFloat(aValue);
          if (isNaN(amount)) {
               return 1;
           }
           return 0; 
     }  
	 
	 var totalsManager;
	 
	 function TotalsCalculatorLoad() {
		 totalsManager = new TotalsManager();
	 }
	 


