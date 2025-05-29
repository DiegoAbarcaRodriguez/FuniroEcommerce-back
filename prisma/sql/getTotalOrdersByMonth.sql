SELECT date_part('month', modify_at), SUM(total) as total
from "order"
Where status = 'confirm' AND date_part('year',modify_at) =$1
GROUP BY date_part('month', modify_at)
HAVING date_part('month', modify_at) IS NOT NULL
ORDER BY date_part('month', modify_at) ASC; 