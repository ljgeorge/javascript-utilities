// ----------------------------------------------------------
// Configuration
// ----------------------------------------------------------

function DiscountCalculatorConfig() {}
function DiscountCalculatorConfig_getDiscountConfig(aFormName) {


    for (var i=0; i < DiscountCalculatorConfig.discountCategories.length; i++)
    {
        if (DiscountCalculatorConfig.discountCategories[i].hasFormName(aFormName))
        {
          return DiscountCalculatorConfig.discountCategories[i];
        }
    
    }
    throw new Error("No matching DiscountConfig for " + aFormName);
        
}
DiscountCalculatorConfig.getDiscountConfig = DiscountCalculatorConfig_getDiscountConfig;

DiscountCalculatorConfig.discountCategories = new Array();

// Add a new line for a new Category where 
//      the first argument is id of the form
//      the second argunment is the percentage discount 
DiscountCalculatorConfig.discountCategories[DiscountCalculatorConfig.discountCategories.length] 
    = new DiscountCategory("CategoryA", 10);
DiscountCalculatorConfig.discountCategories[DiscountCalculatorConfig.discountCategories.length] 
    = new DiscountCategory("CategoryB", 30);
DiscountCalculatorConfig.discountCategories[DiscountCalculatorConfig.discountCategories.length] 
    = new DiscountCategory("CategoryC", 5);
DiscountCalculatorConfig.discountCategories[DiscountCalculatorConfig.discountCategories.length] 
    = new DiscountCategory("CategoryD", 10);
DiscountCalculatorConfig.discountCategories[DiscountCalculatorConfig.discountCategories.length] 
    = new DiscountCategory("CategoryE", 10);


//-----------------------------------------------------------------------
//  Discount Catageory class
//-----------------------------------------------------------------------

function DiscountCategory(formName, percentage) 
{
       this.formName = formName;
       this.mutiplier = percentage/100;
}

DiscountCategory.prototype.hasFormName = function(aName) 
{
       return this.formName == aName;
}

DiscountCategory.prototype.discount = function(aValue) 
{
       return parseFloat(aValue) * this.mutiplier;
}

DiscountCategory.prototype.getFormName = function() 
{
       return this.formName;
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
    this.attachTotalsBoxes();  
    this.attachSourceBoxes();        
}


TotalsManager.prototype.attachTotalsBoxes = function() 
{
   aForm = this.findDocumentElement("Totals");

   var errors = "";
     if (aForm.saving == null)
         {
         errors = errors + "Form " + aForm.name + " has no saving input box.\n\n";
         }
      if (aForm.spend == null)
         {
         errors = errors + "Form " + aForm.name + " has no spend input box.\n\n";
         }

       if (errors != "")
         {
         throw new Error(errors);
         }
      this.totalSavingBox = aForm.saving;
      this.totalSpendBox  = aForm.spend;
	  this.totalYearlySavingBox = aForm.yearlySaving;

}

TotalsManager.prototype.addSourceBoxes = function(aForm) {

      var errors = "";
      if (aForm.saving == null)
         {
         errors = errors + "Form " + aForm.name + " has no saving input box.\n\n";
         }
      if (aForm.spend == null)
         {
         errors = errors + "Form " + aForm.name + " has no spend input box.\n\n";
         }

       if (errors != "")
         {
         throw new Error(errors);
         }
    this.spendValueBoxes[this.spendValueBoxes.length] = aForm.spend;
    this.savingValueBoxes[this.savingValueBoxes.length] = aForm.saving;
        
}

TotalsManager.prototype.attachSourceBoxes = function() 
{
    this.spendValueBoxes = new Array();
    this.savingValueBoxes = new Array();


      for (var i=0; i < DiscountCalculatorConfig.discountCategories.length; i++ )
         {
         var form = this.findDocumentElement(DiscountCalculatorConfig.discountCategories[i].getFormName());
 
         this.addSourceBoxes(form);
 
         }      
}


TotalsManager.prototype.writeDiscounts = function()
{
     for (var i=0; i < this.spendValueBoxes.length; i++ )
         {
         var spendValueBox = this.spendValueBoxes[i];
         var discountCategory = DiscountCalculatorConfig.getDiscountConfig(spendValueBox.form.name);
         this.write(this.savingValueBoxes[i], discountCategory.discount(spendValueBox.value)); 
         }   
}

TotalsManager.prototype.writeTotals = function()
{
    this.writeDiscounts();
    this.totalSpendBox.value  = ArrayHandler.totalAnArrayOfValues(this.spendValueBoxes).toFixed(2);
    var monthlySaving  = ArrayHandler.totalAnArrayOfValues(this.savingValueBoxes);  
	var yearlySaving = monthlySaving * 12;
	this.totalSavingBox.value = monthlySaving.toFixed(2);   	
    this.totalYearlySavingBox.value = yearlySaving.toFixed(2);       
}

TotalsManager.prototype.write = function(textBox, anAmount)
   {
     if (isNaN(anAmount))
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
   //  Write discounts function
   //-----------------------------------------------------------------------
   function write_discounts(spendField)

    {
       if (validateSpendField(spendField)) 
       { 
          try
           {
           totalsManager = new TotalsManager();
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
              alert("The amount for " + aSpendField.form.name + " is not numeric.\n Please try again."); 
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

