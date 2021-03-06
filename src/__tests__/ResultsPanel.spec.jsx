import React from 'react';
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { IntlProvider } from 'react-intl';
import ResultsPanel from '../ResultsPanel';
import renderer from 'react-test-renderer';

const fixture = [
  {
    company: 'foo',
    company_public_response: 'Closed',
    company_response: 'Closed',
    complaint_id: '1',
    complaint_what_happened: 'Lorem Ipsum',
    consumer_consent_provided: 'Yes',
    consumer_disputed: 'No',
    date_received: '2013-02-03T12:00:00Z',
    date_sent_to_company: '2013-01-01T12:00:00Z',
    issue: 'Foo',
    product: 'Bar',
    state: 'DC',
    sub_issue: 'Baz',
    sub_product: 'Qaz',
    submitted_via: 'email',
    timely: 'yes',
    zip_code: '200XX',
    name: 'ABC Corp',
    pk: 1234,
    effective_string: '1/1/18',
    offered: '1/1/18',
    issuer: "Acme Bank",
    agreements: [
      {
        issuer: "Acme Bank",
        name: "Acme Card",
        offered: "Jan. 15, 2018",
        pk: 2979,
        slug: "acme-bank",
        withdrawn: null,
        size: '110KB',
        uri: 'https://consumerfinance.gov'
      }
    ]
  }
]

function setupSnapshot(items=[], initialStore={}) {
  const results = Object.assign({
    doc_count: 100,
    error: '',
    hasDataIssue: false,
    isDataStale: false,
    items,
    total: items.length
  }, initialStore)

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const store = mockStore({
    query: {
      from: 0,
      size: 10
    },
    results
  })

  return renderer.create(
    <Provider store={ store } >
      <IntlProvider locale="en">
        <ResultsPanel items={ items } from="0" size="10" />
      </IntlProvider>
    </Provider>
  )
}

describe('component:ReactPanel', () => {
  it('renders without crashing', () => {
    const target = setupSnapshot(fixture)
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays a message when there are no results', () => {
    const target = setupSnapshot()
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when an error has occurred', () => {
    const target = setupSnapshot([], { error: 'oops!' })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when the data is stale', () => {
    const target = setupSnapshot(fixture, { isDataStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when only the narratives are stale', () => {
    const target = setupSnapshot(fixture, { isNarrativeStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('only displays data message when both types are stale', () => {
    const target = setupSnapshot(fixture, 
      { isDataStale: true, isNarrativeStale: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('displays a message when the data has issues', () => {
    const target = setupSnapshot(fixture, { hasDataIssue: true })
    const tree = target.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
