# BHA can consist of 11 component types.

**NOTE:** All input values are converted to imperial before validation.

`Drillstring/BHA number` - required.

`Time In`- date, format: `MM/DD/YYYY HH:mm`

`Hole Depth In`- start depth, required. Min depth - 0, max depth - 40000 ft.

## DP

`ID` - inner depth, from 1 to 7 in  
`OD` - outer depth, from 2 to 8 in  
`TJ ID` - tooljoint inner depth, from 1 to 7 in  
`TJ OD` - tooljoint outer depth, from 2 to 10 in  
`Component length` - from 0 ft

## HWDP

`ID` - inner depth, from 1 to 7 in  
`OD` - outer depth, from 2 to 8 in  
`TJ ID` - tooljoint inner depth, from 1 to 7 in  
`TJ OD` - tooljoint outer depth, from 2 to 10 in  
`Component length` - from 0 ft

## DC

`ID` - inner depth, from 0.5 to 7 in  
`OD` - outer depth, from 2 to 13 in  
`Component length` - from 0 ft

## Stabilizer

`ID` - inner depth, from 0 to 100 in  
`OD` - outer depth, from 1 to 100 in  
`Component length` - from 0 ft

## PDM

`ID` - inner depth, from 0 to 12 in  
`OD` - outer depth, from 2 to 15 in  
`Component length` - from 4 ft  
`Off Bottom Pressure Loss`- flow rate and pressure loss fields are required

### PDM Stabilizer

PDM can include stabilizer.  
`ID` - inner depth, from 0 to 100 in  
`OD` - outer depth, from 1 to 100 in  
`Component length` - from 0 ft  
`OD` > `ID`  
`OD + 0.1` < `Bit Size`

`PDM Stabilizer linear weight` - required  
`# of rotor lobes` - from 1 to 10  
`# of stator lobes` - from 2 to 10  
`revolution per gallon (volume metric)` - from 0 to 10

#### PDM Standard Flow Range

`Max Weight On Bit` - not required. If set, it should be from 0 to 200 `klbf`.

`MIN standard flow rate` - from 0 to 2500 `gal/min`

`MAX standard flow rate` - from 0 to 2500 `gal/min`

`Max Operating Diff Pressure` - from 0 to 3000 `psi`

`Torque at Max Operating Diff Pressure` - from 0 to 40 `ft-klbf`  
`% Leakage Flow Loss` - from 0 to 20%

## MWD

`ID` - inner depth, from 0 to 12 in  
`OD` - outer depth, from 2 to 13 in  
`Component length` - from 1 ft

### MWD Gamma Sensor

One of MWD components can have gamma sensor.

`Gamma Sensor To Bit Distance` - required

### MWD Survey Sensor

MWD component can have survey sensor

`Survey Sensor To Bit Distance` - from 0 to 150 length units

## Agitator

`ID` - inner depth, from 0 to 12 in  
`OD` - outer depth, from 2 to 13 in  
`Component length` - from 1 ft

## RSS

`ID` - inner depth, from 0 to 12 in  
`OD` - outer depth, from 2 to 13 in  
`Component length` - from 1 ft  
`Actuator Flow Loss` - from 0 to 10 percent

## Bit

Bit size > 0 in

BHA must have exactly 1 BIT component and it must be the first or the last BHA component).

`ratio` is 1 length unit converted to inches (1 inch by default)  
`0` <= `TFA` <= `20 * ratio ^2`

## Other components except BIT

`ID` - inner depth, from 0 to 100 in  
`OD` - outer depth, from 1 to 100 in  
`Component length` - from 0 ft

## Common rules

`ID` <= `OD`  
 `ToolJoint OD` >= `OD`

`OD + 0.1` < `Bit Size`

`Tool Joint Length` < `Component Length`

`Pressure Loss`- flow rate and pressure loss are required.

#### `Adjusted Linear Weight` for DP, HWDP, DC components

`estimation` = `2.673 * ((OD * OD) - (ID * ID))`

`estimation x 0.5` <= `adjusted linear weight` <= `estimation x 1.5`
