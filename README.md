# KALC Range Slider - Oracle Apex Item Type Plugin
A range slider plugin for Oracle Apex. Updates Min and Max page items with the visual slider settings

Based on jQRangeSlider v5.7.2 - (http://ghusse.github.io/jQRangeSlider/)

##Installation
Import the following file into your Apex application
```html
item_type_plugin_kalc_apex_range_slider.sql
```

## Demo
[KALC Range Slider Demo](https://apex.oracle.com/pls/apex/f?p=109672:2)
Log in using demo/demo

## Author

[KAL Consultancy Ltd](https://github.com/kalconsultancyltd)

## Additional Usage Notes

If you wish to "disable" the slider to make it a display only item, you will need to add an "After Item Refresh" Dynamic Action (Fire on Page Load = Yes)

Add the following Javascript TRUE action (postfix your page item name with '_kalcRangeSlider')

For date sliders
$('#PXX_MY_SLIDER_kalcRangeSlider').dateRangeSlider({enabled: false});

For integer sliders
$('#PXX_MY_SLIDER_kalcRangeSlider').rangeSlider({enabled: false});

### Colours

If you wish to re-colour the slider - amend the ithing.css file as per your requirements

### Large integers

You can exclude the minimum width of the slider which previously ensured a single pixel "per slider step" to display large ranges

Note that this means you may not be able to move the slider to each value in the slider range

You may also format the integer display values and step values - the format will be 999G999G999G999G999
