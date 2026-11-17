'use strict';

const item = (id, label, children = [], extra = {}) => ({id, label, children, ...extra});
const copy = value => JSON.parse(JSON.stringify(value));
const programmes = () => [
  item('cervical', 'Cervical screening'),
  item('fit', 'FIT test'),
  item('lung', 'Lung screening'),
  item('psa', 'PSA test')
];
const getATest = () => item('get-test', 'Get a test', [
  item('sexual-health', 'Sexual health', [
    item('hiv', 'HIV test'), item('sti', 'STI tests')
  ]),
  item('health-checks', 'Health checks', [
    item('nhs-health-check', 'NHS Health Check'),
    item('blood-pressure', 'Blood pressure monitoring')
  ]),
  item('programmes', 'Screening programmes', programmes())
]);
const resultCards = () => [
  item('fbc', 'Full blood count'),
  item('hba1c', 'Blood glucose test (HbA1c)'),
  item('cholesterol', 'Cholesterol test'),
  item('all-results', 'View all results', [], {detail:'Placeholder in v1'})
];
const vaccinationCards = () => [
  item('check-vaccines', 'Check and book vaccinations'),
  item('vaccine-record', 'Vaccination record', [], {detail:'Placeholder'}),
  item('covid-vaccine', 'COVID-19 vaccinations')
];
const documentCards = () => [
  item('request-letter', 'Request a letter or information', [], {detail:'Placeholder'}),
  item('gp-documents', 'GP documents'),
  item('hospital-documents', 'Hospital and specialist documents and questionnaires', [], {condition:'PKB on'}),
  item('team-links', 'Useful links from your health team')
];
const conditions = () => item('conditions', 'Health conditions', [
  item('allergies', 'Allergies and adverse reactions'), item('all-conditions', 'All conditions')
]);
const baseRoots = [
  item('home', 'Home', [
    item('prescriptions', 'Prescriptions', [
      item('request-rx', 'Request a prescription'),
      item('rx-progress', 'Check prescription progress', [], {condition:'After requesting a prescription'}),
      item('medicines', 'Medicines record'),
      item('pharmacy', 'Your chosen pharmacy')
    ]),
    item('appointments', 'Appointments', [
      item('gp-help', 'Get help from your GP'),
      item('next-appointment', 'Next appointment', [], {condition:'Has upcoming appointments on'}),
      item('manage-appointments', 'View and manage appointments'),
      item('appointment-notes', 'GP appointment notes'),
      item('referrals', 'Referrals'), item('waiting-lists', 'Waiting lists'),
      item('follow-up', 'Patient initiated follow-up')
    ]),
    item('tests', 'Test results', [
      getATest(),
      item('test-tracking', 'Orders', [], {condition:'After ordering a test kit', detail:'Opens test order progress'}),
      item('test-results', 'Results', resultCards())
    ]),
    item('vaccinations', 'Vaccinations', vaccinationCards()),
    conditions(),
    item('documents', 'Documents', documentCards())
  ], {detail:'Profile card and Messages entry remain available. Service cards are shown in Home order.'}),
  item('profile', 'Profile', [
    item('personal-details', 'Personal details', [
      item('contact', 'Contact details'), item('gp-surgery', 'Your GP surgery')
    ]),
    item('health-details', 'Health details', [
      item('health-choices', 'Health choices', [
        item('organ-choice', 'Organ donation decision'),
        item('data-sharing', 'Health data sharing decision'),
        item('research', 'Take part in health research')
      ]),
      item('care-plans', 'Care plans'),
      item('measurements', 'Measurements')
    ]),
    item('account-settings', 'Account and app settings', [], {detail:'Face ID, login and security, notifications and cookies; other account controls omitted'})
  ], {detail:'Opened from the profile card. Main-user view; linked-profile restrictions are not expanded.'}),
  item('messages', 'Messages', [
    item('inbox', 'Message inbox', [
      item('screening-invites', 'Screening invitations and eligibility messages'),
      item('bp-invite', 'Blood pressure monitoring invitation'),
      item('rx-messages', 'Prescription updates'),
      item('message-detail', 'Message detail')
    ])
  ], {detail:'Messages remain outside the Tests hub. Individual sample messages are summarised.'})
];

const VERSIONS = [{
  id:'v1', name:'v1', parent:'Original as-is layout', roots:copy(baseRoots),
  summary:'The light-touch baseline: Test results becomes Tests. The rest of the map stays blue and white.',
  notes:[
    'Colouring follows the requested v1 convention: only the Tests card name is purple. This is an IA comparison baseline, not a claim that the prototype contains no other journey enhancements.',
    'The baseline includes the existing test ordering and tracking journeys so later versions can show where those journeys move.',
    'Dashed cards state when an item appears. PKB means Patients Know Best. Placeholders are labelled; the diagram does not make them working services.',
    'Shared profile switching, help links, NHS information links, organ donation promotion and feedback are not repeated inside every hub. This overview focuses on the primary IA and test-ordering content.'
  ]
}];
VERSIONS[0].roots[0].children.find(node => node.id === 'tests').label = 'Tests';

function find(roots, id) {
  for (const root of roots) {
    if (root.id === id) return root;
    const descendant = find(root.children, id);
    if (descendant) return descendant;
  }
}

function take(roots, id) {
  const index = roots.findIndex(node => node.id === id);
  if (index !== -1) return roots.splice(index, 1)[0];
  for (const root of roots) {
    const found = take(root.children, id);
    if (found) return found;
  }
}

const v2 = {
  id:'v2', name:'v2', parent:'v1, reorganised into the new IA', roots:copy(VERSIONS[0].roots),
  summary:'Get help comes onto Home. Tests, vaccinations and screening sit under Tests and prevention; Health conditions moves into Profile; Activity replaces Messages.',
  notes:[
    ...VERSIONS[0].notes.slice(2),
    'The v2 Tests hub still contains results. Screening has its own record. Unlike v2.5 and v4, results have not been pulled into a separate Home hub.',
    'The online GP form is shown only when PKB is on. The Home screening invitation, screening eligibility card and Activity tracking cards each have prototype-setting controls.',
    'Monitoring is not included: it was removed from Profile. Blood pressure monitoring remains an option under Get a test.',
    'The comparison uses the current saved prototype, including later journey refinements, not an earlier screenshot of v2.'
  ]
};
const v2Home = find(v2.roots, 'home');
const v2Tests = take(v2.roots, 'tests');
const v2Vaccinations = take(v2.roots, 'vaccinations');
const v2Programmes = take(v2Tests.children, 'programmes');
find(v2.roots, 'health-details').children.unshift(take(v2.roots, 'conditions'));
v2Tests.children.find(node => node.id === 'test-tracking').label = 'Test order tracking';
v2Tests.children.find(node => node.id === 'test-results').children.find(node => node.id === 'all-results').detail =
  'GP results; hospital results when PKB is on';
v2Home.children.splice(2, 0,
  item('tests-prevention', 'Tests and prevention', [
    v2Tests, v2Vaccinations,
    item('screening', 'Screening', [
      item('eligible', 'You may be eligible for cervical screening', [
        item('arrange-screening', 'Arrange screening', [], {detail:'Placeholder'})
      ], {condition:'Eligible for screening setting on'}),
      item('read-screening', 'Read about screening', [], {detail:'NHS website'}),
      item('screening-record', 'Your screening record'),
      v2Programmes
    ])
  ])
);
v2Home.children.unshift(item('get-help', 'Get help with a health problem', [
  item('online-form', 'Send an online form to your GP surgery', [], {condition:'PKB on', detail:'Placeholder'}),
  item('book-gp', 'Book a GP appointment'),
  item('111', 'Check your symptoms using 111 online', [], {detail:'Separate secondary card'})
], {detail:'Blue card above the service menu'}));
v2Home.children.unshift(item('home-invite', "You've been invited to book a screening", [], {
  condition:'Screening invite on Home setting on; not dismissed'
}));
v2Home.detail = 'Profile card, optional screening invitation, Get help, then the service menu. Activity replaces the Messages entry. Shared links and campaign cards remain below.';
find(v2.roots, 'health-choices').children.push(
  item('symptoms', 'Record your symptoms'),
  item('record-access', 'Choose which records your health team can see')
);
const v2Appointments = find(v2.roots, 'appointments');
const movedLetter = take(v2.roots, 'request-letter');
movedLetter.detail = 'Provided using Patchs; placeholder';
v2Appointments.children = [
  item('manage-gp', 'Manage GP appointments'),
  item('appointment-notes', 'Appointment notes and other updates'),
  movedLetter,
  item('manage-hospital', 'Manage hospital and specialist appointments', [], {detail:'Placeholder'}),
  item('referrals', 'Referrals'), item('waiting-lists', 'Waiting lists')
];
const activity = find(v2.roots, 'messages');
activity.label = 'Activity';
activity.detail = 'Combined chronological feed of messages and notifications; reached from Home or the Activity tab when the tab bar is enabled.';
activity.children.unshift(item('activity-tracking', 'Tracking updates', [
  item('activity-test', 'Test order tracking', [], {condition:'A test kit has been ordered'}),
  item('activity-rx', 'Prescription tracking', [], {condition:'A prescription has been requested'})
], {condition:'Tracking update card setting on'}));
find(v2.roots, 'inbox').label = 'Messages and notifications';
find(v2.roots, 'inbox').children.push(
  item('test-messages', 'Test order updates', [], {condition:'After ordering; stage updates appear in the log'}),
  item('notifications', 'Other notifications', [], {detail:'General items remain in the log as read'})
);
VERSIONS.push(v2);

const getCare = () => item('get-help', 'Get care', [
  item('describe-problem', 'Describe your health problem', [
    item('care-continue', 'Continue', [], {detail:'Placeholder response, not clinical advice'})
  ]),
  item('care-options', 'Care options', [
    item('book-gp', 'Book a GP appointment'),
    item('care-vaccinations', 'Check and book vaccinations', [], {detail:'Shortcut to the vaccination journey'}),
    item('care-test', 'Get a test', [], {detail:'Shortcut to the test catalogue'}),
    item('care-prescriptions', 'Order a repeat prescription', [], {detail:'Shortcut to Prescriptions'})
  ]),
  item('urgent-care', 'Urgent medical advice')
], {detail:'White card; opens the full-screen Get care journey'});

const v25 = {
  id:'v2.5', name:'v2.5', parent:'v2, with Results separated and the latest Get care / prevention changes',
  roots:copy(v2.roots),
  summary:'A separate Results feed on Home, Documents in Profile, and Zach\'s direct Tests and prevention actions. The white Get care card now matches v4.',
  notes:[
    ...v2.notes.slice(0, 2),
    'This is the latest saved v2.5, including the subsequent request to use v4\'s Get care section. It is not the earlier v2.5 with the original Get help page.',
    'Tests and prevention uses the v3 layout: Orders, Get a test, a vaccination action group and Screening programmes. There is no intermediate Tests page or results list in this hub.',
    'Screening programmes opens the existing Screening hub with eligibility and programme options, but no screening record. Screening results now belong in Results.',
    'The Results feed has All, GP surgery, Hospital, Screening and Scans filters. Hospital results and scans require PKB. Results and Documents retain sensitive-information warnings.',
    'Test order tracking appears both in Tests and prevention and on Get a test after ordering. Activity still contains order updates and optional tracking cards.'
  ]
};
const v25Home = find(v25.roots, 'home');
v25Home.children[v25Home.children.findIndex(node => node.id === 'get-help')] = getCare();
const v25Tests = take(v25.roots, 'tests');
const v25GetTest = take(v25Tests.children, 'get-test');
const v25Orders = take(v25Tests.children, 'test-tracking');
v25Orders.label = 'Orders';
const v25Results = take(v25Tests.children, 'test-results');
v25Results.detail = 'Sensitive-information warning before opening; newest first, grouped by month';
take(v25Results.children, 'all-results');
v25Results.children = [
  item('result-filters', 'Quick filters', [
    item('filter-all', 'All'), item('filter-gp', 'GP surgery'),
    item('filter-hospital', 'Hospital', [], {condition:'PKB on'}),
    item('filter-screening', 'Screening'), item('filter-scans', 'Scans', [], {condition:'PKB on'})
  ]),
  item('results-feed', 'Combined results feed', [
    ...v25Results.children,
    item('other-results', 'Other test, screening and scan results', [], {detail:'Representative overview, not the full sample data list'})
  ])
];
v25Home.children.push(v25Results);
const v25Documents = take(v25.roots, 'documents');
v25Documents.detail = 'Sensitive-information warning before opening';
find(v25.roots, 'health-details').children.push(v25Documents);
const v25Vaccinations = take(v25.roots, 'vaccinations');
v25Vaccinations.detail = 'Unlabelled action group in the prototype';
take(v25Vaccinations.children, 'covid-vaccine');
const v25Screening = take(v25.roots, 'screening');
v25Screening.label = 'Screening programmes';
v25Screening.detail = 'Opens the Screening hub; no results here';
take(v25Screening.children, 'screening-record');
find(v25.roots, 'tests-prevention').children = [
  v25Orders, v25GetTest, v25Vaccinations, v25Screening
];
v25GetTest.children.unshift(item('get-test-tracking', 'Test order tracking', [], {
  condition:'After ordering a test kit', detail:'Opens test order progress'
}));
v25Home.detail = 'Profile card, optional screening invitation, white Get care card, then Prescriptions, Appointments, Tests and prevention and Results. Documents is no longer on Home.';
VERSIONS.push(v25);

const v3 = {
  id:'v3', name:'v3', parent:'Zach\'s second branch (test-ordering-zach-2), not an iteration of v2.5',
  roots:copy(v25.roots),
  summary:'Zach\'s alternative Home: Get care, a Health updates feed, and the Your health menu. A bell opens all health updates; there is no tab bar.',
  notes:[
    ...v2.notes.slice(0, 2),
    'v3 is a parallel concept from Zach, not a continuation of v2.5. The previous-version view deliberately compares the two alternatives; Design basis compares v3 with v1.',
    'The blue Get care card uses the same journey as the white card in v2.5 and v4. Map purple indicates a change, not the card\'s actual background colour.',
    'Health updates combines order progress, appointments and invitations with messages. The bell and View all health updates open the full updates page. The form on that page is a placeholder.',
    'Health choices and Care plans return to Personal details. Health details contains Health conditions, Measurements, Vaccinations and Documents.',
    'Results uses Zach\'s year-grouped feed and adds a Blood tests filter. Its sample feed is not gated by the PKB setting.',
    'Screening programmes lists Cervical screening, Bowel cancer screening and Breast screening. Screening programmes is absent from Get a test.'
  ]
};
const v3Home = find(v3.roots, 'home');
take(v3.roots, 'home-invite');
find(v3.roots, 'get-help').detail = 'Blue card; opens the full-screen Get care journey';
const v3Updates = item('updates-preview', 'Health updates', [
  item('updates-preview-tiles', 'Up to two update tiles', [], {
    condition:'Relevant updates available',
    detail:'Appointments, invitations, prescription or test order progress, and messages'
  }),
  item('view-all-updates', 'View all health updates', [], {detail:'Also available from the bell'})
], {detail:'Home feed between Get care and Your health'});
v3Home.children.splice(1, 0, v3Updates);
v3Home.detail = 'No tab bar. Profile card > blue Get care card > Health updates > Your health menu (Prescriptions, Appointments, Tests and prevention, Results) > NHS information and support > feedback. No organ donation campaign card.';
const v3AppointmentsIndex = v3Home.children.findIndex(node => node.id === 'appointments');
v3Home.children[v3AppointmentsIndex] = copy(find(VERSIONS[0].roots, 'appointments'));
take(v3.roots, 'eligible');
take(v3.roots, 'read-screening');
const v3Programmes = find(v3.roots, 'programmes');
v3Programmes.children = [
  item('cervical', 'Cervical screening', [], {detail:'Ages 25 to 64'}),
  item('fit', 'Bowel cancer screening', [], {detail:'Ages 50 to 74'}),
  item('breast', 'Breast screening', [], {detail:'Ages 50 to 71; placeholder'})
];
find(v3.roots, 'screening').children = v3Programmes.children;
find(v3.roots, 'screening').detail = 'Direct programme list, not the v2 Screening hub';
take(v3.roots, 'get-test-tracking');
const v3Personal = find(v3.roots, 'personal-details');
v3Personal.children.push(take(v3.roots, 'health-choices'), take(v3.roots, 'care-plans'));
find(v3.roots, 'health-details').children.splice(2, 0, item('profile-vaccinations', 'Vaccinations',
  copy(find(VERSIONS[0].roots, 'vaccinations').children).map(node => ({...node, id:`profile-${node.id}`})),
  {detail:'Also reachable from Profile'}
));
const v3Documents = find(v3.roots, 'documents');
delete v3Documents.detail;
const v3Measurements = find(v3.roots, 'measurements');
v3Measurements.children = [
  item('measurement-bp', 'Blood pressure'),
  item('measurement-glucose', 'Blood glucose'),
  item('measurement-weight', 'Weight')
];
v3Measurements.detail = 'Zach\'s measurement lists and detail pages';
const v3Results = find(v3.roots, 'test-results');
v3Results.detail = 'Sensitive-information warning before opening; newest first, grouped by year';
find(v3.roots, 'result-filters').children = [
  item('filter-all', 'All'), item('filter-gp', 'GP surgery'),
  item('filter-hospital', 'Hospital'), item('filter-blood', 'Blood tests'),
  item('filter-scans', 'Scans'), item('filter-screening', 'Screening')
];
const v3Messages = find(v3.roots, 'messages');
v3Messages.label = 'Health updates';
v3Messages.detail = 'Opened from the Home feed link or bell. Updates first, then Messages; no Activity tab.';
const v3Tracking = find(v3.roots, 'activity-tracking');
v3Tracking.label = 'Health update tiles and rows';
delete v3Tracking.condition;
v3Tracking.children.push(
  item('updates-appointment', 'Next appointment', [], {condition:'An upcoming appointment exists'}),
  item('updates-invitation', 'Vaccination invitation', [], {detail:'Opens Check and book vaccinations'})
);
take(v3.roots, 'test-messages');
take(v3.roots, 'notifications');
find(v3.roots, 'inbox').label = 'Messages';
find(v3.roots, 'inbox').children.push(
  item('online-form', 'Send a message or online form to your doctor', [], {
    detail:'Provided using Patients Know Best; placeholder. This v3 row is not gated by the PKB toggle.'
  })
);
VERSIONS.push(v3);

const v4 = {
  id:'v4', name:'v4', parent:'v2.5 plus Support apps (not built on v3)', roots:copy(v25.roots),
  summary:'The v2.5 layout with Support apps above organ donation. Recommended apps can be tailored in Prototype settings.',
  notes:[
    ...v25.notes,
    'v4 is built on v2.5, not v3. Compared with v3, many items move back. Choose Design basis to isolate the Support apps addition.',
    'v2.5 was subsequently updated to use the same white Get care journey. In the current prototype, Support apps is the key additional v4 feature.',
    'Support apps contains NHS apps and online support pages, not an exhaustive catalogue of NHS-connected apps. Links open NHS information pages in the in-app browser.',
    'Recommendation factors are researcher-controlled prototype settings: smoking, alcohol, weight, inactivity, sleep, mental health and diabetes risk. They are not inferred from real patient data.'
  ]
};
find(v4.roots, 'home').children.push(item('support-apps', 'Support apps', [
  item('recommended-apps', 'Recommended for you', [], {
    condition:'At least one app matches the selected user factors',
    detail:'Matching entries from All support apps, with a reason for the recommendation'
  }),
  item('all-support-apps', 'All support apps', [
    item('quit-smoking', 'Quit smoking'),
    item('drink-less', 'Drink less'),
    item('lose-weight', 'Lose weight'),
    item('couch-5k', 'Couch to 5K'),
    item('get-active', 'Get active'),
    item('mind-matters', 'Every Mind Matters'),
    item('talking-therapies', 'NHS Talking Therapies'),
    item('sleep', 'Sleep support'),
    item('diabetes-prevention', 'Diabetes prevention')
  ])
], {detail:'White tile with an app icon, below the main Home content and above organ donation'}));
VERSIONS.push(v4);

const designBases = {v1:null, v2:'v1', 'v2.5':'v2', v3:'v1', v4:'v2.5'};

const homeLayout = [
  item('feed-profile', 'Profile card'),
  item('feed-menu', 'Service menu'),
  item('feed-links', 'NHS information and support'),
  item('feed-organ', 'Organ donors save lives'),
  item('feed-feedback', 'Feedback'),
  item('feed-help', 'Help using the NHS App')
];
find(baseRoots, 'home').layout = copy(homeLayout);
VERSIONS.forEach(version => {
  const layout = copy(homeLayout);
  if (version.id !== 'v1') {
    layout.splice(1, 0,
      item('feed-invite', 'Screening invitation', [], {condition:'Home invite setting on'}),
      item('feed-get-help', 'Get help with a health problem', [], {detail:'Blue card'})
    );
  }
  if (['v2.5', 'v3', 'v4'].includes(version.id)) {
    const care = layout.find(node => node.id === 'feed-get-help');
    care.label = 'Get care';
    care.detail = version.id === 'v3' ? 'Blue card' : 'White card';
  }
  if (version.id === 'v3') {
    ['feed-invite', 'feed-organ', 'feed-help'].forEach(id => take(layout, id));
    layout.splice(2, 0, item('feed-updates', 'Health updates', [], {detail:'Preview tiles + View all health updates'}));
    layout.find(node => node.id === 'feed-menu').label = 'Your health';
  }
  if (version.id === 'v4') {
    layout.splice(layout.findIndex(node => node.id === 'feed-organ'), 0,
      item('feed-support-apps', 'Support apps', [], {detail:'White tile'})
    );
  }
  find(version.roots, 'home').layout = layout;
});

function flatten(roots) {
  const nodes = new Map();
  function visit(node, parent, ancestors) {
    if (nodes.has(node.id)) throw new Error(`Duplicate diagram ID: ${node.id}`);
    nodes.set(node.id, {
      ...node, parent, path:[...ancestors, node.label].join(' > ')
    });
    node.children.forEach(child => visit(child, node.id, [...ancestors, node.label]));
    if (node.layout) {
      node.layout.forEach(child => visit(child, `${node.id}-layout`, [...ancestors, node.label, 'Feed order']));
    }
  }
  roots.forEach(root => visit(root, null, []));
  return nodes;
}

function compare(currentRoots, baselineRoots) {
  const current = flatten(currentRoots);
  const baseline = flatten(baselineRoots);
  const changes = new Map();
  current.forEach((node, id) => {
    const before = baseline.get(id);
    const types = [];
    if (!before) types.push('Added');
    else {
      if (before.label !== node.label) types.push('Renamed');
      if (before.parent !== node.parent) types.push('Moved');
      if (['detail', 'condition'].some(key => (before[key] || '') !== (node[key] || '')) ||
          before.children.map(child => child.id).join('|') !== node.children.map(child => child.id).join('|')) {
        types.push('Updated');
      }
    }
    if (types.length) changes.set(id, {node, before, types});
  });
  baseline.forEach((node, id) => {
    if (!current.has(id)) changes.set(id, {node, before:node, types:['Removed']});
  });
  return changes;
}

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const versionSelect = document.getElementById('version');
const baselineSelect = document.getElementById('baseline');
versionSelect.innerHTML = VERSIONS.map(version => `<option value="${version.id}">${version.name}</option>`).join('');

function renderNode(node, changes) {
  const change = changes.get(node.id);
  return `<div class="node${change ? ' changed' : ''}${node.condition ? ' conditional' : ''}" data-node="${node.id}">
    <div class="node-label">${esc(node.label)}
      ${change ? `<span class="change-tag">${esc(change.types.join(' + '))}</span>` : ''}
      ${node.detail ? `<span class="detail">${esc(node.detail)}</span>` : ''}
      ${node.condition ? `<span class="condition">Only shown: ${esc(node.condition)}</span>` : ''}
    </div>
    ${node.children.length ? `<div class="children">${node.children.map(child => renderNode(child, changes)).join('')}</div>` : ''}
  </div>`;
}

function render() {
  const index = VERSIONS.findIndex(version => version.id === versionSelect.value);
  const version = VERSIONS[index];
  const designBasis = VERSIONS.find(candidate => candidate.id === designBases[version.id]);
  const baseline = baselineSelect.value === 'asis' || index === 0
    ? {name:'original as-is layout (agreed IA baseline)', roots:baseRoots}
    : baselineSelect.value === 'basis' ? designBasis : VERSIONS[index - 1];
  const changes = compare(version.roots, baseline.roots);
  document.getElementById('version-title').textContent = `Test ordering IA ${version.name}`;
  document.getElementById('version-summary').textContent = version.summary;
  document.getElementById('lineage').textContent = `Design basis: ${version.parent}. Comparison order: v1 > v2 > v2.5 > v3 > v4.`;
  document.getElementById('comparison-label').textContent = `${version.name} compared with ${baseline.name}. Purple marks differences in this comparison.`;
  document.getElementById('diagram').innerHTML = version.roots.map((root, index) => `
    <section class="screen${changes.has(root.id) ? ' changed' : ''}" aria-labelledby="screen-${root.id}">
      <h2 class="screen-title" id="screen-${root.id}"><span class="number">Area ${index + 1}</span> ${esc(root.label)}</h2>
      ${root.detail ? `<p class="screen-description">${esc(root.detail)}</p>` : ''}
      ${root.layout ? `<h3 class="feed-heading">Home feed, top to bottom</h3>
        <ol class="feed-order">${root.layout.map(node =>
          `<li>${renderNode(node, changes)}</li>`).join('')}</ol>
        <h3 class="feed-heading">Destinations and content</h3>` : ''}
      <div class="columns">${root.children.map(node => `<div class="column">${renderNode(node, changes)}</div>`).join('')}</div>
    </section>`).join('');
  document.getElementById('changes-description').textContent =
    `Differences from ${baseline.name}. Paths show where to find each item. Removed items appear here, not as live destinations in the diagram.`;
  document.getElementById('changes-body').innerHTML = Array.from(changes.values()).map(change => `
    <tr><td>${esc(change.node.label)}</td><td>${esc(change.types.join(' + '))}</td>
    <td>${change.before ? esc(change.before.path) : 'Not present'}</td>
    <td>${change.types.includes('Removed') ? 'No longer present' : esc(change.node.path)}</td></tr>`).join('') ||
    '<tr><td colspan="4">No IA changes in this comparison.</td></tr>';
  document.getElementById('version-notes').innerHTML = version.notes.map(note => `<li>${esc(note)}</li>`).join('');
  const url = new URL(location.href);
  url.searchParams.set('version', version.id);
  url.searchParams.set('compare', baselineSelect.value);
  history.replaceState(null, '', url);
}

const params = new URLSearchParams(location.search);
if (VERSIONS.some(version => version.id === params.get('version'))) versionSelect.value = params.get('version');
if (['previous', 'asis', 'basis'].includes(params.get('compare'))) baselineSelect.value = params.get('compare');
versionSelect.addEventListener('change', render);
baselineSelect.addEventListener('change', render);
document.getElementById('print').addEventListener('click', () => window.print());
render();
