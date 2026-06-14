// Greedy LPT Algorithm utility (pure client/server-safe, no directives)

export type Student = {
  id: string
  name: string
  email: string
  skillScore: number
}

export type DraftGroup = {
  name: string
  members: (Student & { isLeader: boolean })[]
  totalScore: number
}

/**
 * Greedy LPT (Longest Processing Time) grouping algorithm.
 * Assigns students to groups by always putting the next student into the
 * group with the minimum current total score. Leader = highest scorer per group.
 */
export function greedyLPT(students: Student[], numGroups: number): DraftGroup[] {
  if (numGroups <= 0) return []
  
  // 1. Sort students DESCENDING by skill score
  const sorted = [...students].sort((a, b) => b.skillScore - a.skillScore)

  // 2. Initialize groups
  const groups: DraftGroup[] = Array.from({ length: numGroups }, (_, i) => ({
    name: `Group ${i + 1}`,
    members: [],
    totalScore: 0,
  }))

  // 3. Assign each student to the group with minimum total score
  for (const student of sorted) {
    let target = groups[0]
    for (const g of groups) {
      if (
        g.totalScore < target.totalScore ||
        (g.totalScore === target.totalScore && g.members.length < target.members.length) ||
        (g.totalScore === target.totalScore && g.members.length === target.members.length && groups.indexOf(g) < groups.indexOf(target))
      ) {
        target = g
      }
    }
    target.members.push({ ...student, isLeader: false })
    target.totalScore += student.skillScore
  }

  // 4. Assign leader = member with highest skill score in each group
  for (const group of groups) {
    if (group.members.length > 0) {
      const leaderIdx = group.members.reduce(
        (maxIdx, m, idx, arr) => m.skillScore > arr[maxIdx].skillScore ? idx : maxIdx,
        0
      )
      group.members[leaderIdx].isLeader = true
    }
  }

  return groups
}
