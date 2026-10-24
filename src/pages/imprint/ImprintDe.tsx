import { config } from '../../lib/config';
import { OperatorAddress } from './OperatorAddress';

export function ImprintDe() {
  const { operator } = config;

  return (
    <>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p data-testid="imprint-operator">
        {operator.name}
        <br />
        <OperatorAddress />
      </p>
      {operator.representative && <p>Vertreten durch: {operator.representative}</p>}
      {operator.register && <p>Registereintrag: {operator.register}</p>}
      {operator.vatId && <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {operator.vatId}</p>}

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${operator.email}`}>{operator.email}</a>
        {operator.phone && (
          <>
            <br />
            Telefon: {operator.phone}
          </>
        )}
      </p>

      {operator.representative && (
        <>
          <h2>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h2>
          <p>
            {operator.representative}, Anschrift wie oben
          </p>
        </>
      )}

      <h2>Haftung für Inhalte und Daten</h2>
      <p>
        Die auf dieser Website dargestellten Parkdaten stammen von Dritten und werden automatisiert übernommen. Für
        Richtigkeit, Vollständigkeit und Aktualität insbesondere der Echtzeitdaten wird keine Gewähr übernommen. Die
        Angaben vor Ort sind maßgeblich.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die
        Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Kartendaten</h2>
      <p>
        Kartendaten © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>, Kartenstil ©{' '}
        <a href="https://openmaptiles.org/">OpenMapTiles</a>. Die Parkdaten unterliegen den Lizenzen der jeweiligen
        Datenquellen.
      </p>
    </>
  );
}
