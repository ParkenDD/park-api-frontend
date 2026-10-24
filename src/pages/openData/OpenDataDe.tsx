import { Link } from 'react-router-dom';

import { Lead, Notice } from '../../components/ContentLayout';
import { SourceTable } from '../../components/SourceTable';
import { routes } from '../../i18n/routes';
import { openApiDocsUrl, openApiSpecUrl, publicApiUrl } from '../../lib/config';
import { exampleParkingSite } from './example';
import { ButtonLink, Endpoints, Fields, Pre, ScrollBox, SecondaryButtonLink } from './styles';

export function OpenDataDe() {
  return (
    <>
      <h1>Open Data</h1>
      <Lead>
        Alle Parkdaten der ParkAPI sind frei zugänglich: ohne Registrierung, ohne API-Schlüssel, über eine offen
        dokumentierte Schnittstelle. Bitte beachten Sie die Lizenzen der jeweiligen Datenquellen.
      </Lead>

      <h2>Was enthalten ist</h2>
      <p>
        ParkAPI führt Daten von Kommunen, Verkehrsverbünden, Parkraumbetreibern und weiteren Datenhaltern zusammen und
        bringt sie in ein einheitliches Datenmodell. Neben Parkhäusern, Tiefgaragen und Parkplätzen gehören dazu
        Park+Ride-Anlagen, Fahrradabstellanlagen und -boxen, Behindertenparkplätze, Lkw-Parkplätze und
        Schließfächer. Viele Anlagen liefern Echtzeitdaten zur Belegung, die je nach Quelle alle paar Minuten oder bei
        jeder Änderung aktualisiert werden. Stammdaten werden täglich abgeglichen.
      </p>

      <h2>Schnittstelle</h2>
      <p>
        Die Schnittstelle ist mit OpenAPI vollständig dokumentiert. Dort finden Sie alle Endpunkte, Parameter, Felder
        und Beispiele und können Anfragen direkt im Browser ausprobieren.
      </p>
      <p>
        <ButtonLink href={openApiDocsUrl}>OpenAPI-Dokumentation</ButtonLink>
        <SecondaryButtonLink href={openApiSpecUrl}>OpenAPI-Spezifikation (JSON)</SecondaryButtonLink>
      </p>
      <p>
        Basis-URL: <code>{publicApiUrl}</code>
      </p>
      <ScrollBox>
        <Endpoints>
          <thead>
            <tr>
              <th>Endpunkt</th>
              <th>Inhalt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>/v3/sources</code>
              </td>
              <td>Alle Datenquellen mit Lizenz, Status und Zeitpunkt der letzten Aktualisierung</td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-sites</code>
              </td>
              <td>
                Parkanlagen mit Stamm- und Echtzeitdaten. Filterbar u. a. nach Quelle, Zweck (<code>purpose</code>) und
                Umkreis (<code>lat</code>, <code>lon</code>, <code>radius</code>) oder Regionalschlüssel (
                <code>official_region_code</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-sites/&#123;id&#125;</code>
              </td>
              <td>Eine einzelne Parkanlage</td>
            </tr>
            <tr>
              <td>
                <code>/v3/parking-spots</code>
              </td>
              <td>Einzelne Stellplätze, z. B. Behindertenparkplätze oder sensorüberwachte Plätze</td>
            </tr>
            <tr>
              <td>
                <code>/v3/tiles/&#123;z&#125;/&#123;x&#125;/&#123;y&#125;.mvt</code>
              </td>
              <td>
                Vektorkacheln (Mapbox Vector Tiles) mit der Ebene <code>parking_sites</code> für Kartenanwendungen –
                diese Karte nutzt sie
              </td>
            </tr>
            <tr>
              <td>
                <code>/datex2/json</code>
              </td>
              <td>Parkanlagen im europäischen Standard DATEX II</td>
            </tr>
            <tr>
              <td>
                <code>/v1</code>, <code>/v2</code>
              </td>
              <td>Kompatibilitätsschnittstellen für Anwendungen, die frühere ParkAPI-Versionen nutzen</td>
            </tr>
          </tbody>
        </Endpoints>
      </ScrollBox>
      <p>
        Listen werden seitenweise ausgeliefert: Die Antwort enthält <code>items</code>, <code>total_count</code> und,
        falls weitere Einträge folgen, einen <code>next_path</code> für die nächste Seite. Die Seitengröße lässt sich
        über <code>limit</code> steuern.
      </p>

      <h2>Datenmodell</h2>
      <p>
        Das Modell ist bewusst schlank: Jede <strong>Parkanlage</strong> (<code>ParkingSite</code>) gehört zu genau
        einer <strong>Datenquelle</strong> (<code>Source</code>). Optional können Parkanlagen einzelne{' '}
        <strong>Stellplätze</strong> (<code>ParkingSpot</code>) enthalten. Die folgende Übersicht nennt die
        wichtigsten Felder; die vollständige Beschreibung enthält die OpenAPI-Dokumentation.
      </p>

      <h3>Source</h3>
      <ScrollBox>
        <Fields>
          <tbody>
            <tr>
              <td>
                <code>uid</code>
              </td>
              <td>Eindeutiger, sprechender Bezeichner der Quelle, z. B. <code>stuttgart_carparks</code></td>
            </tr>
            <tr>
              <td>
                <code>name</code>, <code>public_url</code>
              </td>
              <td>Name der Quelle und Seite mit weiteren Informationen</td>
            </tr>
            <tr>
              <td>
                <code>attribution_license</code>, <code>attribution_contributor</code>, <code>attribution_url</code>
              </td>
              <td>Lizenz und Namensnennung, die bei der Weiterverwendung anzugeben sind</td>
            </tr>
            <tr>
              <td>
                <code>static_status</code>, <code>realtime_status</code>
              </td>
              <td>
                Zustand des letzten Imports: <code>ACTIVE</code>, <code>FAILED</code>, <code>PROVISIONED</code> oder{' '}
                <code>DISABLED</code> (z. B. wenn eine Quelle keine Echtzeitdaten liefert)
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
              <td>ParkAPI-ID, zugehörige Quelle und ID im Ursprungssystem</td>
            </tr>
            <tr>
              <td>
                <code>name</code>, <code>address</code>, <code>operator_name</code>
              </td>
              <td>Name, Adresse und Betreiber</td>
            </tr>
            <tr>
              <td>
                <code>lat</code>, <code>lon</code>, <code>geojson</code>
              </td>
              <td>Position (WGS 84) und optional die Fläche als GeoJSON</td>
            </tr>
            <tr>
              <td>
                <code>purpose</code>
              </td>
              <td>
                Wofür geparkt wird: <code>CAR</code>, <code>BIKE</code>, <code>MOTORCYCLE</code> oder{' '}
                <code>ITEM</code> (Schließfächer)
              </td>
            </tr>
            <tr>
              <td>
                <code>type</code>
              </td>
              <td>
                Bauform, z. B. <code>CAR_PARK</code>, <code>UNDERGROUND</code>, <code>OFF_STREET_PARKING_GROUND</code>,{' '}
                <code>ON_STREET</code>, bei Fahrrädern <code>STANDS</code>, <code>LOCKERS</code>, <code>TWO_TIER</code>{' '}
                u. a.
              </td>
            </tr>
            <tr>
              <td>
                <code>capacity</code>
              </td>
              <td>Gesamtzahl der Stellplätze</td>
            </tr>
            <tr>
              <td>
                <code>has_realtime_data</code>, <code>realtime_free_capacity</code>,{' '}
                <code>realtime_data_updated_at</code>
              </td>
              <td>
                Echtzeitbelegung und Zeitpunkt der letzten Meldung. <code>has_realtime_data</code> ist{' '}
                <code>false</code>, wenn eine Anlage keine Echtzeitdaten liefert oder die letzte Meldung veraltet ist
              </td>
            </tr>
            <tr>
              <td>
                <code>opening_hours</code>, <code>realtime_opening_status</code>
              </td>
              <td>
                Öffnungszeiten im <a href="https://wiki.openstreetmap.org/wiki/Key:opening_hours">OSM-Format</a> und
                aktueller Öffnungsstatus
              </td>
            </tr>
            <tr>
              <td>
                <code>has_fee</code>, <code>fee_description</code>, <code>max_stay</code>, <code>max_height</code>
              </td>
              <td>Gebühren, Höchstparkdauer und Durchfahrtshöhe</td>
            </tr>
            <tr>
              <td>
                <code>park_and_ride_type</code>
              </td>
              <td>Park+Ride-Anbindung, z. B. an Zug, Bus oder Mitfahrgelegenheit</td>
            </tr>
            <tr>
              <td>
                <code>restrictions</code>
              </td>
              <td>
                Stellplätze für bestimmte Gruppen mit eigener Kapazität, z. B. <code>DISABLED</code>,{' '}
                <code>FAMILY</code>, <code>CHARGING</code>, <code>CARSHARING</code>, <code>TRUCK</code>
              </td>
            </tr>
          </tbody>
        </Fields>
      </ScrollBox>

      <h3>ParkingSpot</h3>
      <p>
        Ein einzelner Stellplatz mit Position, optionaler Fläche als GeoJSON, <code>purpose</code>,{' '}
        <code>restrictions</code> und – falls ein Sensor vorhanden ist – <code>realtime_status</code> (
        <code>AVAILABLE</code>, <code>TAKEN</code> oder <code>UNKNOWN</code>).
      </p>

      <h3>Beispiel</h3>
      <Pre>{exampleParkingSite}</Pre>

      <h2 id="sources">Datenquellen und Lizenzen</h2>
      <p>
        Die Daten stammen von den unten aufgeführten Quellen. Für die Weiterverwendung gilt die Lizenz der jeweiligen
        Quelle; ist dort eine Namensnennung vorgesehen, geben Sie bitte den genannten Datengeber an. Die Liste wird live
        aus der Schnittstelle geladen.
      </p>
      <Notice>
        <p>
          Ist für eine Quelle keine Lizenz hinterlegt, klären Sie die Nutzungsbedingungen bitte vor einer
          Weiterverwendung über die verlinkte Seite der Quelle.
        </p>
      </Notice>
      <SourceTable />

      <h2>Auf der Karte ansehen</h2>
      <p>
        Die <Link to={routes.map}>Karte</Link> zeigt alle Parkanlagen mit ihrer aktuellen Belegung.
      </p>
    </>
  );
}
