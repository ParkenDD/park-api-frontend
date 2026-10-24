import { Link } from 'react-router-dom';

import { Lead, Notice } from '../../components/ContentLayout';
import { SourceTable } from '../../components/SourceTable';
import { routes } from '../../i18n/routes';
import { openApiDocsUrl, openApiSpecUrl, publicApiUrl } from '../../lib/config';
import { exampleParkingSite } from './example';
import { ButtonLink, Endpoints, Fields, Pre, ScrollBox, SecondaryButtonLink } from './styles';

export function OpenDataEn() {
  return (
    <>
      <h1>Open Data</h1>
      <Lead>
        All parking data in ParkAPI is freely accessible: no registration, no API key, through an openly documented
        interface. Please observe the licences of the individual data sources.
      </Lead>

      <h2>What is included</h2>
      <p>
        ParkAPI brings together data from municipalities, transport associations, parking operators and other data
        holders and maps it to one uniform data model. Besides multi-storey and underground car parks and surface car
        parks, this includes park and ride facilities, bicycle parking and bike lockers, disabled parking spaces, truck
        parking and lockers. Many facilities provide realtime occupancy data, updated every few minutes or on every
        change, depending on the source. Static data is synchronised daily.
      </p>

      <h2>Interface</h2>
      <p>
        The interface is fully documented with OpenAPI. There you will find all endpoints, parameters, fields and
        examples, and you can try out requests right in your browser.
      </p>
      <p>
        <ButtonLink href={openApiDocsUrl}>OpenAPI documentation</ButtonLink>
        <SecondaryButtonLink href={openApiSpecUrl}>OpenAPI specification (JSON)</SecondaryButtonLink>
      </p>
      <p>
        Base URL: <code>{publicApiUrl}</code>
      </p>
      <ScrollBox>
        <Endpoints>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>/v3/sources</code>
              </td>
              <td>All data sources with licence, status and time of the last update</td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-sites</code>
              </td>
              <td>
                Parking sites with static and realtime data. Can be filtered by source, purpose (<code>purpose</code>),
                radius (<code>lat</code>, <code>lon</code>, <code>radius</code>) or German regional key (
                <code>official_region_code</code>), among others
              </td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-sites/&#123;id&#125;</code>
              </td>
              <td>A single parking site</td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-spots</code>
              </td>
              <td>Individual parking spaces, e.g. disabled parking spaces or spaces monitored by sensors</td>
            </tr>
            <tr>
              <td>
                <code>/v3/tiles/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.mvt</code>
              </td>
              <td>
                Vector tiles (Mapbox Vector Tiles) with the layer <code>parking_sites</code> for map applications – this
                map uses them
              </td>
            </tr>
            <tr>
              <td>
                <code>/datex2/json</code>
              </td>
              <td>Parking sites in the European standard DATEX II</td>
            </tr>
            <tr>
              <td>
                <code>/v1</code>, <code>/v2</code>
              </td>
              <td>Compatibility interfaces for applications built on earlier ParkAPI versions</td>
            </tr>
          </tbody>
        </Endpoints>
      </ScrollBox>
      <p>
        Lists are paginated: the response contains <code>items</code>, <code>total_count</code> and, if more entries
        follow, a <code>next_path</code> for the next page. The page size can be set with <code>limit</code>.
      </p>

      <h2>Data model</h2>
      <p>
        The model is deliberately lean: every <strong>parking site</strong> (<code>ParkingSite</code>) belongs to exactly
        one <strong>data source</strong> (<code>Source</code>). Parking sites may optionally contain individual{' '}
        <strong>parking spots</strong> (<code>ParkingSpot</code>). The overview below lists the most important fields;
        the OpenAPI documentation contains the complete description.
      </p>

      <h3>Source</h3>
      <ScrollBox>
        <Fields>
          <tbody>
            <tr>
              <td>
                <code>uid</code>
              </td>
              <td>
                Unique, human-readable identifier of the source, e.g. <code>stuttgart_carparks</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>name</code>, <code>public_url</code>
              </td>
              <td>Name of the source and a page with further information</td>
            </tr>
            <tr>
              <td>
                <code>attribution_license</code>, <code>attribution_contributor</code>, <code>attribution_url</code>
              </td>
              <td>Licence and attribution to state when reusing the data</td>
            </tr>
            <tr>
              <td>
                <code>static_status</code>, <code>realtime_status</code>
              </td>
              <td>
                State of the last import: <code>ACTIVE</code>, <code>FAILED</code>, <code>PROVISIONED</code> or{' '}
                <code>DISABLED</code> (e.g. if a source provides no realtime data)
              </td>
            </tr>
          </tbody>
        </Fields>
      </ScrollBox>

      <h3>ParkingSite</h3>
      <ScrollBox>
        <Fields>
          <tbody>
            <tr>
              <td>
                <code>id</code>, <code>source_id</code>, <code>original_uid</code>
              </td>
              <td>ParkAPI ID, source, and ID in the originating system</td>
            </tr>
            <tr>
              <td>
                <code>name</code>, <code>address</code>, <code>operator_name</code>
              </td>
              <td>Name, address and operator</td>
            </tr>
            <tr>
              <td>
                <code>lat</code>, <code>lon</code>, <code>geojson</code>
              </td>
              <td>Position (WGS 84) and optionally the area as GeoJSON</td>
            </tr>
            <tr>
              <td>
                <code>purpose</code>
              </td>
              <td>
                What is parked: <code>CAR</code>, <code>BIKE</code>, <code>MOTORCYCLE</code> or <code>ITEM</code>{' '}
                (lockers)
              </td>
            </tr>
            <tr>
              <td>
                <code>type</code>
              </td>
              <td>
                Kind of facility, e.g. <code>CAR_PARK</code>, <code>UNDERGROUND</code>,{' '}
                <code>OFF_STREET_PARKING_GROUND</code>, <code>ON_STREET</code>, for bicycles <code>STANDS</code>,{' '}
                <code>LOCKERS</code>, <code>TWO_TIER</code> and others
              </td>
            </tr>
            <tr>
              <td>
                <code>capacity</code>
              </td>
              <td>Total number of parking spaces</td>
            </tr>
            <tr>
              <td>
                <code>has_realtime_data</code>, <code>realtime_free_capacity</code>,{' '}
                <code>realtime_data_updated_at</code>
              </td>
              <td>
                Realtime occupancy and time of the last update. <code>has_realtime_data</code> is <code>false</code> if a
                facility provides no realtime data or its last update is outdated
              </td>
            </tr>
            <tr>
              <td>
                <code>opening_hours</code>, <code>realtime_opening_status</code>
              </td>
              <td>
                Opening hours in <a href="https://wiki.openstreetmap.org/wiki/Key:opening_hours">OSM format</a> and the
                current opening status
              </td>
            </tr>
            <tr>
              <td>
                <code>has_fee</code>, <code>fee_description</code>, <code>max_stay</code>, <code>max_height</code>
              </td>
              <td>Fees, maximum parking duration and clearance height</td>
            </tr>
            <tr>
              <td>
                <code>park_and_ride_type</code>
              </td>
              <td>Park and ride connection, e.g. to train, bus or carpooling</td>
            </tr>
            <tr>
              <td>
                <code>restrictions</code>
              </td>
              <td>
                Spaces for particular groups with their own capacity, e.g. <code>DISABLED</code>, <code>FAMILY</code>,{' '}
                <code>CHARGING</code>, <code>CARSHARING</code>, <code>TRUCK</code>
              </td>
            </tr>
          </tbody>
        </Fields>
      </ScrollBox>

      <h3>ParkingSpot</h3>
      <p>
        A single parking space with its position, optionally its area as GeoJSON, <code>purpose</code>,{' '}
        <code>restrictions</code> and – if there is a sensor – <code>realtime_status</code> (<code>AVAILABLE</code>,{' '}
        <code>TAKEN</code> or <code>UNKNOWN</code>).
      </p>

      <h3>Example</h3>
      <Pre>{exampleParkingSite}</Pre>

      <h2 id="sources">Data sources and licences</h2>
      <p>
        The data comes from the sources listed below. Reuse is subject to the licence of the respective source; where it
        requires attribution, please name the stated contributor. The list is loaded live from the interface.
      </p>
      <Notice>
        <p>
          If no licence is stated for a source, please clarify the terms of use via the linked page of the source
          before reusing the data.
        </p>
      </Notice>
      <SourceTable />

      <h2>See it on the map</h2>
      <p>
        The <Link to={routes.map}>map</Link> shows all parking sites with their current occupancy.
      </p>
    </>
  );
}
