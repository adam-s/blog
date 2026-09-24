import{A as e,C as t,D as n,E as r,G as i,H as a,I as o,J as s,N as c,O as l,P as ee,Q as u,R as d,V as f,Y as p,c as m,d as h,et as g,ft as _,gt as v,n as y,nt as b,ot as te,pt as x,q as S,st as C,u as w,w as ne,y as re}from"../chunks/Cej6ksnW.js";import{t as T}from"../chunks/Byeaq_nx.js";import"../chunks/xihTtKlq.js";import"../chunks/BXPlvs66.js";import{i as E,n as ie,r as ae,t as D}from"../chunks/DK_ik49Y.js";var O=v({trailingSlash:()=>k}),k=`always`,A=`interface User {
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
};`,oe=[`Foundations`,`Single-level operations`,`Compose the moves`],j=[{id:`read`,group:`Foundations`,title:`Read the shape`,tools:`Object.keys / values / entries · ?. · ??`,why:`Start by locating the data and deciding what can be missing. Every later transformation depends on this.`,steps:[`Identify whether the input is an array, object, or nested combination.`,`Read the needed property or turn an object into keys, values, or pairs.`,`Guard a possibly missing array item with ?. and choose a fallback with ?? only if needed.`],remember:`Object.entries gives [key, value] pairs. Optional chaining handles null or undefined, not every possible runtime error.`,trap:`An object containing timezone: undefined still has that key. Object.keys checks own enumerable string keys; an “empty” result does not describe a Map or Set.`,exercise:`Read team index 9 safely and test whether settings is empty.`,expected:`undefined; false`,refs:[12,14,28],cost:`Object views: O(k) time and space. Property access: O(1).`,code:`const keys = Object.keys(settings);
const values = Object.values(settings);
const pairs = Object.entries(settings);
const isEmpty = Object.keys(settings).length === 0;

const city = company.address.city;
const secondTeamName = company.teams[1]?.name;
const tenthTeamName = company.teams[9]?.name;`,checks:`expect(keys, ['theme', 'fontSize', 'language', 'timezone']);
expect(values, ['dark', 14, 'en', undefined]);
expect(pairs.length, 4); expect(isEmpty, false);
expect(city, 'Boston'); expect(secondTeamName, 'Backend');
expect(tenthTeamName, undefined);`},{id:`loop`,group:`Foundations`,title:`Write the loop first`,tools:`for…of · entries() · indexed for · break · for…in`,why:`A loop makes the accumulator, condition, and stopping rule explicit. Array methods are easier once you can write their loop version.`,steps:[`Initialize the result with its type: an array, a counter, or Item | undefined.`,`Iterate the items with for…of; use entries() when you also need the index.`,`Update the result, and break as soon as a first-match task is solved.`],remember:`for…of gives values; for…in gives string keys and may include inherited enumerable properties. Object.entries is the usual choice for own object pairs.`,trap:`Do not use for…in to get array items. An indexed lookup can be undefined; guard it. A first-match result must allow “not found.”`,exercise:`Find the oldest user and the first inactive user with loops.`,expected:`Cara; Ben`,refs:[13,21,23,24,25,26,27],cost:`O(n) time for a scan; O(1) extra space unless collecting results.`,code:`const loudNames: string[] = [];
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
expect(keyList, ['theme', 'fontSize', 'language', 'timezone']);`},{id:`select`,group:`Foundations`,title:`Choose the output, then the method`,tools:`map · filter · find · some · every`,why:`Choose by the return shape: transformed array, retained items, one item, or a boolean.`,steps:[`Write down the output type before choosing a method.`,`Use map for one output per item, filter for a subset, find for one match, or some/every for a boolean.`,`Write the smallest callback that returns exactly what that method needs.`],remember:`map returns a new value; filter/find/some/every return a test from their callback. filter preserves the original item references.`,trap:`An arrow callback with { braces } needs an explicit return. On an empty array: find → undefined, some → false, every → true.`,exercise:`Get the names, active users, first user under 30, and whether everyone is active.`,expected:`[Ana, Ben, Cara, Dan]; [Ana, Cara]; Ben; false`,refs:[1,2,3,4,22],cost:`O(n) worst-case time; map/filter allocate O(n); find/some/every use O(1) extra space.`,code:`const names = users.map(u => u.name);
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
expect([].some(() => true), false); expect([].every(() => false), true);`},{id:`aggregate`,group:`Single-level operations`,title:`Accumulate, then group`,tools:`reduce · typed accumulator · bucket initialization`,why:`Grouping is the same accumulation pattern as a sum, with a collection as the result.`,steps:[`Choose the accumulator type and give reduce an initial value.`,`For a total, add one value; for a group, calculate its key and obtain or create its bucket.`,`Update the accumulator and return it on every callback call.`],remember:`Use 0 for sums and {} or a Map for groups. A local accumulator created for this result can be mutated without mutating the input.`,trap:`reduce without an initial value throws on empty input. Object keys are strings at runtime, even for numeric ages. Prefer Map for arbitrary keys such as user-supplied names.`,exercise:`Calculate total age, then group users by age.`,expected:`125; age 25 contains Ben and Dan`,refs:[5,6],cost:`O(n) time; O(1) space for the sum, O(n) for grouped references.`,code:`const totalAge = users.reduce((sum, u) => sum + u.age, 0);

const byAge = users.reduce<Record<number, User[]>>((acc, u) => {
  const bucket = acc[u.age] ?? [];
  bucket.push(u);
  acc[u.age] = bucket;
  return acc;
}, {});`,checks:`expect(totalAge, 125); expect(byAge[25]?.map(u => u.name), ['Ben', 'Dan']);
expect(byAge[34]?.[0] === users[0], true);
expect(([]).reduce((sum, u) => sum + u.age, 0), 0);`},{id:`order`,group:`Single-level operations`,title:`Order and deduplicate`,tools:`sort · numeric comparator · localeCompare · Set`,why:`These often finish a transformation. First decide whether you are sorting objects or derived values.`,steps:[`Copy the input array before sort if you need to preserve it.`,`Choose the comparison: numeric subtraction or localeCompare for strings.`,`For primitive uniqueness, extract the values, create a Set, then spread it back to an array.`],remember:`A comparator returns negative, zero, or positive. Set keeps the first insertion order.`,trap:`sort mutates. Default sorting compares strings. Set deduplicates objects by reference, so two separate {id: 1} objects remain two entries.`,exercise:`Sort users by age, then get unique ages in first-seen order.`,expected:`[Ben, Dan, Ana, Cara]; [34, 25, 41]`,refs:[7,8],cost:`Typically O(n log n) sorting comparisons; O(n) copy space. Set dedupe: expected O(n) time and space.`,code:`const byAgeAsc = [...users].sort((a, b) => a.age - b.age);
const byName = [...users].sort((a, b) => a.name.localeCompare(b.name));
const ages = users.map(u => u.age);
const uniqueAges = [...new Set(ages)];`,checks:`expect(byAgeAsc.map(u => u.name), ['Ben', 'Dan', 'Ana', 'Cara']);
expect(byName.map(u => u.name), ['Ana', 'Ben', 'Cara', 'Dan']);
expect(uniqueAges, [34, 25, 41]); expect(users.map(u => u.id), [1, 2, 3, 4]);`},{id:`array-updates`,group:`Single-level operations`,title:`Implement the array update trio`,tools:`add: spread · remove: filter · update: map + spread`,why:`These three moves are the foundation of immutable UI state updates.`,steps:[`Identify the operation and the stable id of the target item.`,`Add with [...items, newItem], remove with filter, or update with map.`,`For an update, spread-patch only the matching item and return every other item unchanged.`],remember:`A new array does not require new copies of every item. Keep unchanged references; create a new object only for the edited item.`,trap:`Mutating u.active inside map still changes the original object. Ids should be unique; otherwise this map updates every match.`,exercise:`Add Eve, remove Ben, and activate Ben as three independent results.`,expected:`5 items; ids [1, 3, 4]; Ben active in the new result only`,refs:[9,10,11],cost:`O(n) time and new-array space for each operation.`,code:`const withEve = [
  ...users,
  {id: 5, name: "Eve", age: 30, active: true},
];
const withoutBen = users.filter(u => u.id !== 2);
const benActivated = users.map(u =>
  u.id === 2 ? {...u, active: true} : u
);`,checks:`expect(withEve.length, 5); expect(withoutBen.map(u => u.id), [1, 3, 4]);
expect(benActivated[1]?.active, true); expect(users[1]?.active, false);
expect(benActivated[0] === users[0], true); expect(benActivated[1] === users[1], false);`},{id:`objects`,group:`Single-level operations`,title:`Rebuild objects and make a lookup`,tools:`spread · rest · entries → map/filter → fromEntries`,why:`Use the same transform/filter ideas on key-value pairs. Build the id lookup now because the later join depends on it.`,steps:[`For a patch, spread the object then write the override; for removal, destructure the unwanted key and keep ...rest.`,`For a transformation, get entries, map or filter the pairs, then call Object.fromEntries.`,`To build an index, map each user to [id, user], then call Object.fromEntries.`],remember:`The pair is the unit of object transformation. Keep the key when changing a value. Explicitly test value !== undefined to preserve 0, false, and empty strings.`,trap:`Later properties win. Setting a value to undefined does not remove its key. Duplicate ids in fromEntries keep the last value; a missing lookup still needs a guard.`,exercise:`Set fontSize to 18, remove timezone, drop undefined values, and index users by id.`,expected:`18; timezone key absent; defined settings; usersById[3] is Cara`,refs:[15,16,17,18,19],cost:`O(k) time/space for rebuilding k properties; O(n) to build the user index, then expected O(1) per lookup.`,code:`const bigger = {...settings, fontSize: 18};
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
expect(cara?.name, 'Cara'); expect(usersById[99], undefined);`},{id:`nested-copy`,group:`Compose the moves`,title:`Copy the path to a nested change`,tools:`nested spread · shallow copy · structuredClone`,why:`A nested update is several flat updates composed along one path.`,steps:[`Locate the changed leaf, such as company.address.city.`,`Write the replacement from the inside out: copy address and override city, then copy company and replace address.`,`Check that changed ancestors are new references and untouched branches can still be shared.`],remember:`Spread copies one level. For cloneable data, structuredClone creates a deep copy that you can then mutate independently.`,trap:`A top-level spread still shares address and teams. structuredClone copies the whole graph, loses useful sharing, and cannot clone values such as functions or DOM nodes.`,exercise:`Move the company to Denver without changing the original Boston address.`,expected:`moved !== company; moved.address !== company.address; moved.teams === company.teams`,refs:[29,30,34],cost:`Path copying costs the size of each copied container. Deep cloning costs O(total cloneable data) time and space.`,code:`const moved = {
  ...company,
  address: {...company.address, city: "Denver"},
};

const shallow = {...company};
const sharesAddress = shallow.address === company.address; // true

const clone = structuredClone(company);
clone.address.city = "Austin";`,checks:`expect(moved.address.city, 'Denver'); expect(company.address.city, 'Boston');
expect(moved !== company, true); expect(moved.address !== company.address, true);
expect(moved.teams === company.teams, true); expect(sharesAddress, true);
expect(clone.address.city, 'Austin'); expect(clone.teams === company.teams, false);`},{id:`nested-arrays`,group:`Compose the moves`,title:`Compose the trio inside nested arrays`,tools:`outer spread → map target → inner spread/filter`,why:`No new primitive is needed: reuse the array trio inside the copied object path.`,steps:[`Write the outer {...company, teams: …} shell, then map the teams to locate the target id.`,`Return nonmatching teams unchanged. For the match, spread the team and replace the changed property.`,`For memberIds, add with a spread or remove with filter; then verify both values and reference identity.`],remember:`For company → teams → team → memberIds, copy every container on that path. An unchanged team should keep its reference.`,trap:`Copying the team but pushing into its existing memberIds still mutates the original. Specify what should happen when a target id is missing or a member is already present.`,exercise:`Rename Backend to Platform; add member 5 to Frontend; remove member 3 from Backend.`,expected:`Platform; [1, 2, 5]; [4] — each in its own result`,refs:[31,32,33],cost:`O(t) for a rename; O(t + m) for a member edit, copying t team references and m member ids.`,code:`const renamed = {
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
expect(withNewMember.teams[0]?.memberIds === company.teams[0]?.memberIds, false);`},{id:`compose`,group:`Compose the moves`,title:`Join data, then write the pipeline`,tools:`lookup → flatMap · filter → map → sort`,why:`Finish by composing the earlier operations in dependency order. Keep each intermediate shape clear.`,steps:[`Build usersById before resolving member ids. Read the selected team with ?. and default missing memberIds to [].`,`flatMap each id to [user] when found or [] when missing; this both joins and removes missing partners.`,`For active names: filter while active is still available, map to name, then sort the resulting strings.`],remember:`Pipeline order follows the data you still need. After mapping users to names, you no longer have the active property for filtering.`,trap:`A find inside every member loop costs O(mn); a lookup built once makes the join expected O(n + m). Sorting the new mapped array is safe for the original users array.`,exercise:`Resolve Frontend’s members and return alphabetized active names.`,expected:`[Ana, Ben]; [Ana, Cara]`,refs:[35,20],cost:`Join: expected O(n + m) time including the index. Active-name pipeline: typically O(n + a log a) comparisons, O(n) extra space.`,code:`// Build this first — the join depends on it (stage 07).
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
expect((company.teams[9]?.memberIds ?? []).flatMap(id => usersById[id] ? [usersById[id]] : []), []);`}],M=new Set(j.flatMap(e=>e.refs)).size;function se(e){return[`users`,`settings`,`company`].filter(t=>RegExp(`\\b${t}\\b`).test(e.code))}function ce(e){return`${A}\n\n${e.code}\n\nconsole.log({${{read:`keys, values, pairs, isEmpty, city, secondTeamName, tenthTeamName`,loop:`loudNames, oldestLoop, firstInactive, settingLines, keyList`,select:`names, activeUsers, firstYoung, anyActive, allActive, inactiveLoop`,aggregate:`totalAge, byAge`,order:`byAgeAsc, byName, ages, uniqueAges`,"array-updates":`withEve, withoutBen, benActivated`,objects:`bigger, withoutTimezone, stringified, defined, usersById, cara`,"nested-copy":`moved, sharesAddress, clone`,"nested-arrays":`renamed, withNewMember, withoutMember3`,compose:`frontendMembers, activeNames`}[e.id]}});`}var N=e(`<meta name="description"/>`),P=e(`<a class="toc-next svelte-vvz4h6" href="./patterns/">Then: algorithm patterns <span aria-hidden="true">↗</span></a>`),F=e(`<div class="empty"><p> </p> <button class="button" type="button">Clear search</button></div>`),le=e(`<li class="svelte-vvz4h6"> </li>`),ue=e(`<a href="#sample-data"><code> </code></a> `,1),de=e(`Uses <!> from the shared data <span aria-hidden="true">↑</span>. Copy includes that data and logs the results.`,1),fe=e(`<code>expect(actual, expected)</code> passes when both have the same JSON.`,1),pe=e(`<article class="stage svelte-vvz4h6"><header class="stage-heading svelte-vvz4h6"><span class="stage-number svelte-vvz4h6"> </span> <div class="svelte-vvz4h6"><p class="kicker svelte-vvz4h6"> </p> <h2> </h2> <p class="tools svelte-vvz4h6"> </p></div></header> <p class="why svelte-vvz4h6"> </p> <h3 class="svelte-vvz4h6">Write it in this order</h3> <ol class="steps svelte-vvz4h6"></ol> <!> <details class="verify svelte-vvz4h6"><summary class="svelte-vvz4h6"> </summary> <!></details> <dl class="facts"><div><dt>Remember</dt><dd> </dd></div> <div class="watch"><dt>Watch for</dt><dd> </dd></div> <div><dt>Cost</dt><dd> </dd></div></dl> <div class="practice svelte-vvz4h6"><p class="kicker svelte-vvz4h6">Try from memory</p> <p class="svelte-vvz4h6"> </p> <details class="answer svelte-vvz4h6"><summary class="svelte-vvz4h6">Show answer</summary> <p class="svelte-vvz4h6"> </p></details></div> <!></article>`),me=e(`<section class="hero" aria-labelledby="page-title"><p class="eyebrow"><span class="ts-mark">TS</span> Sheet 1 · Data manipulation</p> <h1 id="page-title">Build it in<br/><span>the right order.</span></h1> <p class="intro">A TypeScript study sheet arranged by what you need first. Learn the small moves (read, loop,
    pick a method), then combine them into nested updates and joins.</p> <div class="hero-meta"><span><strong> </strong> examples</span> <span><strong> </strong> stages</span> <span>Every snippet compiles and is tested</span></div></section> <div class="sheet-layout" id="toc"><!> <div class="sheet-content" id="content"><section class="rule svelte-vvz4h6" aria-labelledby="rule-title"><p class="kicker svelte-vvz4h6">The repeatable order</p> <h2 id="rule-title" class="svelte-vvz4h6">Shape → output → operation → callback → check</h2> <p class="svelte-vvz4h6">Read the input shape. Name the result type. Pick the method. Write its callback. Verify the
        values, missing-data behavior, and what stayed unchanged.</p></section> <section class="chooser svelte-vvz4h6" aria-labelledby="choose-title"><h2 id="choose-title" class="svelte-vvz4h6">Choose by the result you need</h2> <div class="choices svelte-vvz4h6"><div class="svelte-vvz4h6"><span class="svelte-vvz4h6">One value per item</span><code class="svelte-vvz4h6">map</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A subset of items</span><code class="svelte-vvz4h6">filter</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">The first match</span><code class="svelte-vvz4h6">find</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A yes / no answer</span><code class="svelte-vvz4h6">some / every</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">A total or groups</span><code class="svelte-vvz4h6">reduce</code></div> <div class="svelte-vvz4h6"><span class="svelte-vvz4h6">Zero or more per item</span><code class="svelte-vvz4h6">flatMap</code></div></div></section> <details class="sample svelte-vvz4h6" id="sample-data" open=""><summary class="svelte-vvz4h6"><span class="kicker svelte-vvz4h6">The shared data</span> <span class="sample-toggle svelte-vvz4h6" aria-hidden="true"></span> <span class="sample-names svelte-vvz4h6"><code>users</code>, <code>settings</code>, <code>company</code></span></summary> <p class="svelte-vvz4h6">Every stage reads these values. Each Copy button includes them, so a copied example runs on its own.</p> <!></details> <div class="search-row svelte-vvz4h6"><label class="search svelte-vvz4h6"><span aria-hidden="true">⌕</span> <span class="sr-only">Search stages, including their code</span> <input type="search" placeholder="Search a method or task: map, nested, localeCompare…"/></label> <p class="result-count" aria-live="polite"> </p></div> <!> <!> <section class="finish svelte-vvz4h6" aria-labelledby="finish-title"><p class="kicker svelte-vvz4h6">The final check</p> <h2 id="finish-title">Can you combine the moves without looking?</h2> <p class="svelte-vvz4h6">Rename a team, add a member, resolve its member ids to users, keep only active users, and
        return their alphabetized names. First name the intermediate shape after each step. Then
        implement it.</p> <p class="footnote svelte-vvz4h6">n = users; k = object keys; t = teams; m = member ids; a = active users. String comparisons
        also depend on string length. Hash lookups use expected-time shorthand; sort performance
        depends on the engine.</p> <a class="continue svelte-vvz4h6" href="./patterns/">Continue to sheet 2: algorithm patterns <span aria-hidden="true">↗</span></a></section> <footer class="sheet-footer"><p>Every snippet compiles under strict TypeScript, and every Verify check passes.</p> <a href="#page-title">Back to top ↑</a></footer></div></div>`,1);function I(e,c){C(c,!0);let v=g(``),O=g(``),k=new Map(j.map((e,t)=>[e.id,String(t+1).padStart(2,`0`)])),I=new Map(j.map(e=>[e.id,[e.title,e.tools,e.why,...e.steps,e.remember,e.trap,e.exercise,e.code].join(` `).toLowerCase()])),L=b(()=>o(v).trim().toLowerCase().split(/\s+/).filter(Boolean)),R=b(()=>new Set(j.filter(e=>o(L).every(t=>I.get(e.id).includes(t))).map(e=>e.id))),z=[{items:[{id:`sample-data`,label:`The shared data`}]},...oe.map(e=>({label:e,items:j.filter(t=>t.group===e).map(e=>({id:e.id,label:e.title,num:k.get(e.id)}))}))],he=e=>e.match(/\bexpect\(/g)?.length??0;function ge(){let e=document.getElementById(`sample-data`);e instanceof HTMLDetailsElement&&(e.open=!0)}async function _e(e,t){t===`sample-data`&&ge(),!(!k.has(t)||o(R).has(t))&&(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0||(e.preventDefault(),u(v,``),await d(),T(`#${t}`,{}),document.getElementById(t)?.scrollIntoView({block:`start`})))}y(()=>D([`sample-data`,...j.map(e=>e.id)],e=>u(O,e,!0)));var B=me();re(`vvz4h6`,e=>{var t=N();a(()=>h(t,`content`,`${M} TypeScript data manipulation examples in the order you need them: ${j.length} stages, each with coding steps, pitfalls, and runnable, tested code.`)),f(()=>{i.title=`TypeScript data manipulation cheat sheet · algoviz`}),l(e,t)});var V=s(B),H=p(S(V),6),U=S(H),W=S(U),G=S(W,!0);x(W),_(),x(U);var K=p(U,2),q=S(K),J=S(q,!0);x(q),_(),x(K),_(2),x(H),x(V);var Y=p(V,2),X=S(Y);ae(X,{get groups(){return z},get active(){return o(O)},heading:`Build in this order`,label:`Stages`,onjump:_e,footer:e=>{var t=P();l(e,t)},$$slots:{footer:!0}});var Z=p(X,2),Q=p(S(Z),4),ve=p(S(Q),4);E(ve,{get html(){return c.data.sampleHtml},get source(){return A},label:`sample-data.ts`,title:`Shared sample data`}),x(Q);var $=p(Q,2),ye=S($),be=p(S(ye),4);w(be),x(ye);var xe=p(ye,2),Se=S(xe);x(xe),x($);var Ce=p($,2),we=e=>{var t=F(),r=S(t),i=S(r);x(r);var s=p(r,2);x(t),a(e=>n(i,`No stage matches “${e??``}”.`),[()=>o(v).trim()]),ee(`click`,s,()=>u(v,``)),l(e,t)};r(Ce,e=>{o(R).size===0&&e(we)});var Te=p(Ce,2);t(Te,19,()=>j,e=>e.id,(e,r,i)=>{let u=b(()=>se(o(r))),d=b(()=>c.data.stageHtml[o(r).id]),f=b(()=>j[o(i)-1]),m=b(()=>j[o(i)+1]);var g=pe(),v=S(g),y=S(v),te=S(y,!0);x(y);var C=p(y,2),w=S(C),re=S(w,!0);x(w);var T=p(w,2),ae=S(T,!0);x(T);var D=p(T,2),O=S(D,!0);x(D),x(C),x(v);var A=p(v,2),oe=S(A,!0);x(A);var M=p(A,4);t(M,21,()=>o(r).steps,ne,(e,t)=>{var r=le(),i=S(r,!0);x(r),a(()=>n(i,o(t))),l(e,r)}),x(M);var N=p(M,2);{let e=e=>{_();var r=de(),i=p(s(r));t(i,18,()=>o(u),e=>e,(e,t,r)=>{var i=ue(),c=s(i),d=S(c),f=S(d,!0);x(d),x(c);var m=p(c,1,!0);a(()=>{n(f,t),n(m,o(r)<o(u).length-1?`, `:``)}),ee(`click`,c,ge),l(e,i)}),_(3),l(e,r)},i=b(()=>ce(o(r))),c=b(()=>`${o(r).id}.ts`),f=b(()=>`${o(r).title} example`);E(N,{get html(){return o(d).code},get source(){return o(i)},get label(){return o(c)},get title(){return o(f)},meta:e,$$slots:{meta:!0}})}var P=p(N,2),F=S(P),me=S(F);x(F);var I=p(F,2);{let e=e=>{var t=fe();_(),l(e,t)},t=b(()=>`${o(r).title} checks`);E(I,{compact:!0,get html(){return o(d).checks},get source(){return o(r).checks},label:`checks`,get title(){return o(t)},meta:e,$$slots:{meta:!0}})}x(P);var L=p(P,2),z=S(L),B=p(S(z)),V=S(B,!0);x(B),x(z);var H=p(z,2),U=p(S(H)),W=S(U,!0);x(U),x(H);var G=p(H,2),K=p(S(G)),q=S(K,!0);x(K),x(G),x(L);var J=p(L,2),Y=p(S(J),2),X=S(Y,!0);x(Y);var Z=p(Y,2),Q=p(S(Z),2),ve=S(Q,!0);x(Q),x(Z),x(J);var $=p(J,2);{let e=b(()=>o(f)&&{id:o(f).id,label:o(f).title}),t=b(()=>o(m)&&{id:o(m).id,label:o(m).title});ie($,{get prev(){return o(e)},get next(){return o(t)},onjump:_e})}x(g),a((e,t,i)=>{h(g,`id`,o(r).id),h(g,`hidden`,e),h(g,`aria-labelledby`,`${o(r).id}-title`),n(te,t),n(re,o(r).group),h(T,`id`,`${o(r).id}-title`),n(ae,o(r).title),n(O,o(r).tools),n(oe,o(r).why),n(me,`Verify: ${i??``} expected results`),n(V,o(r).remember),n(W,o(r).trap),n(q,o(r).cost),n(X,o(r).exercise),n(ve,o(r).expected)},[()=>!o(R).has(o(r).id),()=>k.get(o(r).id),()=>he(o(r).checks)]),l(e,g)}),_(4),x(Z),x(Y),a(()=>{n(G,M),n(J,j.length),n(Se,`${o(R).size??``} of ${j.length??``} stages`)}),m(be,()=>o(v),e=>u(v,e)),l(e,B),te()}c([`click`]);export{I as component,O as universal};