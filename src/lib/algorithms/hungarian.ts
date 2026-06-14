/**
 * Hungarian Algorithm (Kuhn-Munkres) for optimal 1:1 assignment.
 * Minimizes the total cost (time estimates).
 */

export type Assignment = {
  memberId: string;
  taskId: string;
  estimatedHours: number;
  isDummyMember?: boolean;
  isDummyTask?: boolean;
};

// Standard O(n^3) Hungarian Algorithm implementation
function hungarian(costMatrix: number[][]): number[] {
  const n = costMatrix.length;
  if (n === 0) return [];

  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(Infinity);
    const used = new Array(n + 1).fill(false);

    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;

      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cur = costMatrix[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);

    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  const ans = new Array(n);
  for (let j = 1; j <= n; j++) {
    ans[p[j] - 1] = j - 1;
  }
  return ans;
}

export function runHungarianAssignment(
  members: string[],
  tasks: string[],
  timeEstimatesMatrix: number[][]
): Assignment[] {
  const numMembers = members.length;
  const numTasks = tasks.length;
  if (numMembers === 0 || numTasks === 0) return [];

  // Determine duplication factor if tasks > members
  const maxTasksPerMember = Math.ceil(numTasks / numMembers);
  
  // Create expanded members and matrix
  const expandedMembers: string[] = [];
  const expandedMatrix: number[][] = [];
  
  for (let i = 0; i < numMembers; i++) {
    for (let k = 0; k < maxTasksPerMember; k++) {
      expandedMembers.push(members[i]);
      expandedMatrix.push(timeEstimatesMatrix[i]);
    }
  }
  
  const n = Math.max(expandedMembers.length, numTasks);

  // Pad the matrix to be N x N
  const paddedMatrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    paddedMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i < expandedMembers.length && j < numTasks) {
        paddedMatrix[i][j] = expandedMatrix[i][j];
      } else {
        // Dummy task (or dummy member if expanded length < numTasks)
        paddedMatrix[i][j] = 0;
      }
    }
  }

  const assignmentArray = hungarian(paddedMatrix);

  const results: Assignment[] = [];
  for (let i = 0; i < n; i++) {
    const j = assignmentArray[i]; // Member i is assigned Task j
    
    const isDummyMember = i >= expandedMembers.length;
    const isDummyTask = j >= numTasks;

    if (!isDummyMember && !isDummyTask) {
      results.push({
        memberId: expandedMembers[i],
        taskId: tasks[j],
        estimatedHours: expandedMatrix[i][j],
        isDummyMember: false,
        isDummyTask: false
      });
    }
  }

  return results;
}
