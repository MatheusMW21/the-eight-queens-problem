class Node {
    constructor(board) {
        this.board = board;
        this.g_score = 0;
        this.f_score = 0;
    }

    equals(other) {
        return this.board.toString() === other.board.toString();
    }

    hash() {
        return this.board.join(',');
    }

    toString() {
        return `${this.board}`;
    }
}

function heuristic(board) {
    let conflicts = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = i + 1; j < board.length; j++) {
            if (board[i] === board[j] || Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
                conflicts += 1;
            }
        }
    }
    return conflicts;
}

function is_goal_state(board) {
    return heuristic(board) === 0;
}

function generate_neighbors(board) {
    const neighbors = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i] !== j) {
                const neighbor = [...board];
                neighbor[i] = j;
                neighbors.push(new Node(neighbor));
            }
        }
    }
    return neighbors;
}

function find_min_f(open_set, f_scores) {
    let min_f = Infinity;
    let min_node = null;
    for (const node of open_set) {
        if (f_scores[node] < min_f) {
            min_f = f_scores[node];
            min_node = node;
        }
    }
    return min_node;
}

function a_star(board, solutions) {
    const start_node = new Node(board);

    const open_set = new Set([start_node]);
    const closed_set = new Set();
    const g_scores = { [start_node]: 0 };
    const f_scores = { [start_node]: heuristic(board) };

    let iterations = 0;
    const explored_path = [];

    while (open_set.size > 0) {
        const current_node = find_min_f(open_set, f_scores);
        open_set.delete(current_node);
        explored_path.push(current_node);
        iterations += 1;

        if (is_goal_state(current_node.board) && !solutions.includes(current_node.board.toString())) {
            return [current_node.board, iterations, explored_path];
        }

        closed_set.add(current_node);
        const neighbors = generate_neighbors(current_node.board);
        for (const neighbor of neighbors) {
            const tentative_g_score = g_scores[current_node] + 1;
            if (!closed_set.has(neighbor) || tentative_g_score < g_scores[neighbor] || g_scores[neighbor] === undefined) {
                open_set.add(neighbor);
                g_scores[neighbor] = tentative_g_score;
                f_scores[neighbor] = tentative_g_score + heuristic(neighbor.board);
            }
        }
    }

    return [null, iterations, explored_path];
}

function print_board(board) {
    for (const row of board) {
        const line = Array(board.length).fill('.').map((val, i) => i === row ? 'Q' : val);
        console.log(line.join(' '));
    }
}

function visualize_explored_nodes(explored_path) {
    for (let i = 0; i < explored_path.length; i++) {
        console.log(`Iteration ${i + 1}: ${explored_path[i]}`);
    }
}

function main(num_solutions = 1) {
    const solutions = [];
    for (let i = 0; i < num_solutions; i++) {
        const initial_board = Array.from({ length: 8 }, (_, i) => i);
        const [solution, iterations, explored_path] = a_star(initial_board, solutions);
        solutions.push(solution.toString());
        if (solution) {
            console.log("Solução encontrada:");
            print_board(solution);
            console.log("Número de iterações:", iterations);
            console.log("Caminho explorado:");
            visualize_explored_nodes(explored_path);
        } else {
            console.log("Não foi possível encontrar outra solução.");
        }
        console.log("----");
    }
}

main(3);