import { config } from '../../lib/config';

// The address is configured as one line; the imprint shows it as a postal address, one line per comma.
export function OperatorAddress() {
  return (
    <>
      {config.operator.address.split(',').map((line, index) => (
        <span key={index}>
          {index > 0 && <br />}
          {line.trim()}
        </span>
      ))}
    </>
  );
}
