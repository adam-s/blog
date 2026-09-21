import{$ as e,C as t,F as n,G as r,H as i,I as a,K as o,O as s,S as c,T as l,U as u,V as d,X as f,Z as p,c as m,et as h,h as g,j as _,k as v,nt as y,o as b,q as ee,s as x,v as S,x as C,y as w,z as T}from"../chunks/BOxkOv4P.js";import"../chunks/xihTtKlq.js";var E=y({trailingSlash:()=>D}),D=`always`,O=`interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}
const users: User[] = [
  {id: 1, name: "Ana", age: 34, active: true},
  {id: 2, name: "Ben", age: 25, active: false},
  {id: 3, name: "Cara", age: 41, active: true},
  {id: 4, name: "Dan", age: 25, active: false},
];
const settings: Record<string, string | number | undefined> = {
  theme: "dark", fontSize: 14, language: "en", timezone: undefined,
};
interface Company {
  name: string;
  address: {city: string; zip: string};
  teams: {id: number; name: string; memberIds: number[]}[];
}
const company: Company = {
  name: "Acme",
  address: {city: "Boston", zip: "02101"},
  teams: [
    {id: 1, name: "Frontend", memberIds: [1, 2]},
    {id: 2, name: "Backend", memberIds: [3, 4]},
  ],
};`,k=[{id:`read`,title:`Read the shape`,tools:`Object.keys / values / entries · ?. · ??`,why:`Start by locating the data and deciding what can be missing. Every later transformation depends on this.`,steps:[`Identify whether the input is an array, object, or nested combination.`,`Read the needed property or turn an object into keys, values, or pairs.`,`Guard a possibly missing array item with ?. and choose a fallback with ?? only if needed.`],remember:`Object.entries gives [key, value] pairs. Optional chaining handles null or undefined, not every possible runtime error.`,trap:`An object containing timezone: undefined still has that key. Object.keys checks own enumerable string keys; an “empty” result does not describe a Map or Set.`,exercise:`Read team index 9 safely and test whether settings is empty.`,expected:`undefined; false`,refs:[12,14,28],cost:`Object views: O(k) time and space. Property access: O(1).`,code:`const keys = Object.keys(settings);
const values = Object.values(settings);
const pairs = Object.entries(settings);
const isEmpty = Object.keys(settings).length === 0;

const city = company.address.city;
const secondTeamName = company.teams[1]?.name;
const tenthTeamName = company.teams[9]?.name;`,checks:`expect(keys, ['theme', 'fontSize', 'language', 'timezone']);
expect(values, ['dark', 14, 'en', undefined]);
expect(pairs.length, 4); expect(isEmpty, false);
expect(city, 'Boston'); expect(secondTeamName, 'Backend');
expect(tenthTeamName, undefined);`},{id:`loop`,title:`Write the loop first`,tools:`for…of · entries() · indexed for · break · for…in`,why:`A loop makes the accumulator, condition, and stopping rule explicit. Array methods are easier once you can write their loop version.`,steps:[`Initialize the result with its type: an array, a counter, or Item | undefined.`,`Iterate the items with for…of; use entries() when you also need the index.`,`Update the result, and break as soon as a first-match task is solved.`],remember:`for…of gives values; for…in gives string keys and may include inherited enumerable properties. Object.entries is the usual choice for own object pairs.`,trap:`Do not use for…in to get array items. An indexed lookup can be undefined; guard it. A first-match result must allow “not found.”`,exercise:`Find the oldest user and the first inactive user with loops.`,expected:`Cara; Ben`,refs:[13,21,23,24,25,26,27],cost:`O(n) time for a scan; O(1) extra space unless collecting results.`,code:`const loudNames: string[] = [];
for (const user of users) {
  loudNames.push(user.name.toUpperCase());
}

let oldestLoop: User | undefined;
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  if (user && (!oldestLoop || user.age > oldestLoop.age)) {
    oldestLoop = user;
  }
}

let firstInactive: User | undefined;
for (const user of users) {
  if (!user.active) {
    firstInactive = user;
    break;
  }
}

for (const [index, user] of users.entries()) {
  console.log(index, user.name);
}
for (const [key, value] of Object.entries(settings)) {
  if (value !== undefined) console.log(key, value);
}
const settingLines: string[] = [];
for (const [key, value] of Object.entries(settings)) {
  settingLines.push(key + ": " + String(value));
}
const keyList: string[] = [];
for (const key in settings) keyList.push(key);`,checks:`expect(loudNames, ['ANA', 'BEN', 'CARA', 'DAN']);
expect(oldestLoop?.name, 'Cara'); expect(firstInactive?.name, 'Ben');
expect(settingLines, ['theme: dark', 'fontSize: 14', 'language: en', 'timezone: undefined']);
expect(keyList, ['theme', 'fontSize', 'language', 'timezone']);`},{id:`select`,title:`Choose the output, then the method`,tools:`map · filter · find · some · every`,why:`Choose by the return shape: transformed array, retained items, one item, or a boolean.`,steps:[`Write down the output type before choosing a method.`,`Use map for one output per item, filter for a subset, find for one match, or some/every for a boolean.`,`Write the smallest callback that returns exactly what that method needs.`],remember:`map returns a new value; filter/find/some/every return a test from their callback. filter preserves the original item references.`,trap:`An arrow callback with { braces } needs an explicit return. On an empty array: find → undefined, some → false, every → true.`,exercise:`Get the names, active users, first user under 30, and whether everyone is active.`,expected:`[Ana, Ben, Cara, Dan]; [Ana, Cara]; Ben; false`,refs:[1,2,3,4,22],cost:`O(n) worst-case time; map/filter allocate O(n); find/some/every use O(1) extra space.`,code:`const names = users.map(u => u.name);
const activeUsers = users.filter(u => u.active);
const firstYoung = users.find(u => u.age < 30);
const anyActive = users.some(u => u.active);
const allActive = users.every(u => u.active);

// The same filtering move, written as a loop.
const inactiveLoop: User[] = [];
for (const user of users) {
  if (!user.active) inactiveLoop.push(user);
}`,checks:`expect(names, ['Ana', 'Ben', 'Cara', 'Dan']);
expect(activeUsers.map(u => u.name), ['Ana', 'Cara']);
expect(firstYoung?.name, 'Ben'); expect(anyActive, true); expect(allActive, false);
expect(inactiveLoop.map(u => u.name), ['Ben', 'Dan']);
expect([].some(() => true), false); expect([].every(() => false), true);`},{id:`aggregate`,title:`Accumulate, then group`,tools:`reduce · typed accumulator · bucket initialization`,why:`Grouping is the same accumulation pattern as a sum, with a collection as the result.`,steps:[`Choose the accumulator type and give reduce an initial value.`,`For a total, add one value; for a group, calculate its key and obtain or create its bucket.`,`Update the accumulator and return it on every callback call.`],remember:`Use 0 for sums and {} or a Map for groups. A local accumulator created for this result can be mutated without mutating the input.`,trap:`reduce without an initial value throws on empty input. Object keys are strings at runtime, even for numeric ages. Prefer Map for arbitrary keys such as user-supplied names.`,exercise:`Calculate total age, then group users by age.`,expected:`125; age 25 contains Ben and Dan`,refs:[5,6],cost:`O(n) time; O(1) space for the sum, O(n) for grouped references.`,code:`const totalAge = users.reduce((sum, u) => sum + u.age, 0);

const byAge = users.reduce<Record<number, User[]>>((acc, u) => {
  const bucket = acc[u.age] ?? [];
  bucket.push(u);
  acc[u.age] = bucket;
  return acc;
}, {});`,checks:`expect(totalAge, 125); expect(byAge[25]?.map(u => u.name), ['Ben', 'Dan']);
expect(byAge[34]?.[0] === users[0], true);
expect(([]).reduce((sum, u) => sum + u.age, 0), 0);`},{id:`order`,title:`Order and deduplicate`,tools:`sort · numeric comparator · localeCompare · Set`,why:`These often finish a transformation. First decide whether you are sorting objects or derived values.`,steps:[`Copy the input array before sort if you need to preserve it.`,`Choose the comparison: numeric subtraction or localeCompare for strings.`,`For primitive uniqueness, extract the values, create a Set, then spread it back to an array.`],remember:`A comparator returns negative, zero, or positive. Set keeps the first insertion order.`,trap:`sort mutates. Default sorting compares strings. Set deduplicates objects by reference, so two separate {id: 1} objects remain two entries.`,exercise:`Sort users by age, then get unique ages in first-seen order.`,expected:`[Ben, Dan, Ana, Cara]; [34, 25, 41]`,refs:[7,8],cost:`Typically O(n log n) sorting comparisons; O(n) copy space. Set dedupe: expected O(n) time and space.`,code:`const byAgeAsc = [...users].sort((a, b) => a.age - b.age);
const byName = [...users].sort((a, b) => a.name.localeCompare(b.name));
const ages = users.map(u => u.age);
const uniqueAges = [...new Set(ages)];`,checks:`expect(byAgeAsc.map(u => u.name), ['Ben', 'Dan', 'Ana', 'Cara']);
expect(byName.map(u => u.name), ['Ana', 'Ben', 'Cara', 'Dan']);
expect(uniqueAges, [34, 25, 41]); expect(users.map(u => u.id), [1, 2, 3, 4]);`},{id:`array-updates`,title:`Implement the array update trio`,tools:`add: spread · remove: filter · update: map + spread`,why:`These three moves are the foundation of immutable UI state updates.`,steps:[`Identify the operation and the stable id of the target item.`,`Add with [...items, newItem], remove with filter, or update with map.`,`For an update, spread-patch only the matching item and return every other item unchanged.`],remember:`A new array does not require new copies of every item. Keep unchanged references; create a new object only for the edited item.`,trap:`Mutating u.active inside map still changes the original object. Ids should be unique; otherwise this map updates every match.`,exercise:`Add Eve, remove Ben, and activate Ben as three independent results.`,expected:`5 items; ids [1, 3, 4]; Ben active in the new result only`,refs:[9,10,11],cost:`O(n) time and new-array space for each operation.`,code:`const withEve = [
  ...users,
  {id: 5, name: "Eve", age: 30, active: true},
];
const withoutBen = users.filter(u => u.id !== 2);
const benActivated = users.map(u =>
  u.id === 2 ? {...u, active: true} : u
);`,checks:`expect(withEve.length, 5); expect(withoutBen.map(u => u.id), [1, 3, 4]);
expect(benActivated[1]?.active, true); expect(users[1]?.active, false);
expect(benActivated[0] === users[0], true); expect(benActivated[1] === users[1], false);`},{id:`objects`,title:`Rebuild objects and make a lookup`,tools:`spread · rest · entries → map/filter → fromEntries`,why:`Use the same transform/filter ideas on key-value pairs. Build the id lookup now because the later join depends on it.`,steps:[`For a patch, spread the object then write the override; for removal, destructure the unwanted key and keep ...rest.`,`For a transformation, get entries, map or filter the pairs, then call Object.fromEntries.`,`To build an index, map each user to [id, user], then call Object.fromEntries.`],remember:`The pair is the unit of object transformation. Keep the key when changing a value. Explicitly test value !== undefined to preserve 0, false, and empty strings.`,trap:`Later properties win. Setting a value to undefined does not remove its key. Duplicate ids in fromEntries keep the last value; a missing lookup still needs a guard.`,exercise:`Set fontSize to 18, remove timezone, drop undefined values, and index users by id.`,expected:`18; timezone key absent; defined settings; usersById[3] is Cara`,refs:[15,16,17,18,19],cost:`O(k) time/space for rebuilding k properties; O(n) to build the user index, then expected O(1) per lookup.`,code:`const bigger = {...settings, fontSize: 18};
const {timezone, ...withoutTimezone} = settings;

const stringified = Object.fromEntries(
  Object.entries(settings).map(([key, value]) => [key, String(value)])
);
const defined = Object.fromEntries(
  Object.entries(settings).filter(([, value]) => value !== undefined)
);
const usersById = Object.fromEntries(users.map(u => [u.id, u]));
const cara = usersById[3];`,checks:`expect(bigger.fontSize, 18); expect(settings.fontSize, 14);
expect(Object.hasOwn(withoutTimezone, 'timezone'), false); expect(timezone, undefined);
expect(stringified, {theme: 'dark', fontSize: '14', language: 'en', timezone: 'undefined'});
expect(defined, {theme: 'dark', fontSize: 14, language: 'en'});
expect(cara?.name, 'Cara'); expect(usersById[99], undefined);`},{id:`nested-copy`,title:`Copy the path to a nested change`,tools:`nested spread · shallow copy · structuredClone`,why:`A nested update is several flat updates composed along one path.`,steps:[`Locate the changed leaf, such as company.address.city.`,`Write the replacement from the inside out: copy address and override city, then copy company and replace address.`,`Check that changed ancestors are new references and untouched branches can still be shared.`],remember:`Spread copies one level. For cloneable data, structuredClone creates a deep copy that you can then mutate independently.`,trap:`A top-level spread still shares address and teams. structuredClone copies the whole graph, loses useful sharing, and cannot clone values such as functions or DOM nodes.`,exercise:`Move the company to Denver without changing the original Boston address.`,expected:`moved !== company; moved.address !== company.address; moved.teams === company.teams`,refs:[29,30,34],cost:`Path copying costs the size of each copied container. Deep cloning costs O(total cloneable data) time and space.`,code:`const moved = {
  ...company,
  address: {...company.address, city: "Denver"},
};

const shallow = {...company};
const sharesAddress = shallow.address === company.address; // true

const clone = structuredClone(company);
clone.address.city = "Austin";`,checks:`expect(moved.address.city, 'Denver'); expect(company.address.city, 'Boston');
expect(moved !== company, true); expect(moved.address !== company.address, true);
expect(moved.teams === company.teams, true); expect(sharesAddress, true);
expect(clone.address.city, 'Austin'); expect(clone.teams === company.teams, false);`},{id:`nested-arrays`,title:`Compose the trio inside nested arrays`,tools:`outer spread → map target → inner spread/filter`,why:`No new primitive is needed: reuse the array trio inside the copied object path.`,steps:[`Write the outer {...company, teams: …} shell, then map the teams to locate the target id.`,`Return nonmatching teams unchanged. For the match, spread the team and replace the changed property.`,`For memberIds, add with a spread or remove with filter; then verify both values and reference identity.`],remember:`For company → teams → team → memberIds, copy every container on that path. An unchanged team should keep its reference.`,trap:`Copying the team but pushing into its existing memberIds still mutates the original. Specify what should happen when a target id is missing or a member is already present.`,exercise:`Rename Backend to Platform; add member 5 to Frontend; remove member 3 from Backend.`,expected:`Platform; [1, 2, 5]; [4] — each in its own result`,refs:[31,32,33],cost:`O(t) for a rename; O(t + m) for a member edit, copying t team references and m member ids.`,code:`const renamed = {
  ...company,
  teams: company.teams.map(t =>
    t.id === 2 ? {...t, name: "Platform"} : t
  ),
};
const withNewMember = {
  ...company,
  teams: company.teams.map(t =>
    t.id === 1 ? {...t, memberIds: [...t.memberIds, 5]} : t
  ),
};
const withoutMember3 = {
  ...company,
  teams: company.teams.map(t =>
    t.id === 2
      ? {...t, memberIds: t.memberIds.filter(id => id !== 3)}
      : t
  ),
};`,checks:`expect(renamed.teams[1]?.name, 'Platform'); expect(company.teams[1]?.name, 'Backend');
expect(withNewMember.teams[0]?.memberIds, [1, 2, 5]);
expect(withoutMember3.teams[1]?.memberIds, [4]);
expect(company.teams[0]?.memberIds, [1, 2]); expect(company.teams[1]?.memberIds, [3, 4]);
expect(renamed.teams[0] === company.teams[0], true);
expect(withNewMember.teams[1] === company.teams[1], true);
expect(withNewMember.teams[0]?.memberIds === company.teams[0]?.memberIds, false);`},{id:`compose`,title:`Join data, then write the pipeline`,tools:`lookup → flatMap · filter → map → sort`,why:`Finish by composing the earlier operations in dependency order. Keep each intermediate shape clear.`,steps:[`Build usersById before resolving member ids. Read the selected team with ?. and default missing memberIds to [].`,`flatMap each id to [user] when found or [] when missing; this both joins and removes missing partners.`,`For active names: filter while active is still available, map to name, then sort the resulting strings.`],remember:`Pipeline order follows the data you still need. After mapping users to names, you no longer have the active property for filtering.`,trap:`A find inside every member loop costs O(mn); a lookup built once makes the join expected O(n + m). Sorting the new mapped array is safe for the original users array.`,exercise:`Resolve Frontend’s members and return alphabetized active names.`,expected:`[Ana, Ben]; [Ana, Cara]`,refs:[35,20],cost:`Join: expected O(n + m) time including the index. Active-name pipeline: typically O(n + a log a) comparisons, O(n) extra space.`,code:`// Build this first — the join depends on it (stage 07).
const usersById = Object.fromEntries(users.map(u => [u.id, u]));

const frontendMembers = (company.teams[0]?.memberIds ?? []).flatMap(id => {
  const user = usersById[id];
  return user ? [user] : [];
});

const activeNames = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort((a, b) => a.localeCompare(b));`,checks:`expect(frontendMembers.map(u => u.name), ['Ana', 'Ben']);
expect(activeNames, ['Ana', 'Cara']);
expect([1, 99].flatMap(id => { const u = usersById[id]; return u ? [u.name] : []; }), ['Ana']);
expect((company.teams[9]?.memberIds ?? []).flatMap(id => usersById[id] ? [usersById[id]] : []), []);`}];function te(e){return`${O}\n\n${e.code}\n\nconsole.log({${{read:`keys, values, pairs, isEmpty, city, secondTeamName, tenthTeamName`,loop:`loudNames, oldestLoop, firstInactive, settingLines, keyList`,select:`names, activeUsers, firstYoung, anyActive, allActive, inactiveLoop`,aggregate:`totalAge, byAge`,order:`byAgeAsc, byName, ages, uniqueAges`,"array-updates":`withEve, withoutBen, benActivated`,objects:`bigger, withoutTimezone, stringified, defined, usersById, cara`,"nested-copy":`moved, sharesAddress, clone`,"nested-arrays":`renamed, withNewMember, withoutMember3`,compose:`frontendMembers, activeNames`}[e.id]}});`}var A=l(`<meta name="description" content="Your 35 TypeScript data manipulation examples in implementation order: ten stages, coding steps, pitfalls, and runnable examples."/>`),j=l(`<a class="svelte-vvz4h6"><span class="svelte-vvz4h6"> </span> </a>`),M=l(`<div class="empty svelte-vvz4h6"><p>No matching stages.</p><button class="svelte-vvz4h6">Clear search</button></div>`),ne=l(`<li class="svelte-vvz4h6"> </li>`),re=l(`<article class="svelte-vvz4h6"><div class="stage-heading svelte-vvz4h6"><span class="number svelte-vvz4h6"> </span><div class="svelte-vvz4h6"><p class="eyebrow svelte-vvz4h6"></p><h2 class="svelte-vvz4h6"> </h2><p class="tools svelte-vvz4h6"> </p></div></div> <p class="why svelte-vvz4h6"> </p> <h3 class="svelte-vvz4h6">Write it in this order</h3> <ol class="svelte-vvz4h6"></ol> <dl class="svelte-vvz4h6"><div class="svelte-vvz4h6"><dt class="svelte-vvz4h6">Remember</dt><dd class="svelte-vvz4h6"> </dd></div><div class="svelte-vvz4h6"><dt class="watch svelte-vvz4h6">Watch for</dt><dd class="svelte-vvz4h6"> </dd></div></dl> <div class="practice svelte-vvz4h6"><span class="eyebrow svelte-vvz4h6">TRY FROM MEMORY</span><p class="svelte-vvz4h6"> </p><p class="expected svelte-vvz4h6"> </p></div> <details class="example-code svelte-vvz4h6"><summary class="svelte-vvz4h6">TypeScript implementation <span class="svelte-vvz4h6">Open code +</span></summary> <div class="code-head svelte-vvz4h6"><span>Includes sample data when copied</span><button class="svelte-vvz4h6">Copy runnable example</button></div> <pre role="region" tabindex="0" class="svelte-vvz4h6"><code class="svelte-vvz4h6"> </code></pre></details> <div class="stage-footer svelte-vvz4h6"><p class="svelte-vvz4h6"> </p><span class="svelte-vvz4h6"> </span></div></article>`),N=l(`<div class="status svelte-vvz4h6" role="status"> <button aria-label="Dismiss clipboard message" class="svelte-vvz4h6">×</button></div>`),P=l(`<div class="sheet svelte-vvz4h6"><header class="svelte-vvz4h6"><a class="brand svelte-vvz4h6" href="../" data-sveltekit-reload=""><span class="svelte-vvz4h6">a.</span> algoviz <small class="svelte-vvz4h6">/ study sheet</small></a> <nav aria-label="Reference navigation" class="svelte-vvz4h6"><a href="./patterns/" class="svelte-vvz4h6">Algorithm patterns ↗</a><button class="svelte-vvz4h6">Print essentials ↗</button></nav></header> <main><section class="hero svelte-vvz4h6"><p class="eyebrow svelte-vvz4h6"><span class="ts svelte-vvz4h6">TS</span> DATA MANIPULATION / IMPLEMENTATION ORDER</p> <h1 id="top" class="svelte-vvz4h6">Build it in<br/><span class="svelte-vvz4h6">the right order.</span></h1> <p class="intro svelte-vvz4h6">Your TypeScript study sheet, arranged by what you need first. Learn the small moves, then combine them into nested updates and joins.</p> <div class="meta svelte-vvz4h6"><span><strong class="svelte-vvz4h6">35</strong> original examples</span><span><strong class="svelte-vvz4h6">10</strong> stages</span><span>Practice order + coding steps</span></div></section> <div class="layout svelte-vvz4h6"><aside class="svelte-vvz4h6"><nav aria-label="Implementation stages" class="svelte-vvz4h6"><p class="eyebrow svelte-vvz4h6">BUILD IN THIS ORDER</p> <!> <p class="aside-note svelte-vvz4h6">Numbers under each stage point back to the examples in your pasted sheet.</p> <a class="more svelte-vvz4h6" href="./patterns/">Then: algorithm patterns ↗</a></nav></aside> <div class="content svelte-vvz4h6"><section class="rule svelte-vvz4h6"><p class="eyebrow svelte-vvz4h6">THE REPEATABLE ORDER</p> <h2 class="svelte-vvz4h6">Shape → output → operation → callback → check</h2> <p class="svelte-vvz4h6">Read the input shape. Name the result type. Pick the method. Write its callback. Verify the values, missing-data behavior, and what stayed unchanged.</p></section> <section class="chooser svelte-vvz4h6" aria-labelledby="choose-title"><h2 id="choose-title" class="svelte-vvz4h6">Choose by the result you need</h2> <div class="choices svelte-vvz4h6"><div class="svelte-vvz4h6"><span class="svelte-vvz4h6">One value per item</span><code class="svelte-vvz4h6">map</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A subset of items</span><code class="svelte-vvz4h6">filter</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">The first match</span><code class="svelte-vvz4h6">find</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A yes / no answer</span><code class="svelte-vvz4h6">some / every</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A total or groups</span><code class="svelte-vvz4h6">reduce</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">Zero or more per item</span><code class="svelte-vvz4h6">flatMap</code></div></div></section> <details class="data svelte-vvz4h6"><summary class="svelte-vvz4h6">The shared data: users, settings, company <span class="svelte-vvz4h6">View TypeScript +</span></summary> <p class="svelte-vvz4h6">Each copy button includes this data, so the example runs on its own.</p> <div class="code-head svelte-vvz4h6"><span>sample-data.ts</span><button class="svelte-vvz4h6">Copy data</button></div> <pre role="region" tabindex="0" aria-label="Shared TypeScript sample data" class="svelte-vvz4h6"><code class="svelte-vvz4h6"> </code></pre></details> <div class="search-row svelte-vvz4h6"><label class="svelte-vvz4h6"><span class="sr-only svelte-vvz4h6">Search implementation stages</span><input type="search" placeholder="Find a method or task: map, nested, join…" class="svelte-vvz4h6"/></label><span aria-live="polite" class="svelte-vvz4h6"> </span></div> <!> <!> <section class="finish svelte-vvz4h6"><p class="eyebrow svelte-vvz4h6">THE FINAL CHECK</p> <h2 class="svelte-vvz4h6">Can you combine the moves without looking?</h2> <p class="svelte-vvz4h6">Rename a team, add a member, resolve its member ids to users, keep only active users, and return their alphabetized names. First name the intermediate shape after each step. Then implement it.</p> <p class="footnote svelte-vvz4h6">n = users; k = object keys; t = teams; m = member ids; a = active users. String comparisons also depend on string length. Hash lookups use expected-time shorthand; sort performance depends on the engine.</p> <a href="./patterns/" class="svelte-vvz4h6">Continue to the algorithm pattern reference →</a></section> <footer class="svelte-vvz4h6"><span>TypeScript · based on your pasted study sheet</span><a href="#top" class="svelte-vvz4h6">Back to top ↑</a></footer></div></div></main></div> <!>`,1);function F(s,l){p(l,!0);let y=o(``),E=o(``),D=ee(()=>new Set(k.filter(e=>`${e.title} ${e.tools} ${e.remember} ${e.steps.join(` `)}`.toLowerCase().includes(_(y).trim().toLowerCase())).map(e=>e.id)));async function F(e){try{await navigator.clipboard.writeText(e),r(E,`Copied TypeScript with the sample data. Paste into a .ts file and run.`)}catch{r(E,`Clipboard unavailable. Select the code to copy it.`)}}var I=P();g(`vvz4h6`,e=>{var r=A();n(()=>{T.title=`TypeScript data manipulation cheat sheet — algoviz`}),t(e,r)});var L=i(I),R=d(L),z=u(d(R),2),B=u(d(z));h(z),h(R);var V=u(R,2),H=u(d(V),2),U=d(H),W=d(U),G=u(d(W),2);S(G,17,()=>k,w,(e,n,i)=>{var o=j(),s=d(o),l=d(s,!0);h(s);var f=u(s,1,!0);h(o),a(e=>{m(o,`href`,`#${_(n).id}`),c(l,e),c(f,_(n).title)},[()=>String(i+1).padStart(2,`0`)]),v(`click`,o,()=>r(y,``)),t(e,o)}),e(4),h(W),h(U);var K=u(U,2),q=u(d(K),4),J=u(d(q),4),Y=u(d(J));h(J);var X=u(J,2),Z=d(X),ie=d(Z,!0);h(Z),h(X),h(q);var Q=u(q,2),$=d(Q),ae=u(d($));x(ae),h($);var oe=u($),se=d(oe);h(oe),h(Q);var ce=u(Q,2),le=e=>{var n=M(),i=u(d(n));h(n),v(`click`,i,()=>r(y,``)),t(e,n)};C(ce,e=>{_(D).size===0&&e(le)});var ue=u(ce,2);S(ue,17,()=>k,w,(e,n,r)=>{var i=re(),o=d(i),s=d(o),l=d(s,!0);h(s);var f=u(s),p=d(f);p.textContent=r<3?`FOUNDATIONS`:r<7?`SINGLE-LEVEL OPERATIONS`:`COMPOSE THE MOVES`;var g=u(p),y=d(g,!0);h(g);var b=u(g),ee=d(b,!0);h(b),h(f),h(o);var x=u(o,2),C=d(x,!0);h(x);var T=u(x,4);S(T,21,()=>_(n).steps,w,(e,n)=>{var r=ne(),i=d(r,!0);h(r),a(()=>c(i,_(n))),t(e,r)}),h(T);var E=u(T,2),O=d(E),k=u(d(O)),A=d(k,!0);h(k),h(O);var j=u(O),M=u(d(j)),N=d(M,!0);h(M),h(j),h(E);var P=u(E,2),I=u(d(P)),L=d(I,!0);h(I);var R=u(I),z=d(R);h(R),h(P);var B=u(P,2),V=u(d(B),2),H=u(d(V));h(V);var U=u(V,2),W=d(U),G=d(W,!0);h(W),h(U),h(B);var K=u(B,2),q=d(K),J=d(q,!0);h(q);var Y=u(q),X=d(Y);h(Y),h(K),h(i),a((e,t,r)=>{m(i,`id`,_(n).id),m(i,`hidden`,e),c(l,t),c(y,_(n).title),c(ee,_(n).tools),c(C,_(n).why),c(A,_(n).remember),c(N,_(n).trap),c(L,_(n).exercise),c(z,`Check: ${_(n).expected??``}`),m(H,`aria-label`,`Copy ${_(n).title} implementation`),m(U,`aria-label`,`${_(n).title} TypeScript example`),c(G,_(n).code),c(J,_(n).cost),c(X,`Source examples ${r??``}`)},[()=>!_(D).has(_(n).id),()=>String(r+1).padStart(2,`0`),()=>_(n).refs.map(e=>`#${e}`).join(`, `)]),v(`click`,H,()=>F(te(_(n)))),t(e,i)}),e(4),h(K),h(H),h(V),h(L);var de=u(L,2),fe=e=>{var n=N(),i=d(n,!0),o=u(i);h(n),a(()=>c(i,_(E))),v(`click`,o,()=>r(E,``)),t(e,n)};C(de,e=>{_(E)&&e(fe)}),a(()=>{c(ie,O),c(se,`${_(D).size??``} / 10 stages`)}),v(`click`,B,()=>window.print()),v(`click`,Y,()=>F(O)),b(ae,()=>_(y),e=>r(y,e)),t(s,I),f()}s([`click`]);export{F as component,E as universal};