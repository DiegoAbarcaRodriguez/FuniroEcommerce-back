SELECT date_part('year', modify_at), SUM(total) as total
from "order"
Where status = 'confirm' 
GROUP BY date_part('year', modify_at)
HAVING date_part('year', modify_at) IS NOT NULL
ORDER BY date_part('year', modify_at) ASC; 