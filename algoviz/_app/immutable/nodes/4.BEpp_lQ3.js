import{$ as e,C as t,F as n,G as r,H as i,I as a,K as o,N as s,O as c,S as l,T as u,U as d,V as f,W as p,X as ee,Z as m,c as h,et as g,h as _,j as v,k as y,n as te,nt as b,o as ne,p as re,q as x,s as ie,v as S,x as C,y as w,z as ae}from"../chunks/BOxkOv4P.js";import"../chunks/xihTtKlq.js";var T=b({trailingSlash:()=>E}),E=`always`,D=`class Heap<T> {
  private a: T[] = [];
  constructor(private before: (a: T, b: T) => boolean) {}
  get size(): number { return this.a.length; }
  peek(): T | undefined { return this.a[0]; }

  push(value: T): void {
    const a = this.a;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.before(a[i]!, a[p]!)) break;
      [a[i], a[p]] = [a[p]!, a[i]!];
      i = p;
    }
  }

  pop(): T | undefined {
    const a = this.a;
    if (!a.length) return undefined;
    const root = a[0]!;
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (2 * i + 1 < a.length) {
        let child = 2 * i + 1;
        const right = child + 1;
        if (right < a.length && this.before(a[right]!, a[child]!)) {
          child = right;
        }
        if (!this.before(a[child]!, a[i]!)) break;
        [a[i], a[child]] = [a[child]!, a[i]!];
        i = child;
      }
    }
    return root;
  }
}`,O=[{id:`hashing`,title:`Hash maps & sets`,group:`Scan & search`,level:`Core`,cue:`Duplicates, counts, grouping, or “have I seen the complement?”`,idea:`Remember earlier work so each lookup replaces another scan.`,know:`Use Set for membership and Map for counts or indices. Decide exactly what each key represents.`,invariant:`Before processing index i, the map contains only earlier indices.`,trap:`Look up the complement before inserting the current value, or you can reuse the same index. Check undefined, not truthiness: index 0 is valid.`,time:`O(n) expected`,space:`O(n)`,example:`twoSum([2, 7, 11, 15], 9) → [0, 1]`,code:`function twoSum(a: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < a.length; i++) {
    const j = seen.get(target - a[i]!);
    if (j !== undefined) return [j, i];
    seen.set(a[i]!, i);
  }
  return [];
}`,visualizations:[{id:`two-sum`,title:`Two Sum`},{id:`group-anagrams`,title:`Group Anagrams`}]},{id:`two-pointers`,title:`Two pointers`,group:`Scan & search`,level:`Core`,cue:`A sorted pair, a palindrome, or an in-place read/write pass.`,idea:`Move the pointer whose current position you can safely rule out.`,know:`For a sorted pair sum: too small → move left forward; too large → move right backward. Be able to explain why the discarded candidates cannot work.`,invariant:`If a valid pair remains, both of its indices are inside [left, right].`,trap:`The movement rule depends on the problem. Sorting costs O(n log n) and loses original indices unless you preserve them.`,time:`O(n) on sorted input`,space:`O(1)`,example:`sortedPair([1, 3, 4, 6], 7) → [0, 3]`,code:`// Input is sorted ascending; returns indices in this array.
function sortedPair(a: number[], target: number): number[] {
  let left = 0, right = a.length - 1;
  while (left < right) {
    const sum = a[left]! + a[right]!;
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,visualizations:[{id:`container-most-water`,title:`Container With Most Water`},{id:`trapping-rain-water`,title:`Trapping Rain Water`}]},{id:`sliding-window`,title:`Sliding window`,group:`Scan & search`,level:`Core`,cue:`A longest/shortest contiguous range with a repairable constraint.`,idea:`Extend the right edge; shrink the left edge until the window is valid.`,know:`Track just enough to add and remove an item. For longest valid windows, record after repair; for shortest covering windows, record while shrinking a valid window.`,invariant:`After the while loop, this example’s window contains no repeated character.`,trap:`Contiguous is not a subsequence. Negative values break the usual sum-based shrinking rule; exact sums with negatives often need prefix sums + a map.`,time:`O(n) expected`,space:`O(n)`,example:`longestUnique("abcabcbb") → 3`,code:`function longestUnique(s: string): number {
  const chars = [...s];
  const window = new Set<string>();
  let left = 0, best = 0;
  for (let right = 0; right < chars.length; right++) {
    while (window.has(chars[right]!)) {
      window.delete(chars[left++]!);
    }
    window.add(chars[right]!);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,visualizations:[{id:`longest-unique-substring`,title:`Longest Unique Substring`},{id:`min-window-substring`,title:`Minimum Window Substring`}]},{id:`prefix-sums`,title:`Prefix sums`,group:`Scan & search`,level:`Core`,cue:`Repeated range totals, or counting contiguous ranges with a target sum.`,idea:`A range sum is the difference between two prefix sums.`,know:`Build prefix[0] = 0 and prefix[i + 1] = prefix[i] + a[i]. Then sum of [l, r) is prefix[r] − prefix[l]. For target k, count previous prefixes equal to sum − k.`,invariant:`The frequency map counts prefixes ending before the current prefix.`,trap:`Seed frequency 0 with 1 to count ranges starting at index 0. Look up before incrementing, especially when k = 0.`,time:`O(n) expected`,space:`O(n)`,example:`countSum([1, -1, 0], 0) → 3`,code:`function countSum(a: number[], k: number): number {
  const freq = new Map<number, number>([[0, 1]]);
  let sum = 0, count = 0;
  for (const x of a) {
    sum += x;
    count += freq.get(sum - k) ?? 0;
    freq.set(sum, (freq.get(sum) ?? 0) + 1);
  }
  return count;
}`,visualizations:[{id:`range-sum-query`,title:`Range Sum Query`},{id:`subarray-sum-k`,title:`Subarray Sum Equals K`}]},{id:`binary-search`,title:`Binary search`,group:`Scan & search`,level:`Core`,cue:`Sorted data, or a feasibility test that changes from false to true once.`,idea:`Keep the answer boundary and discard half the search space each time.`,know:`Learn one boundary template: first index with a[i] ≥ target. For “minimum capacity/time that works,” replace the comparison with a monotone feasibility test.`,invariant:`Indices before lo are too small; indices at or after hi meet the target. The boundary stays in [lo, hi].`,trap:`The result can be a.length. Exact search needs an equality check afterward. Prove monotonicity before searching an answer space.`,time:`O(log n)`,space:`O(1)`,example:`lowerBound([1, 3, 3, 7], 3) → 1`,code:`function lowerBound(a: number[], target: number): number {
  let lo = 0, hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}`,visualizations:[{id:`search-rotated-array`,title:`Search Rotated Array`},{id:`time-based-kv`,title:`Time Based Key-Value Store`}]},{id:`intervals`,title:`Sorting & intervals`,group:`Scan & search`,level:`Core`,cue:`Overlapping ranges, schedules, merging, or conflicting bookings.`,idea:`Sort endpoints so only the current merged interval needs attention.`,know:`Merge by start time. Select the most non-overlapping intervals by end time. Count simultaneous events with a sweep or a min-heap of end times.`,invariant:`The output stays sorted and disjoint; only its last interval can overlap the next input.`,trap:`Agree on closed [a, b] versus half-open [a, b) endpoints. Touching closed intervals merge; half-open meetings can reuse a room at the same time.`,time:`O(n log n)`,space:`O(n)`,example:`mergeIntervals([[1, 3], [2, 6], [8, 10]]) → [[1, 6], [8, 10]]`,code:`type Interval = [number, number];
function mergeIntervals(input: Interval[]): Interval[] {
  const sorted = [...input].sort((a, b) => a[0] - b[0]);
  const out: Interval[] = [];
  for (const [start, end] of sorted) {
    const last = out.at(-1);
    if (!last || start > last[1]) out.push([start, end]);
    else last[1] = Math.max(last[1], end);
  }
  return out;
}`,visualizations:[{id:`merge-intervals`,title:`Merge Intervals`},{id:`meeting-rooms-ii`,title:`Meeting Rooms II`},{id:`skyline`,title:`Skyline Sweep`}]},{id:`stack`,title:`Stacks`,group:`Scan & search`,level:`Core`,cue:`Nesting, matching delimiters, undo, or “finish the most recent thing.”`,idea:`The last unfinished item is the first one you resolve.`,know:`Use an array with push/pop. For matching brackets, push openings and compare each closing bracket with the top.`,invariant:`The stack contains exactly the openings that still need a matching close.`,trap:`A closing bracket can arrive with an empty stack. A nonempty stack at the end is also invalid.`,time:`O(n)`,space:`O(n)`,example:`validBrackets("([])") → true`,code:`// Input contains only ()[]{} characters.
function validBrackets(s: string): boolean {
  const close = new Map([
    [")", "("], ["]", "["], ["}", "{"],
  ]);
  const stack: string[] = [];
  for (const ch of s) {
    if (!close.has(ch)) stack.push(ch);
    else if (stack.pop() !== close.get(ch)) return false;
  }
  return stack.length === 0;
}`,visualizations:[{id:`valid-parentheses`,title:`Valid Parentheses`},{id:`exclusive-time`,title:`Exclusive Time of Functions`}]},{id:`monotonic`,title:`Monotonic stacks & deques`,group:`Scan & search`,level:`Next`,cue:`Next greater/smaller item, warmer day, or maximum in every window.`,idea:`Keep unresolved candidates in order; remove candidates the new item beats.`,know:`Store indices. A stack resolves next-greater queries; a deque keeps window candidates, discarding expired indices from its front and dominated values from its back.`,invariant:`This stack holds unresolved indices in non-increasing value order.`,trap:`Choose < versus ≤ based on whether equal values count. Each index enters and leaves once, so the nested while loop is still linear.`,time:`O(n)`,space:`O(n)`,example:`nextGreater([2, 1, 2, 4, 3]) → [4, 2, 4, -1, -1]`,code:`function nextGreater(a: number[]): number[] {
  const answer = Array<number>(a.length).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < a.length; i++) {
    while (stack.length && a[stack.at(-1)!]! < a[i]!) {
      answer[stack.pop()!] = a[i]!;
    }
    stack.push(i);
  }
  return answer;
}`,visualizations:[{id:`sliding-window-maximum`,title:`Sliding Window Maximum`}]},{id:`linked-list`,title:`Linked lists`,group:`Traverse & connect`,level:`Core`,cue:`Reverse links, detect a cycle, find the middle, or splice nodes.`,idea:`Keep references to the nodes you will need before changing any link.`,know:`Reversal needs prev/current/next. Fast/slow pointers find a middle or cycle in O(n) time and O(1) space. A dummy node simplifies deleting or inserting at the head.`,invariant:`prev heads the reversed prefix; current heads the untouched suffix.`,trap:`Save current.next before overwriting it. Compare node identity for cycles, not node values. This reversal assumes an acyclic list.`,time:`O(n)`,space:`O(1)`,example:`1 → 2 → 3 becomes 3 → 2 → 1`,code:`type ListNode = { val: number; next: ListNode | null };
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,visualizations:[{id:`linked-list-reversal`,title:`Reverse Linked List`},{id:`linked-list-cycle`,title:`Linked List Cycle`}]},{id:`tree-dfs`,title:`Trees & recursive DFS`,group:`Traverse & connect`,level:`Core`,cue:`Subtree height, path information, ancestry, or validating a tree.`,idea:`Define what one subtree returns, then combine its children’s answers.`,know:`Write the null case first. Preorder acts before children; inorder visits left/node/right; postorder combines child results. BST validation passes ancestor bounds down.`,invariant:`Each call returns the correct result for the entire subtree rooted at its argument.`,trap:`Tree height can be n, so recursion can overflow the JS call stack. A graph needs a visited set; a proper tree does not.`,time:`O(n)`,space:`O(h) call stack`,example:`maxDepth(null) → 0; a three-node chain → 3`,code:`type TreeNode = {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
};
function maxDepth(node: TreeNode | null): number {
  if (!node) return 0;
  const left = maxDepth(node.left);
  const right = maxDepth(node.right);
  return 1 + Math.max(left, right);
}`,visualizations:[{id:`validate-bst`,title:`Validate BST`},{id:`lowest-common-ancestor`,title:`Lowest Common Ancestor`}]},{id:`bfs`,title:`Breadth-first search`,group:`Traverse & connect`,level:`Core`,cue:`Fewest unweighted steps, nearest target, or tree levels.`,idea:`Visit everything one step away before anything two steps away.`,know:`Use a FIFO queue and mark visited when enqueuing. For level-by-level work, freeze the queue’s end index before processing a level.`,invariant:`Vertices leave the queue in nondecreasing distance; first discovery gives the shortest unweighted distance.`,trap:`BFS does not solve general weighted shortest paths. Avoid repeated Array.shift(); use a head index.`,time:`O(V + E)`,space:`O(V) auxiliary`,example:`distances([[1, 2], [3], [3], []], 0) → [0, 1, 1, 2]`,code:`// Vertices are 0..graph.length-1; start is a valid vertex.
function distances(graph: number[][], start: number): number[] {
  const distance = Array<number>(graph.length).fill(-1);
  const queue = [start];
  distance[start] = 0;
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head]!;
    for (const v of graph[u]!) {
      if (distance[v] !== -1) continue;
      distance[v] = distance[u]! + 1;
      queue.push(v);
    }
  }
  return distance;
}`,visualizations:[{id:`tree-level-order`,title:`Level Order Traversal`},{id:`number-of-islands`,title:`Number of Islands`}]},{id:`graph-dfs`,title:`Graphs & flood fill`,group:`Traverse & connect`,level:`Core`,cue:`Reachability, connected components, islands, or copying a network.`,idea:`Explore one connected region, marking nodes so cycles cannot repeat work.`,know:`Represent edges with adjacency lists. For a grid, neighbors are adjacent cells. To count components, launch a traversal from every still-unvisited node.`,invariant:`Each discovered vertex is marked before it can be added to the stack again.`,trap:`A single start misses disconnected components. Directed-cycle detection needs active/finished states, not just a single visited flag.`,time:`O(V + E)`,space:`O(V) auxiliary`,example:`components([[1], [0], []]) → 2`,code:`// Undirected graph: each edge appears in both directions.
function components(graph: number[][]): number {
  const seen = new Set<number>();
  let count = 0;
  for (let start = 0; start < graph.length; start++) {
    if (seen.has(start)) continue;
    count++;
    seen.add(start);
    const stack = [start];
    while (stack.length) {
      const u = stack.pop()!;
      for (const v of graph[u]!) {
        if (seen.has(v)) continue;
        seen.add(v);
        stack.push(v);
      }
    }
  }
  return count;
}`,visualizations:[{id:`number-of-islands`,title:`Number of Islands`},{id:`clone-graph`,title:`Clone Graph`}]},{id:`topological`,title:`Topological sort`,group:`Traverse & connect`,level:`Next`,cue:`Prerequisites, dependency order, or detecting a directed cycle.`,idea:`Repeatedly take a node with no remaining prerequisites.`,know:`For edge u → v, increment indegree[v]. Queue all zero-indegree nodes, emit each one, and decrement its outgoing neighbors. Fewer than V emitted means a cycle.`,invariant:`A queued vertex has no incoming edges from any unprocessed vertex.`,trap:`Use the correct edge direction. Include isolated nodes. If you deduplicate adjacency edges, deduplicate their indegree increments too.`,time:`O(V + E)`,space:`O(V) auxiliary`,example:`topo([[1], [2], []]) → [0, 1, 2]`,code:`function topo(graph: number[][]): number[] | null {
  const degree = Array<number>(graph.length).fill(0);
  for (const edges of graph) {
    for (const v of edges) degree[v] = degree[v]! + 1;
  }
  const queue: number[] = [];
  degree.forEach((d, u) => { if (d === 0) queue.push(u); });
  for (let head = 0; head < queue.length; head++) {
    for (const v of graph[queue[head]!]!) {
      degree[v] = degree[v]! - 1;
      if (degree[v] === 0) queue.push(v);
    }
  }
  return queue.length === graph.length ? queue : null;
}`,visualizations:[{id:`course-schedule`,title:`Course Schedule`},{id:`alien-dictionary`,title:`Alien Dictionary`}]},{id:`union-find`,title:`Union-find`,group:`Traverse & connect`,level:`Next`,cue:`Repeatedly joining groups, undirected connectivity, or redundant edges.`,idea:`Give each component a representative and merge representatives.`,know:`find follows parent links; union connects roots. Path compression plus union by size makes operations almost constant amortized time.`,invariant:`Two items are connected exactly when find returns the same root.`,trap:`Merge roots, not arbitrary nodes. Union-find does not give paths and does not efficiently handle arbitrary edge deletions.`,time:`O(α(n)) amortized per operation`,space:`O(n)`,example:`union(0, 1); union(1, 2); find(0) === find(2)`,code:`class UnionFind {
  private parent: number[];
  private size: number[];
  constructor(n: number) {
    this.parent = Array.from({length: n}, (_, i) => i);
    this.size = Array<number>(n).fill(1);
  }
  find(x: number): number {
    while (x !== this.parent[x]) {
      this.parent[x] = this.parent[this.parent[x]!]!;
      x = this.parent[x]!;
    }
    return x;
  }
  union(a: number, b: number): boolean {
    let x = this.find(a), y = this.find(b);
    if (x === y) return false;
    if (this.size[x]! < this.size[y]!) [x, y] = [y, x];
    this.parent[y] = x;
    this.size[x] = this.size[x]! + this.size[y]!;
    return true;
  }
}`,visualizations:[{id:`accounts-merge`,title:`Accounts Merge`}]},{id:`trie`,title:`Tries`,group:`Traverse & connect`,level:`Next`,cue:`Many prefix queries, autocomplete, or dictionary-guided search.`,idea:`Share the common prefixes of words in a tree of characters.`,know:`Each node maps a character to a child. A terminal flag distinguishes a complete word from a prefix. Traversing L characters takes O(L) expected time.`,invariant:`The path from the root spells the prefix represented by the current node.`,trap:`A found path is not necessarily a full word. Autocomplete also costs time proportional to the results you traverse and return.`,time:`O(L) expected per insert/lookup`,space:`O(total inserted characters)`,example:`insert("cat"); has("cat") → true; has("ca") → false`,code:`class Trie {
  private children = new Map<string, Trie>();
  private terminal = false;
  insert(word: string): void {
    let node: Trie = this;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new Trie());
      node = node.children.get(ch)!;
    }
    node.terminal = true;
  }
  has(word: string): boolean {
    let node: Trie = this;
    for (const ch of word) {
      const next = node.children.get(ch);
      if (!next) return false;
      node = next;
    }
    return node.terminal;
  }
}`,visualizations:[{id:`trie-autocomplete`,title:`Trie Autocomplete`}]},{id:`heap`,title:`Heaps & priority queues`,group:`Choose & optimize`,level:`Core`,cue:`Repeated best item, top-k, merging sorted streams, or scheduling.`,idea:`Keep the next highest-priority item at the root without sorting everything.`,know:`A binary heap has O(1) peek and O(log n) push/pop. For kth largest, keep a min-heap of size k: its root is the smallest retained winner.`,invariant:`After each item, the heap holds the largest min(k, items seen) values.`,trap:`A heap’s array is not fully sorted. Define the comparator direction and tie-breaks. Confirm whether the interview environment supplies a priority queue.`,time:`O(n log(k + 1))`,space:`O(k)`,example:`kthLargest([3, 2, 1, 5, 6, 4], 2) → 5`,helper:D,code:`function kthLargest(a: number[], k: number): number {
  if (!Number.isInteger(k) || k < 1 || k > a.length) {
    throw new RangeError("k must be between 1 and a.length");
  }
  const heap = new Heap<number>((a, b) => a < b);
  for (const x of a) {
    heap.push(x);
    if (heap.size > k) heap.pop();
  }
  return heap.peek()!;
}`,visualizations:[{id:`kth-largest`,title:`Kth Largest`},{id:`merge-k-sorted`,title:`Merge k Sorted Lists`},{id:`median-stream`,title:`Median from Data Stream`}]},{id:`backtracking`,title:`Backtracking`,group:`Choose & optimize`,level:`Core`,cue:`Generate all subsets, combinations, permutations, or valid arrangements.`,idea:`Choose, explore, undo; abandon a branch as soon as it cannot work.`,know:`Define the partial answer, available choices, and stopping rule. Use a start index for combinations and a used set/array for permutations. Copy each completed answer.`,invariant:`On returning from a recursive call, the shared path is restored to its previous contents.`,trap:`Pushing path itself aliases every answer. Duplicate inputs need a deliberate skip rule. Exponential output means exponential work is unavoidable.`,time:`O(n · 2ⁿ) for all subsets`,space:`O(n) auxiliary; O(n · 2ⁿ) output`,example:`subsets([1, 2]) → [[], [1], [1, 2], [2]]`,code:`// Input values are distinct.
function subsets(a: number[]): number[][] {
  const out: number[][] = [], path: number[] = [];
  function visit(start: number): void {
    out.push([...path]);
    for (let i = start; i < a.length; i++) {
      path.push(a[i]!);
      visit(i + 1);
      path.pop();
    }
  }
  visit(0);
  return out;
}`,visualizations:[{id:`generate-parentheses`,title:`Generate Parentheses`}]},{id:`dynamic-programming`,title:`Dynamic programming`,group:`Choose & optimize`,level:`Core`,cue:`Count ways or optimize choices that repeatedly reach the same subproblem.`,idea:`Name each subproblem precisely and compute its answer once.`,know:`Write state → transition → base cases → evaluation order → final answer. Memoize all state dimensions, or fill a table in dependency order. Time = states × work per state.`,invariant:`When dp[sum] is computed, every smaller amount it depends on already has its best answer.`,trap:`Greedy coin choice can fail: [1, 3, 4], amount 6 needs 3 + 3. Zero often means a valid answer, so use Infinity for unreachable minimum-cost states.`,time:`O(amount · coins.length)`,space:`O(amount)`,example:`coinChange([1, 3, 4], 6) → 2`,code:`// Positive integer coins; nonnegative integer amount.
function coinChange(coins: number[], amount: number): number {
  const dp = Array<number>(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let sum = 1; sum <= amount; sum++) {
    for (const coin of coins) {
      if (coin <= sum) {
        dp[sum] = Math.min(dp[sum]!, dp[sum - coin]! + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]!;
}`,visualizations:[{id:`climbing-stairs`,title:`Climbing Stairs`},{id:`coin-change`,title:`Coin Change`},{id:`edit-distance`,title:`Edit Distance`}]},{id:`greedy`,title:`Greedy algorithms`,group:`Choose & optimize`,level:`Core`,cue:`An optimization where one local choice can be proved safe.`,idea:`Make a choice you can show never makes the remaining solution worse.`,know:`Explain an exchange argument: an optimal solution can replace its first choice with yours without losing quality. For non-overlapping meetings, choose the earliest finish.`,invariant:`After choosing each meeting, the selected set leaves as much remaining time as possible among equally large feasible selections.`,trap:`“Seems best now” is not a proof. Earliest start and shortest duration are not valid substitutes for earliest finish in interval scheduling.`,time:`O(n log n)`,space:`O(n) for the sorted copy`,example:`maxMeetings([[1, 3], [2, 4], [3, 5]]) → 2`,code:`// Half-open intervals [start, end), with start < end.
function maxMeetings(input: [number, number][]): number {
  const sorted = [...input].sort((a, b) => a[1] - b[1]);
  let end = -Infinity, count = 0;
  for (const [start, finish] of sorted) {
    if (start < end) continue;
    count++;
    end = finish;
  }
  return count;
}`,visualizations:[{id:`non-overlapping-intervals`,title:`Non-overlapping Intervals`},{id:`task-scheduler`,title:`Task Scheduler`}]},{id:`shortest-path`,title:`Weighted shortest paths`,group:`Choose & optimize`,level:`Next`,cue:`Cheapest route through a graph whose edges have different costs.`,idea:`Dijkstra expands the unsettled vertex with the smallest known distance.`,know:`Relax each edge: if distance[u] + weight improves distance[v], save it and enqueue it. Use BFS for equal weights; Dijkstra requires nonnegative weights.`,invariant:`A non-stale minimum-distance entry popped from the heap has its final shortest distance.`,trap:`Skip stale heap entries after an improvement. Negative edges require another algorithm, such as Bellman–Ford; unreachable vertices stay Infinity.`,time:`O(V + E log(E + 1)) with lazy heap entries`,space:`O(V + E) auxiliary`,example:`dijkstra([[[1, 4], [2, 1]], [], [[1, 2]]], 0) → [0, 3, 1]`,helper:D,code:`// Edge = [destination, nonnegative weight]; start is valid.
function dijkstra(graph: [number, number][][], start: number): number[] {
  const dist = Array<number>(graph.length).fill(Infinity);
  const heap = new Heap<[number, number]>((a, b) => a[0] < b[0]);
  dist[start] = 0;
  heap.push([0, start]);
  while (heap.size) {
    const [cost, u] = heap.pop()!;
    if (cost !== dist[u]) continue;
    for (const [v, weight] of graph[u]!) {
      const next = cost + weight;
      if (next >= dist[v]!) continue;
      dist[v] = next;
      heap.push([next, v]);
    }
  }
  return dist;
}`,visualizations:[]},{id:`divide-conquer`,title:`Divide & conquer`,group:`Choose & optimize`,level:`Next`,cue:`A problem splits into independent smaller pieces with a useful combine step.`,idea:`Solve smaller versions, then combine their answers.`,know:`Merge sort splits in half and merges sorted halves. Its log n levels each do O(n) work. Know quicksort’s expected O(n log n), worst O(n²), and quickselect’s expected O(n).`,invariant:`Before merging, both halves are sorted; the output prefix contains the smallest items consumed so far.`,trap:`Account for the combine work and allocation. This allocating merge sort uses O(n) peak auxiliary space; it is not in-place.`,time:`O(n log n)`,space:`O(n) peak auxiliary`,example:`mergeSort([4, 1, 3, 2]) → [1, 2, 3, 4]`,code:`function mergeSort(a: number[]): number[] {
  if (a.length <= 1) return [...a];
  const mid = Math.floor(a.length / 2);
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i]! <= right[j]!) out.push(left[i++]!);
    else out.push(right[j++]!);
  }
  while (i < left.length) out.push(left[i++]!);
  while (j < right.length) out.push(right[j++]!);
  return out;
}`,visualizations:[]},{id:`bits`,title:`Bits & basic math`,group:`Choose & optimize`,level:`Next`,cue:`Pair cancellation, compact subsets, parity, divisibility, or cycles.`,idea:`Use an algebraic property that removes unnecessary enumeration.`,know:`x ^ x = 0 and x ^ 0 = x; n & (n − 1) clears the lowest set bit. For greatest common divisor, repeatedly replace (a, b) with (b, a % b).`,invariant:`The XOR accumulator equals the XOR of all values processed; equal pairs cancel.`,trap:`Number bitwise operators coerce to 32-bit integers. Use BigInt for wider integer bit operations, and never mix bigint and number operands.`,time:`O(n) for singleNumber`,space:`O(1)`,example:`singleNumber([4, 1, 2, 1, 2]) → 4`,code:`// Signed 32-bit integers; every value appears twice except one.
function singleNumber(a: number[]): number {
  let result = 0;
  for (const x of a) result ^= x;
  return result;
}

// Nonnegative safe integers.
function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}`,visualizations:[]}],k=[{clue:`Find a pair or remember a count`,ids:[`hashing`,`two-pointers`]},{clue:`Work with a contiguous range`,ids:[`sliding-window`,`prefix-sums`]},{clue:`Search sorted data or a yes/no boundary`,ids:[`binary-search`]},{clue:`Explore connections or dependencies`,ids:[`bfs`,`graph-dfs`,`topological`]},{clue:`Choose the best next item`,ids:[`heap`,`greedy`]},{clue:`Explore choices or reuse subproblems`,ids:[`backtracking`,`dynamic-programming`]}];function oe(e){return[e.helper,e.code].filter(Boolean).join(`

`)}var se=u(`<meta name="description" content="Recognize 22 algorithm patterns, learn the minimum behind each one, and practice with TypeScript templates and step-through visualizations."/>`),A=u(`<span class="next-dot svelte-1yz9liq" title="Learn next">·</span>`),j=u(`<a class="svelte-1yz9liq"><span> </span><!></a>`),M=u(`<div class="contents-group svelte-1yz9liq"><h2 class="svelte-1yz9liq"> </h2> <!></div>`),ce=u(`<a class="svelte-1yz9liq"> <span aria-hidden="true">↗</span></a>`),N=u(`<div class="chooser-row svelte-1yz9liq"><p class="svelte-1yz9liq"> </p><div class="svelte-1yz9liq"></div></div>`),le=u(`<button class="svelte-1yz9liq"> </button>`),ue=u(`<div class="empty-state svelte-1yz9liq"><h3 class="svelte-1yz9liq">No matching patterns</h3><p class="svelte-1yz9liq">Try a broader clue such as “sorted,” “range,” or “graph.”</p><button class="svelte-1yz9liq">Clear filters</button></div>`),de=u(`<p class="helper-note svelte-1yz9liq">Uses the <a href="#heap-helper" class="svelte-1yz9liq">Heap helper ↓</a>. Copy includes it.</p>`),fe=u(`<a data-sveltekit-reload="" class="svelte-1yz9liq"> <span aria-hidden="true">↗</span></a>`),pe=u(`<div class="practice svelte-1yz9liq"><span class="svelte-1yz9liq">SEE IT MOVE</span><!></div>`),me=u(`<article><h3 class="svelte-1yz9liq"><button class="pattern-toggle svelte-1yz9liq"><span class="pattern-number svelte-1yz9liq"> </span> <span class="pattern-heading svelte-1yz9liq"><span class="pattern-name svelte-1yz9liq"> <span> </span></span><span class="pattern-cue svelte-1yz9liq"> </span></span> <span class="expand-mark svelte-1yz9liq" aria-hidden="true"> </span></button></h3> <div class="pattern-body svelte-1yz9liq"><p class="idea svelte-1yz9liq"> </p> <dl class="essentials svelte-1yz9liq"><div class="svelte-1yz9liq"><dt class="svelte-1yz9liq">Know this</dt><dd class="svelte-1yz9liq"> </dd></div> <div class="svelte-1yz9liq"><dt class="svelte-1yz9liq">Keep true</dt><dd class="svelte-1yz9liq"> </dd></div> <div class="trap svelte-1yz9liq"><dt class="svelte-1yz9liq">Watch for</dt><dd class="svelte-1yz9liq"> </dd></div></dl> <div class="complexity svelte-1yz9liq"><span><strong class="svelte-1yz9liq">Time</strong> </span><span><strong class="svelte-1yz9liq">Space</strong> </span></div> <div class="template svelte-1yz9liq"><div class="template-header svelte-1yz9liq"><span><span class="language-dot svelte-1yz9liq"></span> TypeScript</span><button class="svelte-1yz9liq"> </button></div> <!> <pre role="region" tabindex="0" class="svelte-1yz9liq"><code class="svelte-1yz9liq"> </code></pre></div> <p class="example svelte-1yz9liq"><span class="svelte-1yz9liq">TRACE IT</span><code class="svelte-1yz9liq"> </code></p> <!></div></article>`),he=u(`<a class="skip-link svelte-1yz9liq" href="#reference">Skip to patterns</a> <div class="sheet svelte-1yz9liq"><header class="sheet-header svelte-1yz9liq"><a class="brand svelte-1yz9liq" href="../"><span class="brand-mark svelte-1yz9liq">a.</span> algoviz <span class="slash svelte-1yz9liq">/</span> <span class="page-name svelte-1yz9liq">study order</span></a> <nav aria-label="Page actions" class="svelte-1yz9liq"><a class="back-link svelte-1yz9liq" href="../../" data-sveltekit-reload="">Open visualizer <span aria-hidden="true">↗</span></a> <button class="print-button svelte-1yz9liq">Print essentials <span aria-hidden="true">↗</span></button></nav></header> <main><section class="hero svelte-1yz9liq" aria-labelledby="page-title"><div class="eyebrow svelte-1yz9liq"><span class="ts-mark svelte-1yz9liq">TS</span> THE INTERVIEW FIELD GUIDE <span class="edition svelte-1yz9liq">01 / ALGORITHMS</span></div> <h1 id="page-title" class="svelte-1yz9liq">Recognize the pattern.<br/><span class="svelte-1yz9liq">Know the next move.</span></h1> <p class="intro svelte-1yz9liq">The minimum to recognize, explain, and implement the common interview patterns. All templates are TypeScript. Open a pattern when you need the details.</p> <div class="hero-meta svelte-1yz9liq"><span><strong class="svelte-1yz9liq"> </strong> patterns</span><span><strong class="svelte-1yz9liq"> </strong> core first</span><span>Runnable templates</span><span>Linked visualizations</span></div></section> <div class="reference-layout svelte-1yz9liq"><aside class="svelte-1yz9liq"><nav class="contents svelte-1yz9liq" aria-label="Cheat sheet contents"><p class="section-kicker svelte-1yz9liq">ON THIS SHEET</p> <a class="overview-link svelte-1yz9liq" href="#chooser">Find your pattern <span aria-hidden="true">↗</span></a> <!> <a class="overview-link toolbox-link svelte-1yz9liq" href="#typescript">TypeScript essentials <span aria-hidden="true">↗</span></a> <a class="overview-link svelte-1yz9liq" href="#heap-helper">Reusable heap <span aria-hidden="true">↗</span></a> <p class="contents-note svelte-1yz9liq">Start with Core. Add Next when the problem calls for it.</p></nav></aside> <div class="reference-content svelte-1yz9liq"><section class="interview-loop svelte-1yz9liq" aria-labelledby="loop-title"><h2 id="loop-title" class="svelte-1yz9liq">Before you reach for a template</h2> <ol class="svelte-1yz9liq"><li class="svelte-1yz9liq"><span class="svelte-1yz9liq">01</span><div><strong class="svelte-1yz9liq">Clarify</strong><p class="svelte-1yz9liq">Input size, duplicates, ordering, mutation, and the exact output.</p></div></li> <li class="svelte-1yz9liq"><span class="svelte-1yz9liq">02</span><div><strong class="svelte-1yz9liq">Explain</strong><p class="svelte-1yz9liq">State a brute-force solution, then what repeated work you can remove.</p></div></li> <li class="svelte-1yz9liq"><span class="svelte-1yz9liq">03</span><div><strong class="svelte-1yz9liq">Check</strong><p class="svelte-1yz9liq">Trace one example. Test empty, singleton, ties, and boundary cases.</p></div></li></ol></section> <section id="chooser" class="chooser svelte-1yz9liq" aria-labelledby="chooser-title"><div class="section-heading svelte-1yz9liq"><div><p class="section-kicker svelte-1yz9liq">START WITH THE CLUE</p><h2 id="chooser-title" class="svelte-1yz9liq">What is the problem asking?</h2></div><span class="small-note svelte-1yz9liq">Clues, not guarantees.</span></div> <div class="chooser-grid svelte-1yz9liq"></div></section> <section id="reference" aria-labelledby="reference-title" class="svelte-1yz9liq"><div class="section-heading svelte-1yz9liq"><div><p class="section-kicker svelte-1yz9liq">THE REFERENCE</p><h2 id="reference-title" class="svelte-1yz9liq">Patterns to keep in reach</h2></div><span class="small-note svelte-1yz9liq">Costs describe the shown template.</span></div> <div class="filter-bar svelte-1yz9liq"><label class="search svelte-1yz9liq"><span aria-hidden="true" class="svelte-1yz9liq">⌕</span><span class="sr-only svelte-1yz9liq">Search patterns</span><input type="search" placeholder="Search a pattern, clue, or pitfall…" class="svelte-1yz9liq"/></label> <div class="filters svelte-1yz9liq" role="group" aria-label="Study priority"></div></div> <div class="result-bar svelte-1yz9liq"><p aria-live="polite" class="svelte-1yz9liq"> <span class="svelte-1yz9liq">· V = vertices, E = edges, h = tree height</span></p><button class="svelte-1yz9liq"> </button></div> <!> <div class="patterns"></div></section> <section id="typescript" class="typescript svelte-1yz9liq" aria-labelledby="typescript-title"><div class="section-heading svelte-1yz9liq"><div><p class="section-kicker svelte-1yz9liq">LANGUAGE CHECK</p><h2 id="typescript-title" class="svelte-1yz9liq">TypeScript details worth remembering</h2></div><span class="ts-mark svelte-1yz9liq">TS</span></div> <div class="ts-grid svelte-1yz9liq"><div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Numbers need a comparator</h3><code class="svelte-1yz9liq">[...a].sort((x, y) => x - y)</code><p class="svelte-1yz9liq">Default sort compares strings; sort mutates its array. Copy if the input must stay unchanged.</p></div> <div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Use a queue head</h3><code class="svelte-1yz9liq">const item = queue[head++];</code><p class="svelte-1yz9liq">Keep push for enqueue. Repeated shift can move every remaining element. A head index retains consumed slots, so this queue uses O(total enqueued) storage.</p></div> <div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Zero is a value</h3><code class="svelte-1yz9liq">count.set(x, (count.get(x) ?? 0) + 1);</code><p class="svelte-1yz9liq">Check map.has(key) or value !== undefined. A stored index or count of 0 is not missing. Map and Set compare objects by identity.</p></div> <div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Each matrix row needs its own array</h3><code class="svelte-1yz9liq"></code><p class="svelte-1yz9liq">Using fill with a single inner array makes every row share the same object.</p></div> <div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Know your integer range</h3><code class="svelte-1yz9liq">Number.MAX_SAFE_INTEGER // 2 ** 53 - 1</code><p class="svelte-1yz9liq">Use bigint if exact integer results can exceed this range. Number bitwise operations use 32-bit values. BigInt arithmetic has a cost that grows with its bit length.</p></div> <div class="svelte-1yz9liq"><h3 class="svelte-1yz9liq">Be precise about strings and !</h3><code class="svelte-1yz9liq">const characters = [...text];</code><p class="svelte-1yz9liq">This iterates Unicode code points; text[i] uses UTF-16 code units. Neither handles every visible grapheme. In templates, ! asserts an index already proved valid; it adds no runtime check.</p></div></div> <p class="cost-note svelte-1yz9liq">Complexity shorthand assumes constant-cost numeric operations and expected O(1) hash lookups. Include sorting, copied arrays, the recursion stack, and returned output when explaining your costs.</p></section> <section id="heap-helper" class="heap-helper svelte-1yz9liq" aria-labelledby="heap-title"><h2 id="heap-title" class="svelte-1yz9liq"><button class="helper-toggle svelte-1yz9liq" aria-controls="heap-source"><span><span class="section-kicker svelte-1yz9liq">KEEP ONE IMPLEMENTATION HANDY</span>Reusable binary heap</span><span aria-hidden="true"> </span></button></h2> <p class="svelte-1yz9liq">Pass <code class="svelte-1yz9liq">(a, b) =&gt; a &lt; b</code> for a min-heap or <code class="svelte-1yz9liq">(a, b) =&gt; a &gt; b</code> for a max-heap. Array indices: parent ⌊(i − 1) / 2⌋, children 2i + 1 and 2i + 2.</p> <div id="heap-source"><div class="template svelte-1yz9liq"><div class="template-header svelte-1yz9liq"><span>TypeScript · generic helper</span><button class="svelte-1yz9liq"> </button></div> <pre role="region" tabindex="0" aria-label="Binary heap TypeScript helper" class="svelte-1yz9liq"><code class="svelte-1yz9liq"> </code></pre></div></div></section> <footer class="sheet-footer svelte-1yz9liq"><p class="svelte-1yz9liq">You know a pattern when you can explain why the next step is safe.</p><span class="svelte-1yz9liq">Templates: TypeScript · linked visualizations: JavaScript</span><a href="#page-title" class="svelte-1yz9liq">Back to top ↑</a></footer></div></div></main></div> <div role="status"> </div>`,1);function P(c,u){m(u,!0);let b=o(``),T=o(`All`),E=o(p(new Set([`hashing`]))),P=o(``),F=o(``),ge=[`Scan & search`,`Traverse & connect`,`Choose & optimize`],I=new Map(O.map(e=>[e.id,e])),L=x(()=>v(b).trim().toLowerCase().split(/\s+/).filter(Boolean)),R=x(()=>O.filter(e=>{let t=[e.title,e.cue,e.know,e.invariant,e.trap,e.example,e.group].join(` `).toLowerCase();return(v(T)===`All`||e.level===v(T))&&v(L).every(e=>t.includes(e))})),_e=x(()=>new Set(v(R).map(e=>e.id))),z=x(()=>v(R).length>0&&v(R).every(e=>v(E).has(e.id)));function ve(e){let t=new Set(v(E));t.has(e)?t.delete(e):t.add(e),r(E,t,!0)}function ye(){let e=new Set(v(E));for(let t of v(R))v(z)?e.delete(t.id):e.add(t.id);r(E,e,!0)}function B(){r(b,``),r(T,`All`)}async function V(e,t=!0){if(!I.has(e)&&e!==`heap-helper`)return;B(),r(E,new Set([...v(E),e]),!0),await s();let n=document.getElementById(e);n?.scrollIntoView({block:`start`}),t&&n?.querySelector(`button`)?.focus({preventScroll:!0})}function H(e,t){e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0||(e.preventDefault(),history.pushState(null,``,`#${t}`),V(t))}te(()=>{let e=()=>{V(location.hash.slice(1),!1)};return e(),window.addEventListener(`hashchange`,e),()=>window.removeEventListener(`hashchange`,e)});async function be(e,t){r(P,``),r(F,``);try{await navigator.clipboard.writeText(t),r(P,e,!0),r(F,`TypeScript copied, including any required helper.`)}catch{r(F,`Clipboard unavailable. Select the template text to copy it.`)}}function xe(e){return`../../?algo=${encodeURIComponent(e)}&lang=js`}var U=he();_(`1yz9liq`,e=>{var r=se();n(()=>{ae.title=`TypeScript interview cheat sheet — algoviz`}),t(e,r)});var W=d(i(U),2),G=f(W),Se=d(f(G),2),K=d(f(Se),2);g(Se),g(G);var q=d(G,2),J=f(q),Y=d(f(J),6),X=f(Y),Ce=f(X),we=f(Ce,!0);g(Ce),e(),g(X);var Te=d(X),Ee=f(Te),De=f(Ee,!0);g(Ee),e(),g(Te),e(2),g(Y),g(J);var Oe=d(J,2),ke=f(Oe),Ae=f(ke),je=d(f(Ae),4);S(je,17,()=>ge,w,(e,n)=>{var r=M(),i=f(r),o=f(i,!0);g(i);var s=d(i,2);S(s,17,()=>O.filter(e=>e.group===v(n)),w,(e,n)=>{var r=j(),i=f(r),o=f(i,!0);g(i);var s=d(i),c=e=>{var n=A();t(e,n)};C(s,e=>{v(n).level===`Next`&&e(c)}),g(r),a(()=>{h(r,`href`,`#${v(n).id}`),l(o,v(n).title)}),y(`click`,r,e=>H(e,v(n).id)),t(e,r)}),g(r),a(()=>l(o,v(n))),t(e,r)});var Me=d(je,4);e(2),g(Ae),g(ke);var Ne=d(ke,2),Pe=d(f(Ne),2),Fe=d(f(Pe),2);S(Fe,21,()=>k,w,(n,r)=>{var i=N(),o=f(i),s=f(o,!0);g(o);var c=d(o);S(c,21,()=>v(r).ids,w,(n,r)=>{var i=ce(),o=f(i);e(),g(i),a(e=>{h(i,`href`,`#${v(r)}`),l(o,`${e??``} `)},[()=>I.get(v(r)).title]),y(`click`,i,e=>H(e,v(r))),t(n,i)}),g(c),g(i),a(()=>l(s,v(r).clue)),t(n,i)}),g(Fe),g(Pe);var Ie=d(Pe,2),Le=d(f(Ie),2),Re=f(Le),ze=d(f(Re),2);ie(ze),g(Re);var Be=d(Re,2);S(Be,20,()=>[`All`,`Core`,`Next`],w,(e,n)=>{var i=le(),o=f(i,!0);g(i),a(()=>{h(i,`aria-pressed`,v(T)===n),l(o,n)}),y(`click`,i,()=>r(T,n,!0)),t(e,i)}),g(Be),g(Le);var Ve=d(Le,2),He=f(Ve),Ue=f(He);e(),g(He);var Z=d(He),We=f(Z);g(Z),g(Ve);var Ge=d(Ve,2),Ke=e=>{var n=ue(),r=d(f(n),2);g(n),y(`click`,r,B),t(e,n)};C(Ge,e=>{v(R).length===0&&e(Ke)});var qe=d(Ge,2);S(qe,23,()=>O,e=>e.id,(n,r,i)=>{var o=me();let s;var c=f(o),u=f(c),p=f(u),ee=f(p,!0);g(p);var m=d(p,2),_=f(m),te=f(_,!0),b=d(te);let ne;var x=f(b,!0);g(b),g(_);var ie=d(_),ae=f(ie,!0);g(ie),g(m);var T=d(m,2),D=f(T,!0);g(T),g(u),g(c);var O=d(c,2),k=f(O),se=f(k,!0);g(k);var A=d(k,2),j=f(A),M=d(f(j)),ce=f(M,!0);g(M),g(j);var N=d(j,2),le=d(f(N)),ue=f(le,!0);g(le),g(N);var he=d(N,2),F=d(f(he)),ge=f(F,!0);g(F),g(he),g(A);var I=d(A,2),L=f(I),R=d(f(L));g(L);var z=d(L),ye=d(f(z));g(z),g(I);var B=d(I,2),V=f(B),U=d(f(V)),W=f(U,!0);g(U),g(V);var G=d(V,2),Se=n=>{var r=de(),i=d(f(r));e(),g(r),y(`click`,i,e=>H(e,`heap-helper`)),t(n,r)};C(G,e=>{v(r).helper&&e(Se)});var K=d(G,2),q=f(K),J=f(q,!0);g(q),g(K),g(B);var Y=d(B,2),X=d(f(Y)),Ce=f(X,!0);g(X),g(Y);var we=d(Y,2),Te=n=>{var i=pe(),o=d(f(i));S(o,17,()=>v(r).visualizations,w,(n,r)=>{var i=fe(),o=f(i);e(),g(i),a(e=>{h(i,`href`,e),l(o,`${v(r).title??``} `)},[()=>xe(v(r).id)]),t(n,i)}),g(i),t(n,i)};C(we,e=>{v(r).visualizations.length&&e(Te)}),g(O),g(o),a((e,t,n,i,a,c)=>{h(o,`id`,v(r).id),s=re(o,1,`pattern svelte-1yz9liq`,null,s,e),h(o,`hidden`,t),h(u,`aria-expanded`,n),h(u,`aria-controls`,`${v(r).id}-body`),l(ee,i),l(te,v(r).title),ne=re(b,1,`level-tag svelte-1yz9liq`,null,ne,{core:v(r).level===`Core`}),l(x,v(r).level),l(ae,v(r).cue),l(D,a),h(O,`id`,`${v(r).id}-body`),h(O,`hidden`,c),l(se,v(r).idea),l(ce,v(r).know),l(ue,v(r).invariant),l(ge,v(r).trap),l(R,` ${v(r).time??``}`),l(ye,` ${v(r).space??``}`),h(U,`aria-label`,`Copy ${v(r).title} template`),l(W,v(P)===v(r).id?`Copied ✓`:`Copy template`),h(K,`aria-label`,`${v(r).title} TypeScript template`),l(J,v(r).code),l(Ce,v(r).example)},[()=>({expanded:v(E).has(v(r).id)}),()=>!v(_e).has(v(r).id),()=>v(E).has(v(r).id),()=>String(v(i)+1).padStart(2,`0`),()=>v(E).has(v(r).id)?`−`:`+`,()=>!v(E).has(v(r).id)]),y(`click`,u,()=>ve(v(r).id)),y(`click`,U,()=>be(v(r).id,oe(v(r)))),t(n,o)}),g(qe),g(Ie);var Je=d(Ie,2),Ye=d(f(Je),2),Xe=d(f(Ye),6),Ze=d(f(Xe));Ze.textContent=`Array.from({length: rows}, () => Array<number>(cols).fill(0))`,e(),g(Xe),e(4),g(Ye),e(2),g(Je);var Qe=d(Je,2),Q=f(Qe),$=f(Q),$e=d(f($)),et=f($e,!0);g($e),g($),g(Q);var tt=d(Q,4),nt=f(tt),rt=f(nt),it=d(f(rt)),at=f(it,!0);g(it),g(rt);var ot=d(rt,2),st=f(ot),ct=f(st,!0);g(st),g(ot),g(nt),g(tt),g(Qe),e(2),g(Ne),g(Oe),g(q),g(W);var lt=d(W,2);let ut;var dt=f(lt,!0);g(lt),a((e,t,n,r)=>{l(we,O.length),l(De,e),l(Ue,`${v(R).length??``} of ${O.length??``} patterns `),Z.disabled=v(R).length===0,l(We,`${v(z)?`Collapse`:`Expand`} all`),h($,`aria-expanded`,t),l(et,n),h(tt,`hidden`,r),l(at,v(P)===`heap-helper`?`Copied ✓`:`Copy heap`),l(ct,D),ut=re(lt,1,`copy-status svelte-1yz9liq`,null,ut,{shown:v(F)!==``}),l(dt,v(F))},[()=>O.filter(e=>e.level===`Core`).length,()=>v(E).has(`heap-helper`),()=>v(E).has(`heap-helper`)?`−`:`+`,()=>!v(E).has(`heap-helper`)]),y(`click`,K,()=>window.print()),y(`click`,Me,e=>H(e,`heap-helper`)),ne(ze,()=>v(b),e=>r(b,e)),y(`click`,Z,ye),y(`click`,$,()=>ve(`heap-helper`)),y(`click`,it,()=>be(`heap-helper`,D)),t(c,U),ee()}c([`click`]);export{P as component,T as universal};