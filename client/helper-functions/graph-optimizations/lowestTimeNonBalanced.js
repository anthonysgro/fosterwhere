function lowestTimeNonBalanced(graph) {
    const employeeNodes = graph.getEmployees();
    const clientNodes = graph.getClients();

    // Find whichever employee has the fastest commute to the client, and assign
    let upgradedMap = new Map();

    for (const client of clientNodes) {
        let minCommute = Number.POSITIVE_INFINITY;
        let minEmployee = null;

        for (const employee of employeeNodes) {
            const commute = employee.getWeight(client);
            if (commute < minCommute) {
                minCommute = commute;
                minEmployee = employee;
            }
        }

        // Creates a map of optimal pairings
        if (!upgradedMap.has(minEmployee)) {
            upgradedMap.set(minEmployee, [client]);
        } else {
            upgradedMap.set(minEmployee, [
                ...upgradedMap.get(minEmployee),
                client,
            ]);
        }
    }

    return upgradedMap;
}

export default lowestTimeNonBalanced;
