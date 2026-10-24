import styled from 'styled-components';

export const Endpoints = styled.table`
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
  }
`;

export const Fields = styled(Endpoints)`
  td:first-child {
    width: 40%;
    white-space: normal;
  }

  td:first-child code {
    font-weight: 600;
  }
`;

export const ScrollBox = styled.div`
  overflow-x: auto;
`;

export const Pre = styled.pre`
  overflow-x: auto;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.85rem;
  line-height: 1.5;
`;

export const ButtonLink = styled.a`
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
  padding: 0.55rem 1.1rem;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: #fff;
  }
`;

export const SecondaryButtonLink = styled(ButtonLink)`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;
