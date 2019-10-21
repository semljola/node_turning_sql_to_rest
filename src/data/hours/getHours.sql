SELECT IdOrdre,Info, Antall 
FROM [HM_VC_Prod].[dbo].[TidAnnet]
WHERE  IdOrdre IN (SELECT IdOrdre
    FROM [HM_VC_Prod].[dbo].[Ordre] AS Orders
        INNER JOIN [HM_VC_Prod].[dbo].[Kunde] AS Customers  ON Orders.KundeNr=Customers.KundeNr 
        WHERE Customers.KundeNr = @clientId  
        AND Orders.OrdreDato > @startDate and Orders.FastPris = 0 and Orders.FerdigDato < @endDate)

