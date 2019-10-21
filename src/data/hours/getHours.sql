SELECT IdOrdre,Info, Antall 
FROM [HM_VC_Prod].[dbo].[TidAnnet]
WHERE  IdOrdre IN (SELECT IdOrdre
    FROM [HM_VC_Prod].[dbo].[Ordre] AS Orders
        INNER JOIN [HM_VC_Prod].[dbo].[Kunde] AS Customers  ON Orders.KundeNr=Customers.KundeNr 
        WHERE Customers.KundeNr = 28 
        AND Orders.OrdreDato > '2019-09-01' and Orders.FastPris = 0 and Orders.FerdigDato < '2019-10-19')
        --AND Orders.OrdreDato > @startDate and Orders.FastPris = 0 and Orders.FerdigDato < @endDate)

