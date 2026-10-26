import { Notice } from '../../components/ContentLayout';
import { config, geocoderHost, mapStyleHost, parkApiHost } from '../../lib/config';

export function PrivacyEn() {
  const { operator } = config;

  return (
    <>
      <h1>Privacy policy</h1>
      <Notice>
        <p>This translation is provided for convenience. Only the German version is legally binding.</p>
      </Notice>

      <h2>1. Controller</h2>
      <p>The controller responsible for data processing on this website within the meaning of the GDPR is:</p>
      <p>
        {operator.name}
        <br />
        {operator.address}
        <br />
        Email: <a href={`mailto:${operator.email}`}>{operator.email}</a>
      </p>

      <h2>2. Principles</h2>
      <p>
        This website is a pure information and map application. It uses no cookies, no analytics or tracking tools and
        no advertising services. There are no user accounts and no forms. Fonts are delivered from our own server; no
        content is loaded from Google or social networks.
      </p>

      <h2>3. Provision of the website and server log files</h2>
      <p>
        When you access the website, the web server processes technically necessary data transmitted by your browser:
        IP address, date and time of access, requested address, amount of data transferred, referrer URL, and browser
        type and operating system. This data is processed solely to deliver the website, to ensure its security and to
        analyse errors, and it is not combined with other data sources. Server log files are deleted after 14 days at
        the latest unless they are needed to investigate a specific security incident.
      </p>
      <p>
        The legal basis is Art. 6 (1) (f) GDPR. Our legitimate interest lies in providing the website securely and
        reliably.
      </p>

      <h2>4. Map display and parking data</h2>
      <p>To display the map and the parking data, your browser loads content directly from the following servers:</p>
      <ul>
        <li>
          <strong>Map tiles, map style and map fonts:</strong> <code>{mapStyleHost}</code>
        </li>
        <li>
          <strong>Parking data (ParkAPI interface and vector tiles):</strong> <code>{parkApiHost}</code>
        </li>
        {geocoderHost && (
          <li>
            <strong>Address and place search (only when typing into the search field, with the text entered and the
            centre of the map section):</strong> <code>{geocoderHost}</code>
          </li>
        )}
      </ul>
      <p>
        In doing so, your IP address and technical information about your browser are transmitted to the respective
        server; the requested map tiles also reveal which map section is displayed. The operators of these servers
        process this data to deliver the content and in server log files as described in section 3. The legal basis is
        Art. 6 (1) (f) GDPR; our legitimate interest lies in a working map display.
      </p>

      <h2>5. Location</h2>
      <p>
        On the map, you can have your location determined with the location button (crosshair icon). This only happens at your
        explicit request and after you have given permission in your browser (Art. 6 (1) (a) GDPR). Your location is
        only used within your browser to move the map there; it is neither transmitted to us nor stored. You can
        withdraw the permission at any time in your browser settings.
      </p>

      <h2>6. Settings stored in your browser</h2>
      <p>
        If you choose a language with the language switcher, this choice is stored in your browser's local storage so
        that the website is shown in this language on your next visit. This information is not transmitted to us. The
        legal basis is § 25 (2) no. 2 TDDDG, as storing it is necessary to provide the function you requested. You can
        delete it at any time via your browser settings.
      </p>

      <h2>7. External links</h2>
      <p>
        This website contains links to other websites, for example to data sources or to the interface documentation.
        When you click them, the privacy policy of the respective provider applies.
      </p>

      <h2>8. Your rights</h2>
      <p>Within the statutory framework, you have the right at any time to:</p>
      <ul>
        <li>access the data stored about you (Art. 15 GDPR),</li>
        <li>rectification of inaccurate data (Art. 16 GDPR),</li>
        <li>erasure (Art. 17 GDPR) and restriction of processing (Art. 18 GDPR),</li>
        <li>data portability (Art. 20 GDPR),</li>
        <li>object to processing based on Art. 6 (1) (f) GDPR (Art. 21 GDPR), and</li>
        <li>withdraw consent with effect for the future (Art. 7 (3) GDPR).</li>
      </ul>
      <p>
        An email to <a href={`mailto:${operator.email}`}>{operator.email}</a> is all it takes to exercise your rights.
        You also have the right to lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), in
        particular in the member state of your habitual residence, place of work or place of the alleged infringement.
      </p>

      <h2>9. No automated decision-making</h2>
      <p>No automated decision-making, including profiling, takes place.</p>
    </>
  );
}
