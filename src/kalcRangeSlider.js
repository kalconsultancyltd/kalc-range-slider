(function( $, undefined ) {
  /**
   * KAL Consultancy Ltd-  APEX Range Slider Plugin - provided under the MIT license
   * Uses jQRangeSlider v5.7.2 (http://ghusse.github.io/jQRangeSlider/)
   * 
   * Contact: kalconsultancyltd@hotmail.com
   * @version 1.1
   * Tested on Oracle Application Express 5.0.4 and Universal Theme
   *
   * @license
   * Copyright (c) 2016 KAL Consultancy Ltd
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  kalc_range_slider_start = function(
    sliderId,
    sliderType,
    dateFormat,
    monthLabels,
    oraMON,
    sliderMin,
    sliderMax,
    sliderStep,
    weekStartDay,
    decimalPlaces,  //Placeholder for a potential future range slider type of DECIMAL
    minPageItem,
    maxPageItem,
    includeRuler,
    majorScale,
    minorScale
  ){
    switch(sliderType)
    {
      case 'DATE':
        // Date sliders can have format DD-MM-YYYY or DD-MON-YYYY in version 1
        var calcSliderMin = new Date(), calcSliderMax = new Date(); // initialise the slider bounds variables as dates
        var monthList = monthLabels.split(',');
        var minPageItemVal = apex.item(minPageItem).getValue(); //get the initial Min marker value from the apex item
        var maxPageItemVal = apex.item(maxPageItem).getValue(); //get the initial Max marker value from the apex item
        
        var leftDateDay  = parseInt(minPageItemVal.substring(0,2));
        var rightDateDay = parseInt(maxPageItemVal.substring(0,2));
        switch(dateFormat){
          case 'DD-MON-YYYY':
            leftDateMonth = monthList.indexOf(minPageItemVal.substring(3,4).toUpperCase()+minPageItemVal.substring(4,minPageItemVal.indexOf('-',3)).toLowerCase());
            leftDateYear  = parseInt(minPageItemVal.slice(minPageItemVal.indexOf('-',3)+1));

            rightDateMonth = monthList.indexOf(maxPageItemVal.substring(3,4).toUpperCase()+maxPageItemVal.substring(4,maxPageItemVal.indexOf('-',3)).toLowerCase());
            rightDateYear  = parseInt(maxPageItemVal.slice(maxPageItemVal.indexOf('-',3)+1));
            break;
          default:
            leftDateMonth = parseInt(minPageItemVal.substring(3,5))-1;
            leftDateYear  = parseInt(minPageItemVal.slice(6));

            rightDateMonth = parseInt(maxPageItemVal.substring(3,5))-1;
            rightDateYear  = parseInt(maxPageItemVal.slice(6));
        }
        var leftDate  = new Date(leftDateYear,leftDateMonth,leftDateDay);
        var rightDate = new Date(rightDateYear,rightDateMonth,rightDateDay);

        //if step is defined, set the range MIN and MAX appropriately so all dates are selectable
        //this ensures that the left and right values are aligned correctly to the predefined starter dates
        if(sliderStep!=undefined){
          calcSliderMin = sliderMin;
          calcSliderMax = sliderMax;
          switch(sliderStep){
            case 'months':
              calcSliderMin.setDate(1);
              calcSliderMax.setMonth(sliderMax.getMonth()+1);
              calcSliderMax.setDate(1);
              break;
            case 'weeks':
              calcSliderMin.setDate(sliderMin.getDate()+(weekStartDay-sliderMin.getDay()));
              calcSliderMax.setDate(sliderMax.getDate()+(weekStartDay-sliderMax.getDay()+7));
          }
        } else {
          calcSliderMin = sliderMin;
          calcSliderMax = sliderMax;
        }
        if(includeRuler=='Y'&&majorScale!=undefined&&(majorScale=='day'||majorScale=='month'||majorScale=='week')){
          $('#'+sliderId).dateRangeSlider({
            bounds: {min: calcSliderMin, max: calcSliderMax},
            defaultValues: { min: leftDate, max: rightDate },
            scales: [{
              first: function(value){
                var firstDate = new Date(value);
                firstDate.setHours(0,0,0,0);
                switch(majorScale){
                  case 'month':
                    firstDate.setDate(1);
                    break;
                  case 'week':
                    firstDate.setDate(firstDate.getDate()+(weekStartDay-firstDate.getDay()));
                }
                return firstDate;
              },
              end: function(value) {return value; },
              next: function(value){
                var next = new Date(value);
                next.setHours(0,0,0,0);
                switch(majorScale){
                  case 'day':
                    next.setDate(next.getDate() + 1);
                    break;
                  case 'month':
                    next.setMonth(next.getMonth() + 1);
                    next.setDate(1);
                    break;
                  case 'week':
                    next.setDate(next.getDate() + 7);
                }
                return next;
              },
              label: function(value){
                var majorScaleLabel;
                var labelDate = new Date(value);
                switch(majorScale){
                  case 'day':
                    if(labelDate.getDate()<10){majorScaleLabel='0'+labelDate.getDate()} else {majorScaleLabel=''+labelDate.getDate()};
                    break;
                  case 'month':
                    majorScaleLabel = monthList[labelDate.getMonth()];
                    break;
                  case 'week':
                    //Version 1... display the "day"
                    if(labelDate.getDate()<10){majorScaleLabel='0'+labelDate.getDate()} else {majorScaleLabel=''+labelDate.getDate()};
                }
                return majorScaleLabel;
              }
            }],
            formatter: function(val){
              var monthList = monthLabels.split(',');
              var days, month;
              var year  = ''+val.getFullYear();
              if(val.getDate()<10){days='0'+val.getDate()} else {days=''+val.getDate()};
              if(val.getMonth()<9){month='0'+(val.getMonth()+1)} else {month=''+(val.getMonth()+1)};
              switch(dateFormat){
                case 'DD-MON-YYYY':
                  return days + "-" + monthList[parseInt(month)-1] + "-" + year;
                default:
                  return days + "-" + month + "-" + year;
              }
            }
          });
        } else {
          $('#'+sliderId).dateRangeSlider({
            bounds: {min: calcSliderMin, max: calcSliderMax},
            defaultValues: { min: leftDate, max: rightDate },
            formatter: function(val){
              var monthList = monthLabels.split(',');
              var days, month;
              var year  = ''+val.getFullYear();
              if(val.getDate()<10){days='0'+val.getDate()} else {days=''+val.getDate()};
              if(val.getMonth()<9){month='0'+(val.getMonth()+1)} else {month=''+(val.getMonth()+1)};
              switch(dateFormat){
                case 'DD-MON-YYYY':
                  return days + "-" + monthList[parseInt(month)-1] + "-" + year;
                default:
                  return days + "-" + month + "-" + year;
              }
            }
          });
        }
        switch(sliderStep){
          case 'days':
            $('#'+sliderId).dateRangeSlider( 'option', 'step', {days: 1} );
            break;
          case 'months':
            $('#'+sliderId).dateRangeSlider( 'option', 'step', {months: 1} );
            break;
          case 'weeks':
            $('#'+sliderId).dateRangeSlider( 'option', 'step', {weeks: 1} );
        }
        // Bind a resize option for when the parent container is resized
        $('#'+sliderId).parent().parent().on('resize',function(){
          $('#'+sliderId).dateRangeSlider('resize');
        });

        // v1.1 Define a delayed function for resizing the slider after a Universal Theme menu expansion/contraction
        if($('#t_Button_navControl')){
          $('#t_Button_navControl').on('click',function(){
            setTimeout(function(){$('#'+sliderId).dateRangeSlider('resize');}, 200);
          });
        }

        // Update the apex items when the user changes the slider dependent on the provided date format
        $('#'+sliderId).bind("userValuesChanged", function(e, data){
          var monthList = oraMON.split(',');
          var minDays, minMonth, maxDays, maxMonth;
          //User Min value
          var minVal = data.values.min;
          var minYear = ''+minVal.getFullYear();
          if(minVal.getDate()<10){minDays='0'+minVal.getDate()} else {minDays=''+minVal.getDate()};
          if(minVal.getMonth()<9){minMonth='0'+(minVal.getMonth()+1)} else {minMonth=''+(minVal.getMonth()+1)};

          //User Max value
          var maxVal = data.values.max;
          var maxYear = ''+maxVal.getFullYear();
          if(maxVal.getDate()<10){maxDays='0'+maxVal.getDate()} else {maxDays=''+maxVal.getDate()};
          if(maxVal.getMonth()<9){maxMonth='0'+(maxVal.getMonth()+1)} else {maxMonth=''+(maxVal.getMonth()+1)};

          switch(dateFormat){
            case 'DD-MON-YYYY':
              apex.item(minPageItem).setValue(minDays + "-" + monthList[parseInt(minMonth)-1].toUpperCase() + "-" + minYear);
              apex.item(maxPageItem).setValue(maxDays + "-" + monthList[parseInt(maxMonth)-1].toUpperCase() + "-" + maxYear);
              break;
            default:
              apex.item(minPageItem).setValue(minDays + "-" + minMonth + "-" + minYear);
              apex.item(maxPageItem).setValue(maxDays + "-" + maxMonth + "-" + maxYear);
          }
        });
        break;

      case 'INTEGER':
        var leftIntVal = parseInt(apex.item(minPageItem).getValue());
        if(leftIntVal==undefined||leftIntVal==NaN){ leftIntVal = parseInt(sliderMin) };
        
        var rightIntVal = parseInt(apex.item(maxPageItem).getValue());
        if(rightIntVal==undefined||rightIntVal==NaN){ rightIntVal = parseInt(sliderMax) };
        
        if(includeRuler=='Y'){
          if(majorScale!=undefined&&parseInt(majorScale)!=NaN&&minorScale!=undefined&&parseInt(minorScale)!=NaN){
            $('#'+sliderId).rangeSlider({
              bounds: {min: parseInt(sliderMin), max: parseInt(sliderMax)},
              defaultValues: {min: leftIntVal, max: rightIntVal},
              scales:[{ // Primary scale
                        first: function(val){ return val; },
                        next: function(val){ return val + parseInt(majorScale); },
                        stop: function(val){ return false; },
                        label: function(val){ return val; }
                      },
                      { // Secondary scale
                        first: function(val){ return val; },
                        next: function(val){
                          if (val % parseInt(majorScale) === (parseInt(majorScale)-1)){
                            return val + (parseInt(minorScale)+1);
                          }
                          return val + parseInt(minorScale);
                        },
                        stop: function(val){ return false; },
                        label: function(){ return null; }
                      }]
            });
          } else if(majorScale!=undefined&&parseInt(majorScale)!=NaN){
            $('#'+sliderId).rangeSlider({
              bounds: {min: parseInt(sliderMin), max: parseInt(sliderMax)},
              defaultValues: {min: leftIntVal, max: rightIntVal},
              scales:[{ // Primary scale
                        first: function(val){ return val; },
                        next: function(val){ return val + parseInt(majorScale); },
                        stop: function(val){ return false; },
                        label: function(val){ return val; }
                      }]
            });
          }
        } else {
          $('#'+sliderId).rangeSlider({
            bounds: {min: parseInt(sliderMin), max: parseInt(sliderMax)},
            defaultValues: {min: leftIntVal, max: rightIntVal}
          });
        }
        if(sliderStep&&sliderStep!=''){
          $('#'+sliderId).rangeSlider( 'option', 'step', parseInt(sliderStep) );
        }
        // Bind a resize option for when the parent container is resized
        $('#'+sliderId).parent().parent().on('resize',function(){
          $('#'+sliderId).rangeSlider('resize');
        });
        
        // v1.1 Define a delayed function for resizing the slider after a Universal Theme menu expansion/contraction
        if($('#t_Button_navControl')){
          $('#t_Button_navControl').on('click',function(){
            setTimeout(function(){$('#'+sliderId).rangeSlider('resize');}, 200);
          });
        }

        // Update the apex items when the user changes the slider
        $('#'+sliderId).bind("userValuesChanged", function(e, data){
          apex.item(minPageItem).setValue(data.values.min);
          apex.item(maxPageItem).setValue(data.values.max);
        });
    }
  }
   
})( apex.jQuery );
