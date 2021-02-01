# Totals calculator

The totals calculator allows numbers of items to be multiplied by a cost and all the results totalled into an HTML input field called "finaltotal".

## How it works
The costs are linked to the input fields where the amounts are entered. The fields are in pairs, one for the number of items and one for the total cost. Thr pair of fields are identified by a naming convention. The quantity of an item needs to be in a field with a name ending in Quantity. The total cost of the items of that type needs have a name ending in Total. Each item type most be given a unique name that then forms the first part of the names of the quantity and total fields. 
So an item type of "ClearTape" would need to be matched by two HTML input fields "ClearTapeQuantity" and "ClearTapeTotal". The ids of the HTML input fields must be set to these names.

## Price configuration
Prices are configured by adding a TotalCostCategory to  TotalCostCalculatorConfig.TotalCostCategories. A TotalCostCategory contains two pieces of information. The name of the item and the cost in pounds.
The name of the item will be used by the code as the first part of the name of the pair of quantity and total fields.

Here is an example.

```new TotalCostCategory("BubbleWrap", 15.00);```

This TotalCostCategory then needs to be added to TotalCostCalculatorConfig.TotalCostCategories.

```TotalCostCalculatorConfig.TotalCostCategories[TotalCostCalculatorConfig.TotalCostCategories.length] = new TotalCostCategory("BubbleWrap", 15.00);```

