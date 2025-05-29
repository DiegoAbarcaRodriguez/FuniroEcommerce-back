SELECT date_part('week', modify_at), SUM(total) as total
from "order"
Where status = 'confirm' AND date_part('year',modify_at) = $1
GROUP BY date_part('week', modify_at)
HAVING date_part('week', modify_at) IS NOT NULL
ORDER BY date_part('week', modify_at) ASC; 