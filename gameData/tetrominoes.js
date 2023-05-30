export const tetrominoes = {
    I: {
        shape: [[0, 0], [1, 0], [2, 0], [3, 0]],
        color: "cyan",
        center: [1.5, 0.5],
        width: 4,
        height: 1
    },
    J: {
        shape: [[0, 0], [0, 1], [1, 1], [2, 1]],
        color: "blue",
        center: [1, 1],
        width: 3,
        height: 2
    },
    L: {
        shape: [[2, 0], [0, 1], [1, 1], [2, 1]],
        color: "orange",
        center: [1, 1],
        width: 3,
        height: 2
    },
    O: {
        shape: [[0, 0], [1, 0], [0, 1], [1, 1]],
        color: "yellow",
        center: [0.5, 0.5],
        width: 2,
        height: 2
    },
    S: {
        shape: [[1, 0], [2, 0], [0, 1], [1, 1]],
        color: "lime",
        center: [1, 1],
        width: 3,
        height: 2
    },
    T: {
        shape: [[1, 0], [0, 1], [1, 1], [2, 1]],
        color: "magenta",
        center: [1, 1],
        width: 3,
        height: 2
    },
    Z: {
        shape: [[0, 0], [1, 0], [1, 1], [2, 1]],
        color: "red",
        center: [1, 1],
        width: 3,
        height: 2
    }
};

// shape: [[0, 1], [1, 1], [2, 1], [3, 1]]
// 90deg: [[2, 0], [2, 1], [2, 2], [2, 3]]
// 180deg: [[3, 2], [2, 2], [1, 2], [0, 2]]
// center: [1.5, 0.5]
// rotation: [-1.5, 0.5] > [-0.5, -1.5] > [1.5, -0.5] > [0.5, 1.5]



// shape: [[4, 0], [4, 1], [3, 2], [4, 2], [3, 3]]
// 90deg: [[6, 4], [5, 4], [4, 3], [4, 4], [3, 3]]
// center: [3, 3] 
// rotation: [1, -3] > [3, 1] > [-1, 3] > [-3, -1]
// rotation logic: [+X, +Y] > [-X, +Y] > [-X, -Y] > [+X, -Y] 