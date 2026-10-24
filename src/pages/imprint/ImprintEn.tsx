import { Notice } from '../../components/ContentLayout';
import { config } from '../../lib/config';
import { OperatorAddress } from './OperatorAddress';

export function ImprintEn() {
  const { operator } = config;

  return (
    <>
      <h1>Imprint</h1>
      <Notice>
        <p>This translation is provided for convenience. Only the German version is legally binding.</p>
      </Notice>

      <h2>Information pursuant to § 5 DDG (German Digital Services Act)</h2>
      <p data-testid="imprint-operator">
        {operator.name}
        <br />
        <OperatorAddress />
      </p>
      {operator.representative && <p>Represented by: {operator.representative}</p>}
      {operator.register && <p>Register entry: {operator.register}</p>}
      {operator.vatId && <p>VAT identification number pursuant to § 27a UStG: {operator.vatId}</p>}

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${operator.email}`}>{operator.email}</a>
        {operator.phone && (
          <>
            <br />
            Phone: {operator.phone}
          </>
        )}
      </p>

      {operator.representative && (
        <>
          <h2>Responsible for the content pursuant to § 18 (2) MStV</h2>
          <p>{operator.representative}, address as above</p>
        </>
      )}

      <h2>Liability for content and data</h2>
      <p>
        The parking data shown on this website comes from third parties and is imported automatically. No guarantee is
        given for its correctness, completeness or timeliness, in particular of the realtime data. The information on
        site is authoritative.
      </p>

      <h2>Liability for links</h2>
      <p>
        This website contains links to external third-party websites whose content we have no influence on. The
        respective provider is always responsible for the content of linked pages. Should we become aware of any legal
        infringements, we will remove such links immediately.
      </p>

      <h2>Consumer dispute resolution</h2>
      <p>We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.</p>

      <h2>Map data</h2>
      <p>
        Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, map style ©{' '}
        <a href="https://openmaptiles.org/">OpenMapTiles</a>. The parking data is subject to the licences of the
        respective data sources.
      </p>
    </>
  );
}
