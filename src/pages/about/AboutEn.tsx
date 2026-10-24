import { Link } from 'react-router-dom';

import { Lead, Notice } from '../../components/ContentLayout';
import { routes } from '../../i18n/routes';
import { Benefits, Timeline } from './styles';

export function AboutEn() {
  return (
    <>
      <h1>Publish parking data openly – simple and standards-compliant</h1>
      <Lead>
        ParkAPI is an open data hub for parking for cars, bicycles and motorcycles. It collects static and realtime
        data from municipalities, transport associations and parking operators, harmonises it and makes it available as
        open data for navigation, journey planning and transport planning.
      </Lead>

      <h2>Why publish parking data?</h2>
      <p>
        A considerable share of inner-city traffic is drivers looking for a parking space. Anyone who knows before
        setting off where a free space is waiting drives straight there – or opts for park and ride, the bicycle or
        public transport right away. Everybody involved benefits:
      </p>
      <Benefits>
        <li>
          <strong>Municipalities and authorities</strong>
          Less traffic searching for parking, less noise and fewer emissions, a better basis for transport planning and
          parking management – and a simple way to meet statutory obligations to provide data.
        </li>
        <li>
          <strong>Car park and parking operators</strong>
          Your facilities show up where customers are looking: in navigation systems, map apps, journey planners and
          traffic portals. Free capacity becomes visible and is used better.
        </li>
        <li>
          <strong>Transport associations</strong>
          Park and ride and bike and ride facilities become part of the journey planner and make switching to bus and
          rail something people can plan.
        </li>
        <li>
          <strong>Citizens</strong>
          Reliable information on location, capacity, opening hours, fees, height restrictions and accessible parking
          spaces – whichever app they use.
        </li>
      </Benefits>

      <h2>Deliver once, use everywhere</h2>
      <p>
        Data users want one uniform format, data holders usually have their data in a quite different one: in the
        parking guidance system, in a vendor interface, in a spreadsheet. ParkAPI closes this gap. You do not have to
        develop and run an interface of your own – ParkAPI accepts your data the way it already exists:
      </p>
      <ul>
        <li>
          <strong>Pull:</strong> ParkAPI queries existing interfaces regularly – realtime data every five minutes,
          static data daily. Many common systems of parking guidance, sensor and parking management vendors are already
          supported.
        </li>
        <li>
          <strong>Push:</strong> your system sends changes to ParkAPI as soon as they happen – as JSON, XML, CSV or
          Excel. This gives the best possible timeliness.
        </li>
        <li>
          <strong>Spreadsheets:</strong> for static data, a maintained Excel or CSV table with the location, capacity
          and properties of the facilities is often enough.
        </li>
      </ul>
      <p>
        On the output side, the data is available through a documented, open REST interface, as vector tiles for maps
        and in the European standard <strong>DATEX II</strong>. This allows your data to flow into the{' '}
        <a href="https://mobilithek.info">Mobilithek</a>, Germany's National Access Point for mobility data, and into
        regional platforms such as <a href="https://www.mobidata-bw.de">MobiData BW</a>.
      </p>

      <h2>Legal framework: providing data is mandatory</h2>
      <p>
        Providing parking data is no longer just a voluntary service. Based on the European ITS Directive (Directive
        2010/40/EU, most recently amended by Directive (EU) 2023/2661), the European Commission has adopted binding
        rules that apply directly in all member states.
      </p>

      <h3>Delegated Regulation (EU) 2017/1926 as amended by Regulation (EU) 2024/490</h3>
      <p>
        The regulation on EU-wide multimodal travel information services obliges <em>data holders</em> – explicitly
        including transport authorities, transport operators, infrastructure managers and <em>parking operators</em> –
        to make their existing parking data accessible through the National Access Point. This applies to data that
        already exists in a digital, machine-readable form, regardless of whether it has already been published
        elsewhere. The obligations apply in stages:
      </p>
      <Timeline>
        <thead>
          <tr>
            <th>Deadline</th>
            <th>Data</th>
            <th>Scope</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 December 2023</td>
            <td>Where and how to pay for parking</td>
            <td>entire transport network of the Union</td>
          </tr>
          <tr>
            <td>1 December 2024</td>
            <td>Location of parking places (on and off street), including accessible parking places</td>
            <td>entire transport network of the Union</td>
          </tr>
          <tr>
            <td>1 December 2025</td>
            <td>Parking tariffs</td>
            <td>entire transport network of the Union</td>
          </tr>
          <tr>
            <td>1 December 2026</td>
            <td>Dynamic data: current tariffs, availability and location of free car parking spaces</td>
            <td>comprehensive TEN-T network</td>
          </tr>
          <tr>
            <td>1 December 2028</td>
            <td>Dynamic data: current tariffs, availability and location of free car parking spaces</td>
            <td>other parts of the Union transport network</td>
          </tr>
        </tbody>
      </Timeline>
      <p>
        As the format, the regulation names DATEX II or a format proven to be fully compatible with it – converters are
        explicitly permitted. This is exactly the role ParkAPI takes on.
      </p>

      <h3>Delegated Regulation (EU) No 885/2013: truck parking</h3>
      <p>
        For safe and secure truck parking areas on the trans-European road network, static information and, where
        available, dynamic occupancy data has to be provided.
      </p>

      <h3>National implementation and open data</h3>
      <p>
        In Germany, the <a href="https://mobilithek.info">Mobilithek</a> is the National Access Point. The planned
        Mobility Data Act (Mobilitätsdatengesetz) and the implementation of the amended ITS Directive make the framework
        more binding still. For public bodies, the principles of the Data Use Act (Datennutzungsgesetz) and – depending
        on the level of government – the open data rules of the federal government and the federal states apply as
        well: data collected with public money should be openly available for reuse in machine-readable form.
      </p>

      <Notice>
        <p>
          This overview is meant for orientation and is not legal advice. Which obligations apply in a particular case
          depends, among other things, on your role as a data holder, where your facilities are located in the
          transport network and which data you hold. The legal texts in their current version are authoritative, for
          example on <a href="https://eur-lex.europa.eu/eli/reg_del/2017/1926/oj">EUR-Lex</a>.
        </p>
      </Notice>

      <h2>Open and independent</h2>
      <p>
        ParkAPI is open source software under the MIT licence. The source code of the{' '}
        <a href="https://github.com/ParkenDD/park-api-v3">platform</a> and of the{' '}
        <a href="https://github.com/ParkenDD/parkapi-sources-v3">data converters</a> is public; new data sources can be
        connected without depending on a single vendor. Among others, the platform is run in production by MobiData BW,
        the mobility data platform of the state of Baden-Württemberg.
      </p>

      <h2>Get involved</h2>
      <p>
        Would you like to provide your parking data or have an existing interface connected? We help you choose the
        right way – from an Excel export to a realtime interface. What the data looks like afterwards and how it can be
        used is shown on the <Link to={routes.openData}>Open Data</Link> page. You will find contact details in the{' '}
        <Link to={routes.imprint}>imprint</Link>.
      </p>
    </>
  );
}
