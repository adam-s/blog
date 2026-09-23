var e=`class Heap<T> {
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
}`,t=[{id:`hashing`,title:`Hash maps & sets`,group:`Scan & search`,level:`Core`,cue:`Duplicates, counts, grouping, or “have I seen the complement?”`,idea:`Remember earlier work so each lookup replaces another scan.`,know:`Use Set for membership and Map for counts or indices. Decide exactly what each key represents.`,invariant:`Before processing index i, the map contains only earlier indices.`,trap:`Look up the complement before inserting the current value, or you can reuse the same index. Check undefined, not truthiness: index 0 is valid.`,time:`O(n) expected`,space:`O(n)`,example:`twoSum([2, 7, 11, 15], 9) → [0, 1]`,code:`function twoSum(a: number[], target: number): number[] {
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
}`,visualizations:[{id:`trie-autocomplete`,title:`Trie Autocomplete`}]},{id:`heap`,title:`Heaps & priority queues`,group:`Choose & optimize`,level:`Core`,cue:`Repeated best item, top-k, merging sorted streams, or scheduling.`,idea:`Keep the next highest-priority item at the root without sorting everything.`,know:`A binary heap has O(1) peek and O(log n) push/pop. For kth largest, keep a min-heap of size k: its root is the smallest retained winner.`,invariant:`After each item, the heap holds the largest min(k, items seen) values.`,trap:`A heap’s array is not fully sorted. Define the comparator direction and tie-breaks. Confirm whether the interview environment supplies a priority queue.`,time:`O(n log(k + 1))`,space:`O(k)`,example:`kthLargest([3, 2, 1, 5, 6, 4], 2) → 5`,helper:e,code:`function kthLargest(a: number[], k: number): number {
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
}`,visualizations:[{id:`non-overlapping-intervals`,title:`Non-overlapping Intervals`},{id:`task-scheduler`,title:`Task Scheduler`}]},{id:`shortest-path`,title:`Weighted shortest paths`,group:`Choose & optimize`,level:`Next`,cue:`Cheapest route through a graph whose edges have different costs.`,idea:`Dijkstra expands the unsettled vertex with the smallest known distance.`,know:`Relax each edge: if distance[u] + weight improves distance[v], save it and enqueue it. Use BFS for equal weights; Dijkstra requires nonnegative weights.`,invariant:`A non-stale minimum-distance entry popped from the heap has its final shortest distance.`,trap:`Skip stale heap entries after an improvement. Negative edges require another algorithm, such as Bellman–Ford; unreachable vertices stay Infinity.`,time:`O(V + E log(E + 1)) with lazy heap entries`,space:`O(V + E) auxiliary`,example:`dijkstra([[[1, 4], [2, 1]], [], [[1, 2]]], 0) → [0, 3, 1]`,helper:e,code:`// Edge = [destination, nonnegative weight]; start is valid.
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
}`,visualizations:[]}],n=[{clue:`Find a pair or remember a count`,ids:[`hashing`,`two-pointers`]},{clue:`Work with a contiguous range`,ids:[`sliding-window`,`prefix-sums`]},{clue:`Search sorted data or a yes/no boundary`,ids:[`binary-search`]},{clue:`Explore connections or dependencies`,ids:[`bfs`,`graph-dfs`,`topological`]},{clue:`Choose the best next item`,ids:[`heap`,`greedy`]},{clue:`Explore choices or reuse subproblems`,ids:[`backtracking`,`dynamic-programming`]}],r=[`Scan & search`,`Traverse & connect`,`Choose & optimize`],i=[{title:`Numbers need a comparator`,code:`[...a].sort((x, y) => x - y)`,text:`Default sort compares strings; sort mutates its array. Copy if the input must stay unchanged.`},{title:`Use a queue head`,code:`const item = queue[head++];`,text:`Keep push for enqueue. Repeated shift can move every remaining element. A head index retains consumed slots, so this queue uses O(total enqueued) storage.`},{title:`Zero is a value`,code:`count.set(x, (count.get(x) ?? 0) + 1);`,text:`Check map.has(key) or value !== undefined. A stored index or count of 0 is not missing. Map and Set compare objects by identity.`},{title:`Each matrix row needs its own array`,code:`Array.from({length: rows}, () => Array<number>(cols).fill(0))`,text:`Using fill with a single inner array makes every row share the same object.`},{title:`Know your integer range`,code:`Number.MAX_SAFE_INTEGER // 2 ** 53 - 1`,text:`Use bigint if exact integer results can exceed this range. Number bitwise operations use 32-bit values. BigInt arithmetic has a cost that grows with its bit length.`},{title:`Be precise about strings and !`,code:`const characters = [...text];`,text:`This iterates Unicode code points; text[i] uses UTF-16 code units. Neither handles every visible grapheme. In templates, ! asserts an index already proved valid; it adds no runtime check.`}];function a(e){return[e.helper,e.code].filter(Boolean).join(`

`)}function o(e){let n=t.find(t=>t.visualizations.some(t=>t.id===e));return n&&{id:n.id,title:n.title}}export{t as a,r as i,e as n,a as o,o as r,i as s,n as t};