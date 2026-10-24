import styled from 'styled-components';

export const Benefits = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 0;
  list-style: none;

  li {
    margin: 0;
    padding: 1rem 1.25rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius};
  }

  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`;

export const Timeline = styled.table`
  width: 100%;
  margin: 0 0 1rem;
  border-collapse: collapse;
  font-size: 0.95rem;

  th,
  td {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: top;
  }

  th {
    background: ${({ theme }) => theme.colors.surface};
  }

  td:first-child {
    white-space: nowrap;
    font-weight: 600;
  }
`;
