
-- Example operational metrics

SELECT
    category,
    COUNT(*) AS total_tickets,
    AVG(resolution_time_hours) AS avg_resolution_time
FROM tickets
GROUP BY category;

-- Tickets by priority

SELECT
    priority,
    COUNT(*) AS total_tickets
FROM tickets
GROUP BY priority;
