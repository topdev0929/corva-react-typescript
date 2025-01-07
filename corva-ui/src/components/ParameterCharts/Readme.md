# Props

## multipleAssets

Switch mode from one asset and multiple traces on track to multiple assets and one trace per track. Requires *[assestColors](assestColors)* prop.


### data
Data should be an object with keys of collections. For intance in case we use 2 collections *wits* and *drillingDysfunction*:

```javascript
const data = {
    wits: [{
        ...anyData
    }],
    drillingDysfunction: [{
        ..anyData
    }]
}

```
### Multiple assets format 

```html
<ParameterCharts
    data={data}
/>
```

### Single asset format

```html
<ParameterCharts
    data={{
        asset1: data,
        asset2: data
    }}
/>
```

## mapping
It's a list of channels we can use. Each channel should has *collection* (link to collection) and *key* (path to it in collection). *Name*, *unit*, *unitType* - for data convertion and for tooltips and headers.

```javascript
const mapping = [{
    "collection":"wits",
    "key":"data.rop",
    "name":"ROP",
    "unit":"ft/h",
    "unitType":"velocity"
},{
    "collection":"wits",
    "key":"data.diff_press",
    "name":"Diff Press",
    "unit":"psi",
    "unitType":"pressure"
},{
    "collection":"drillingDysfunction",
    "key":"health.axial.peak_shock_count_health",
    "name":"Shock Axial g",
    "unit":"g",
    "unitType":"gravity"
}];

```

## settings
Whole app settings.

## onSettingsChange
App callback for changing the app settings.

## settingsKey (optional)
Key to app settings that responsible for the component. Should be set in case we have 2 and more components.

## isLoading
Enable/disable the loading indicator.

## horizontal
Switch vertical and horisontal view of the component.

## indexes
The same principle as in mapping except it's for indexes (depth, time etc.).
Should contains all the indexes from each collection the component uses. As example - index is *dept*
```javascript
const indexes = {
    "min":20254.71,
    "max":20255.90,
    "keys":
        {
            "wits": {
                "key":"data.hole_depth",
                "collection":"wits",
                "name":"Depth",
                "unit":"ft",
                "unitType":"length"
            },
            "drillingDysfunction": {
                "key":"md",
                "collection":"drillingDysfunction",
                "name":"Depth",
                "unit":"ft",
                "unitType":"length"
            }
        }
    };
```

## assestColors
Colors that will be applied to all traces in multiple assets mode.

```html
<ParameterCharts
    assestColors={{ asset1: '#FF0000', asset2: '#1E90FF' }}
/>
```