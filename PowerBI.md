LYTDOR = CALCULATE([ORBase], FILTER(ALL(vDimDate[DateKey]), vDimDate[DateKey] >= DATEADD(TODAY(),-1, YEAR) &&  vDimDate[DateKey] <= 20180930))


LYTDOR = CALCULATE([ORBase], DATESBETWEEN(vDimDate[FullDate], DATE(2019,1,1), DATE(2019, 3, 1)))


LYTDOR = CALCULATE([ORBase], DATESBETWEEN(vDimDate[FullDate], DATE(2019,1,1), TODAY()))


//
TotalThisYearOR = CALCULATE([ORBase], DATESBETWEEN(vDimDate[FullDate], FIRSTDATE(vDimDate[FullDate]), ENDOFYEAR(vDimDate[FullDate])))

//
TotalThisOR = CALCULATE([ORBase], DATESBETWEEN(vDimDate[FullDate], FIRSTDATE(vDimDate[FullDate]), ENDOFYEAR(vDimDate[FullDate])))
