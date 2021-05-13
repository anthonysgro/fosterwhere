class Node {
    constructor(val) {
        this.val = val;
        this.neighbors = new Map();
    }

    addAdjacent(node, weight) {
        this.neighbors.set(node, weight);
    }

    removeAdjacent(node) {
        return this.neighbors.delete(node);
    }

    removeAdjacentByVal(val) {
        for (const [node, weight] of this.neighbors.entries()) {
            if (parseInt(node.val) === parseInt(val)) {
                return this.neighbors.delete(node);
            }
        }
    }

    getAdjacents() {
        return this.neighbors;
    }

    isAdjacent(node) {
        return this.neighbors.has(node);
    }

    getWeight(node) {
        return this.neighbors.get(node);
    }

    totalCommute() {
        let totalCommute = 0;
        for (const weight of this.neighbors.values()) {
            totalCommute += weight;
        }
        return totalCommute;
    }
}

// This will be a directed graph for our employees to clients
class Graph {
    constructor() {
        this.nodes = new Map();
    }

    addEdge(source, destination, weight) {
        const sourceNode = this.addVertex(source);
        const destinationNode = this.addVertex(destination);

        sourceNode.addAdjacent(destinationNode, weight);

        return [sourceNode, destinationNode];
    }

    addVertex(value) {
        if (this.nodes.has(value)) {
            return this.nodes.get(value);
        } else {
            const newNode = new Node(value);
            this.nodes.set(value, newNode);

            return newNode;
        }
    }

    removeVertex(value) {
        const current = this.nodes.get(value);
        if (current) {
            for (const node of this.nodes.values()) {
                node.removeAdjacent(current);
            }
        }
        return this.nodes.delete(value);
    }

    removeEdge(source, destination) {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);

        if (sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destinationNode);
        }

        return [sourceNode, destinationNode];
    }

    findNodeByVal(val) {
        for (const [key, node] of this.nodes.entries()) {
            if (parseInt(node.val) === parseInt(val)) {
                return node;
            }
        }
        return null;
    }

    getEmployees() {
        let employees = [];
        for (const [key, node] of this.nodes.entries()) {
            if (node.neighbors.size > 0) {
                employees.push(node);
            }
        }

        // If there are no clients, and therefore we didnt get any employees with our heuristic before
        if (!employees.length) {
            for (const [key, node] of this.nodes.entries()) {
                employees.push(node);
            }
        }

        return employees;
    }

    getTotalCommute(employee) {
        // If not an employee, undefined commute
        if (!this.getEmployees().includes(employee)) return undefined;

        let totalDistance = 0;
        for (const [neighbor, weight] of employee.neighbors.entries()) {
            totalDistance += weight;
        }

        return totalDistance;
    }

    getCommuteFromClients(employee, arr) {
        // If not an employee, undefined commute
        if (!this.getEmployees().includes(employee)) return undefined;

        let totalDistance = 0;
        for (const [neighbor, weight] of employee.neighbors.entries()) {
            if (arr.includes(neighbor)) {
                totalDistance += weight;
            }
        }

        return totalDistance;
    }

    getSingleCommute(employee, client) {
        return employee.getWeight(client);
    }

    getClients() {
        let clients = [];
        for (const [key, node] of this.nodes.entries()) {
            if (node.neighbors.size === 0) {
                clients.push(node);
            }
        }

        return clients;
    }

    bfs(node) {
        const visited = new Map();
        const queue = [node];
        const result = [];

        while (queue.length) {
            const current = queue.shift();
            visited.set(current.val, true);

            // Add processing if you want
            result.push(current);
            for (const [neighbor, weight] of current.neighbors.entries()) {
                if (!visited.has(neighbor.val)) {
                    visited.set(neighbor, true);
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }
}

function graphMaker(employeeMap) {
    const fosterGraph = new Graph();

    // Loop through employee map making a graph
    for (const [employeeId, clients] of Object.entries(employeeMap)) {
        for (const [clientId, travelInfo] of Object.entries(clients)) {
            // We can select different weight by choosing one of these
            const { travelTime, travelTimeTraffic, travelDistance } =
                travelInfo;

            fosterGraph.addEdge(
                parseInt(employeeId),
                parseInt(clientId),
                travelTimeTraffic,
            );
        }
    }

    return fosterGraph;
}

export default graphMaker;
