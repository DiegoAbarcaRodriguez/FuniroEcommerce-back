SELECT * FROM furniture
WHERE name = $1 OR model_number = $2 OR image = $3;