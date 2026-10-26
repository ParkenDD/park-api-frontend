import { config, geocoderHost, mapStyleHost, parkApiHost } from '../../lib/config';

export function PrivacyDe() {
  const { operator } = config;

  return (
    <>
      <h1>Datenschutzerklärung</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO)
        ist:
      </p>
      <p>
        {operator.name}
        <br />
        {operator.address}
        <br />
        E-Mail: <a href={`mailto:${operator.email}`}>{operator.email}</a>
      </p>

      <h2>2. Grundsätze</h2>
      <p>
        Diese Website ist eine reine Informations- und Kartenanwendung. Sie verwendet keine Cookies, keine
        Analyse- oder Tracking-Werkzeuge und keine Werbedienste. Es gibt keine Benutzerkonten und keine Formulare.
        Schriftarten werden von unserem eigenen Server ausgeliefert; es werden keine Inhalte von Google oder sozialen
        Netzwerken nachgeladen.
      </p>

      <h2>3. Bereitstellung der Website und Server-Logdateien</h2>
      <p>
        Beim Aufruf der Website verarbeitet der Webserver technisch notwendige Daten, die Ihr Browser übermittelt:
        IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Adresse, übertragene Datenmenge, Referrer-URL sowie
        Browsertyp und Betriebssystem. Diese Daten werden ausschließlich zur Auslieferung der Website, zur
        Gewährleistung der Sicherheit und zur Fehleranalyse verarbeitet und nicht mit anderen Datenquellen
        zusammengeführt. Server-Logdateien werden nach spätestens 14 Tagen gelöscht, sofern sie nicht zur Aufklärung
        eines konkreten Sicherheitsvorfalls benötigt werden.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der sicheren und
        stabilen Bereitstellung der Website.
      </p>

      <h2>4. Kartendarstellung und Parkdaten</h2>
      <p>
        Für die Darstellung der Karte und der Parkdaten lädt Ihr Browser Inhalte direkt von folgenden Servern nach:
      </p>
      <ul>
        <li>
          <strong>Kartenkacheln, Kartenstil und Schriften der Karte:</strong> <code>{mapStyleHost}</code>
        </li>
        <li>
          <strong>Parkdaten (Schnittstelle und Vektorkacheln der ParkAPI):</strong> <code>{parkApiHost}</code>
        </li>
        {geocoderHost && (
          <li>
            <strong>Adress- und Ortssuche (nur bei Eingabe in das Suchfeld, mit dem eingegebenen Text und dem
            Mittelpunkt des Kartenausschnitts):</strong> <code>{geocoderHost}</code>
          </li>
        )}
      </ul>
      <p>
        Dabei werden Ihre IP-Adresse sowie technische Angaben Ihres Browsers an den jeweiligen Server übermittelt;
        anhand der angefragten Kartenkacheln ist außerdem erkennbar, welcher Kartenausschnitt angezeigt wird. Die
        Betreiber dieser Server verarbeiten diese Daten zur Auslieferung der Inhalte und in Server-Logdateien
        entsprechend Abschnitt 3. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in
        einer funktionsfähigen Kartendarstellung.
      </p>

      <h2>5. Standortbestimmung</h2>
      <p>
        Auf der Karte können Sie über die Standort-Schaltfläche (Fadenkreuz-Symbol) Ihren Standort bestimmen lassen. Dies
        geschieht nur auf Ihre ausdrückliche Anforderung und nach Zustimmung in Ihrem Browser (Art. 6 Abs. 1 lit. a
        DSGVO). Der Standort wird ausschließlich in Ihrem Browser verwendet, um die Karte dorthin zu bewegen, und nicht
        an uns übermittelt oder gespeichert. Sie können die Freigabe jederzeit in den Einstellungen Ihres Browsers
        widerrufen.
      </p>

      <h2>6. Im Browser gespeicherte Einstellungen</h2>
      <p>
        Wenn Sie über die Sprachauswahl eine Sprache wählen, wird diese Wahl im lokalen Speicher (Local Storage) Ihres
        Browsers abgelegt, damit die Website beim nächsten Besuch in dieser Sprache erscheint. Diese Information wird
        nicht an uns übertragen. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG, da die Speicherung für die von Ihnen
        gewünschte Funktion erforderlich ist. Sie können sie jederzeit über die Einstellungen Ihres Browsers löschen.
      </p>

      <h2>7. Externe Links</h2>
      <p>
        Diese Website enthält Links zu anderen Websites, etwa zu Datenquellen oder zur Schnittstellendokumentation.
        Beim Anklicken gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </p>

      <h2>8. Ihre Rechte</h2>
      <p>Sie haben im Rahmen der gesetzlichen Vorgaben jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>
          Widerspruch gegen Verarbeitungen, die auf Art. 6 Abs. 1 lit. f DSGVO beruhen (Art. 21 DSGVO), sowie
        </li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
      </ul>
      <p>
        Zur Ausübung Ihrer Rechte genügt eine E-Mail an <a href={`mailto:${operator.email}`}>{operator.email}</a>.
        Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO),
        insbesondere in dem Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
        Verstoßes.
      </p>

      <h2>9. Keine automatisierte Entscheidungsfindung</h2>
      <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt.</p>
    </>
  );
}
