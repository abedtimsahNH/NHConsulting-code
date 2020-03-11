/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 *
 */
define(['N/record','N/log'], // Modules
    function(record,log) {

        function afterSubmit(context) {
            try {
            	var rec_id = context.newRecord.id;
                var rec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: rec_id,
                    isDynamic: false,
                });
                
                var lineCount = rec.getLineCount({
                    sublistId: 'item'
                });
                
                
                for (var i = 0; i < lineCount; i++) {
                    var itemType = rec.getSublistValue({ // Get item type on line
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    });
                  log.debug({
                       title: 'Item Type',
                       details: itemType
                       });
                  
                    if (itemType == 'Discount') { // Only run if item type is Discount
                        if (i > 0) {
                         
                        var itemClass = rec.getSublistValue({ // Return class for line just before discount
                            sublistId: 'item',
                            fieldId: 'class',
                            line: i - 1
                        });
                       log.debug({
                       title: 'Class',
                       details: itemClass
                       });
                        rec.setSublistValue({ // Set Discount item class to class from line before
                            sublistId: 'item',
                            fieldId: 'class',
                            value: itemClass,
                            line: i
                        });
                    }
                    }
                }
                rec.save();
            }
            catch (error) {
                log.error('Error in beforeSubmit', error.toString());
            }
        }

        return {
            afterSubmit: afterSubmit
        }
    });