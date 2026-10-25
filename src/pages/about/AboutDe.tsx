import { Link } from 'react-router-dom';

import { Lead, Notice } from '../../components/ContentLayout';
import { routes } from '../../i18n/routes';
import { Benefits, Timeline } from './styles';

export function AboutDe() {
  return (
    <>
      <h1>Parkdaten offen bereitstellen – einfach und standardkonform</h1>
      <Lead>
        ParkAPI ist eine offene Datendrehscheibe für Parkplätze von Autos, Fahrrädern und Motorrädern. Sie sammelt
        Stamm- und Echtzeitdaten von Kommunen, Verkehrsverbünden und Parkraumbetreibern, vereinheitlicht sie und stellt
        sie als Open Data für Navigation, Reiseauskunft und Verkehrsplanung zur Verfügung.
      </Lead>

      <h2>Warum Parkdaten veröffentlichen?</h2>
      <p>
        Ein großer Teil des innerstädtischen Verkehrs ist Parksuchverkehr. Wer schon vor der Abfahrt weiß, wo ein freier
        Platz wartet, fährt direkt dorthin – oder entscheidet sich gleich für Park+Ride, das Fahrrad oder den ÖPNV.
        Davon profitieren alle Beteiligten:
      </p>
      <Benefits>
        <li>
          <strong>Kommunen und Behörden</strong>
          Weniger Parksuchverkehr, weniger Lärm und Emissionen, bessere Grundlage für Verkehrsplanung und
          Parkraummanagement – und ein einfacher Weg, gesetzliche Bereitstellungspflichten zu erfüllen.
        </li>
        <li>
          <strong>Parkhaus- und Parkraumbetreiber</strong>
          Ihre Anlagen erscheinen dort, wo Kundschaft sucht: in Navigationsgeräten, Karten-Apps, Reiseauskünften und
          auf Verkehrsportalen. Freie Kapazitäten werden sichtbar und besser ausgelastet.
        </li>
        <li>
          <strong>Verkehrsverbünde</strong>
          Park+Ride- und Bike+Ride-Anlagen werden in der Reiseauskunft auffindbar und machen den Umstieg auf Bus und
          Bahn planbar.
        </li>
        <li>
          <strong>Bürgerinnen und Bürger</strong>
          Verlässliche Informationen zu Lage, Kapazität, Öffnungszeiten, Gebühren, Höhenbeschränkungen und
          barrierefreien Stellplätzen – unabhängig davon, welche App sie nutzen.
        </li>
      </Benefits>

      <h2>Einmal liefern, überall nutzbar</h2>
      <p>
        Datenabnehmer wollen ein einheitliches Format, Datenhalter haben ihre Daten meist in einem ganz anderen: im
        Parkleitsystem, in einer Herstellerschnittstelle, in einer Excel-Tabelle. ParkAPI schließt diese Lücke. Sie
        müssen keine eigene Schnittstelle entwickeln und betreiben – ParkAPI nimmt Ihre Daten so entgegen, wie sie
        vorliegen:
      </p>
      <ul>
        <li>
          <strong>Abruf (Pull):</strong> ParkAPI fragt bestehende Schnittstellen regelmäßig ab – Echtzeitdaten alle
          fünf Minuten, Stammdaten täglich. Viele gängige Systeme von Parkleitsystem-, Sensor- und
          Parkraumbewirtschaftungsanbietern werden bereits unterstützt.
        </li>
        <li>
          <strong>Zulieferung (Push):</strong> Ihr System sendet Änderungen direkt an ParkAPI, sobald sie anfallen – als
          JSON, XML, CSV oder Excel. So entsteht die bestmögliche Aktualität.
        </li>
        <li>
          <strong>Tabellen:</strong> Für reine Stammdaten genügt oft eine gepflegte Excel- oder CSV-Tabelle mit Lage,
          Kapazität und Eigenschaften der Anlagen.
        </li>
      </ul>
      <p>
        Auf der Ausgabeseite stehen die Daten über eine dokumentierte, offene REST-Schnittstelle, als Vektorkacheln für
        Karten und im europäischen Standard <strong>DATEX II</strong> bereit. Damit können Ihre Daten in die{' '}
        <a href="https://mobilithek.info">Mobilithek</a>, den Nationalen Zugangspunkt für Mobilitätsdaten, und in
        Landesplattformen wie <a href="https://www.mobidata-bw.de">MobiData BW</a> einfließen.
      </p>

      <h2>Rechtlicher Rahmen: Bereitstellung ist Pflicht</h2>
      <p>
        Die Bereitstellung von Parkdaten ist nicht mehr nur eine freiwillige Serviceleistung. Auf Grundlage der
        europäischen IVS-Richtlinie (Richtlinie 2010/40/EU, zuletzt geändert durch Richtlinie (EU) 2023/2661) hat die
        EU-Kommission verbindliche Vorgaben erlassen, die unmittelbar in allen Mitgliedstaaten gelten.
      </p>

      <h3>Delegierte Verordnung (EU) 2017/1926 in der Fassung der Verordnung (EU) 2024/490</h3>
      <p>
        Die Verordnung über EU-weite multimodale Reiseinformationsdienste verpflichtet <em>Datenhalter</em> –
        ausdrücklich genannt werden unter anderem Verkehrsbehörden, Verkehrsbetreiber, Infrastrukturbetreiber und{' '}
        <em>Parkraumbetreiber</em> – vorhandene Parkdaten über den Nationalen Zugangspunkt zugänglich zu machen. Das gilt
        für Daten, die bereits in digitaler, maschinenlesbarer Form vorliegen, und zwar unabhängig davon, ob sie
        anderswo schon veröffentlicht sind. Die Pflichten greifen gestaffelt:
      </p>
      <Timeline>
        <thead>
          <tr>
            <th>Frist</th>
            <th>Daten</th>
            <th>Geltungsbereich</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Dezember 2023</td>
            <td>Wo und wie für das Parken bezahlt werden kann</td>
            <td>gesamtes Verkehrsnetz der Union</td>
          </tr>
          <tr>
            <td>1. Dezember 2024</td>
            <td>Lage von Parkplätzen (im Straßenraum und abseits davon), einschließlich barrierefreier Stellplätze</td>
            <td>gesamtes Verkehrsnetz der Union</td>
          </tr>
          <tr>
            <td>1. Dezember 2025</td>
            <td>Parktarife</td>
            <td>gesamtes Verkehrsnetz der Union</td>
          </tr>
          <tr>
            <td>1. Dezember 2026</td>
            <td>Dynamische Daten: aktuelle Tarife, Verfügbarkeit und Lage freier Pkw-Stellplätze</td>
            <td>Gesamtnetz des TEN-V</td>
          </tr>
          <tr>
            <td>1. Dezember 2028</td>
            <td>Dynamische Daten: aktuelle Tarife, Verfügbarkeit und Lage freier Pkw-Stellplätze</td>
            <td>übriges Verkehrsnetz der Union</td>
          </tr>
        </tbody>
      </Timeline>
      <p>
        Als Format nennt die Verordnung DATEX II oder ein nachweislich vollständig kompatibles Format – Konverter sind
        dabei ausdrücklich zulässig. Genau diese Rolle übernimmt ParkAPI.
      </p>
      <p>
        Mit der Änderung von 2024 sind die Parkdaten aus der Delegierten Verordnung (EU) 2022/670 (Echtzeit-
        Verkehrsinformationen) in diese Verordnung gewandert. Für die Weiterverwendung legt Artikel 8 fest: Die Daten
        müssen allen Nutzenden diskriminierungsfrei zugänglich sein, und Reiseinformationsdienste müssen sie neutral
        darstellen. Datenhalter dürfen die Nutzung über Lizenzvereinbarungen regeln, diese müssen die Weiterverwendung
        aber so wenig wie möglich einschränken. Ein Entgelt erlaubt das EU-Recht nur in angemessener Höhe, begrenzt
        auf die Kosten für Bereitstellung und Verbreitung. In Deutschland ist die Bereitstellung über den Nationalen
        Zugangspunkt allerdings unentgeltlich (siehe unten).
      </p>

      <h3>Delegierte Verordnung (EU) Nr. 885/2013: Lkw-Parkplätze</h3>
      <p>
        Für sichere und gesicherte Lkw-Parkplätze am transeuropäischen Straßennetz sind statische Informationen und,
        soweit vorhanden, dynamische Belegungsdaten bereitzustellen.
      </p>

      <h3>Nationale Umsetzung: Intelligente-Verkehrssysteme-Gesetz (IVSG)</h3>
      <p>
        In Deutschland setzt das neu gefasste Intelligente-Verkehrssysteme-Gesetz vom 15. Mai 2026 (BGBl. 2026 I
        Nr. 148) die geänderte IVS-Richtlinie um. Die Regelungen des früher geplanten Mobilitätsdatengesetzes sind darin
        aufgegangen. Das Gesetz verpflichtet die Datenhalter, ihre Daten nach den genannten EU-Verordnungen über den
        Nationalen Zugangspunkt bereitzustellen; das ist die <a href="https://mobilithek.info">Mobilithek</a> des
        Bundesministeriums für Verkehr. Die Bereitstellung darf auch über einen Datenmittler wie ParkAPI oder ein
        Landessystem erfolgen. Für die Nutzung gilt (§ 8 IVSG):
      </p>
      <ul>
        <li>
          <strong>Unentgeltlich:</strong> Bereitstellung und Nutzung der Daten über den Nationalen Zugangspunkt sind
          kostenlos. Damit geht Deutschland bewusst über das EU-Recht hinaus, das ein kostenbasiertes Entgelt zulassen
          würde.
        </li>
        <li>
          <strong>Für jeden Zweck:</strong> Die Daten dürfen kommerziell und nichtkommerziell genutzt werden. Die
          Nutzungsbedingungen müssen transparent und nichtdiskriminierend sein.
        </li>
        <li>
          <strong>Lizenzen:</strong> Datenhalter können die Nutzungsbedingungen über Lizenzen regeln. Welche
          Standardlizenzen dabei zu verwenden sind, legt eine Rechtsverordnung fest.
        </li>
        <li>
          <strong>Registrierung:</strong> Datenhalter können verlangen, dass sich Nutzende registrieren und den
          Nutzungszweck angeben. Diese Vorgabe gilt dann für alle Nutzenden gleichermaßen. Ein offenes Angebot ohne
          Registrierung bleibt möglich.
        </li>
      </ul>

      <h3>Open Data für öffentliche Stellen</h3>
      <p>
        Unabhängig von den Mobilitätsvorgaben gelten für öffentliche Stellen die allgemeinen Open-Data-Regeln. Sie
        begründen allerdings nicht automatisch eine Pflicht, Parkdaten zu veröffentlichen:
      </p>
      <ul>
        <li>
          <strong>Datennutzungsgesetz (DNG):</strong> Es setzt die europäische Open-Data-Richtlinie (EU) 2019/1024 um und
          regelt die Bedingungen, wenn öffentliche Stellen Daten bereitstellen – grundsätzlich unentgeltlich und
          diskriminierungsfrei. Eine Pflicht zur Veröffentlichung begründet es selbst nicht.
        </li>
        <li>
          <strong>Hochwertige Datensätze:</strong> Die Durchführungsverordnung (EU) 2023/138 schreibt für bestimmte
          Datensätze eine kostenlose Bereitstellung unter offener Lizenz vor. Die Kategorie Mobilität umfasst dort aber
          vor allem Verkehrsnetzdaten nach INSPIRE, keine Belegungsdaten von Parkplätzen.
        </li>
        <li>
          <strong>Open-Data-Regeln von Bund und Ländern:</strong> Für Bundesbehörden gilt § 12a E-Government-Gesetz. Die
          Länder regeln das unterschiedlich und meist nur für ihre eigenen Behörden. In Bayern etwa verpflichtet Art. 14
          des Bayerischen Digitalgesetzes die staatlichen Behörden, nicht aber die Kommunen. Baden-Württemberg hat bislang
          keine allgemeine Open-Data-Pflicht.
        </li>
      </ul>
      <p>
        Für Parkdaten ist deshalb meist das IVSG maßgeblich: Es gilt für öffentliche und private Datenhalter
        gleichermaßen und macht die Bereitstellung über den Nationalen Zugangspunkt verpflichtend und unentgeltlich.
      </p>

      <Notice>
        <p>
          Diese Übersicht dient der Orientierung und ersetzt keine Rechtsberatung. Welche Pflichten im Einzelfall
          gelten, hängt unter anderem von Ihrer Rolle als Datenhalter, der Lage der Anlagen im Verkehrsnetz und den
          vorhandenen Daten ab. Maßgeblich sind die Rechtstexte in ihrer jeweils aktuellen Fassung, etwa auf{' '}
          <a href="https://eur-lex.europa.eu/eli/reg_del/2017/1926/oj">EUR-Lex</a>.
        </p>
      </Notice>

      <h2>Offen und unabhängig</h2>
      <p>
        ParkAPI ist Open-Source-Software unter MIT-Lizenz. Der Quellcode der{' '}
        <a href="https://github.com/ParkenDD/park-api-v3">Plattform</a> und der{' '}
        <a href="https://github.com/ParkenDD/parkapi-sources-v3">Datenkonverter</a> ist öffentlich einsehbar; neue
        Datenquellen lassen sich ohne Abhängigkeit von einem einzelnen Anbieter anbinden. Die Plattform wird produktiv
        unter anderem von MobiData BW, der Mobilitätsdatenplattform des Landes Baden-Württemberg, betrieben.
      </p>

      <h2>Mitmachen</h2>
      <p>
        Sie möchten Ihre Parkdaten bereitstellen oder eine bestehende Schnittstelle anbinden lassen? Wir unterstützen
        Sie bei der Auswahl des passenden Weges – vom Excel-Export bis zur Echtzeit-Schnittstelle. Wie die Daten
        anschließend aussehen und genutzt werden können, zeigt die Seite <Link to={routes.openData}>Open Data</Link>. Kontakt
        finden Sie im <Link to={routes.imprint}>Impressum</Link>.
      </p>
    </>
  );
}
