import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import styled from 'styled-components';

import { useLanguage } from '../../i18n/LanguageContext';
import { config } from '../../lib/config';
import { searchPlaces, type Place } from '../../lib/geocoder';

// Photon is meant to be asked while typing, but not on every key stroke.
const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;

const INPUT_HEIGHT = '2.6rem';
/** The space the search takes below the header, which whatever else sits there has to leave free. */
export const PLACE_SEARCH_SPACE = config.geocoderUrl ? `calc(${INPUT_HEIGHT} + 0.5rem)` : '0rem';

const Box = styled.div`
  position: absolute;
  top: calc(${({ theme }) => theme.headerHeight} + 0.75rem);
  left: 0.75rem;
  /* Leaves room for the navigation controls in the top right corner. */
  width: min(360px, calc(100% - 4.5rem));
  z-index: 6;
`;

const Input = styled.input`
  width: 100%;
  height: ${INPUT_HEIGHT};
  padding: 0 2.4rem 0 0.8rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  font: inherit;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadow};

  &::-webkit-search-cancel-button {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Clear = styled.button`
  position: absolute;
  top: 50%;
  right: 0.4rem;
  transform: translateY(-50%);
  width: 1.8rem;
  height: 1.8rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Field = styled.div`
  position: relative;
`;

const List = styled.ul`
  margin: 0.35rem 0 0;
  padding: 0.3rem 0;
  list-style: none;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  font-size: 0.9rem;
`;

const Option = styled.li<{ $active: boolean }>`
  padding: 0.4rem 0.8rem;
  line-height: 1.35;
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};

  small {
    display: block;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Status = styled.li`
  padding: 0.4rem 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
`;

interface PlaceSearchProps {
  /** The centre and zoom of the map, near which places are preferred. */
  getNear: () => { lon: number; lat: number; zoom: number } | undefined;
  onSelect: (place: Place) => void;
  onClear: () => void;
}

type SearchState = { status: 'idle' } | { status: 'done'; places: Place[] } | { status: 'error' };

export function PlaceSearch({ getNear, onSelect, onClear }: PlaceSearchProps) {
  const { language, t } = useLanguage();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Set when the query is the name of the place just picked, which needs no suggestions of its own.
  const pickedRef = useRef(false);
  const getNearRef = useRef(getNear);
  getNearRef.current = getNear;

  useEffect(() => {
    const trimmed = query.trim();
    if (pickedRef.current || trimmed.length < MIN_QUERY_LENGTH) {
      setState({ status: 'idle' });
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      searchPlaces(trimmed, { language, near: getNearRef.current(), signal: controller.signal })
        .then((places) => {
          setState({ status: 'done', places });
          setActiveIndex(-1);
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            console.error(error);
            setState({ status: 'error' });
          }
        });
    }, DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, language]);

  const places = state.status === 'done' ? state.places : [];
  const expanded = open && state.status !== 'idle';

  const select = (place: Place) => {
    pickedRef.current = true;
    setQuery(place.context ? `${place.name}, ${place.context}` : place.name);
    setOpen(false);
    onSelect(place);
  };

  const clear = () => {
    pickedRef.current = false;
    setQuery('');
    onClear();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!places.length) {
        return;
      }
      event.preventDefault();
      setOpen(true);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + step + places.length) % places.length);
    } else if (event.key === 'Enter') {
      // Without a highlighted suggestion, the first one is what was meant.
      const place = places[activeIndex] ?? places[0];
      if (expanded && place) {
        event.preventDefault();
        select(place);
      }
    } else if (event.key === 'Escape') {
      if (expanded) {
        setOpen(false);
      } else if (query) {
        clear();
      }
    }
  };

  return (
    <Box data-testid="place-search">
      <Field>
        <Input
          type="search"
          role="combobox"
          aria-label={t.map.search}
          placeholder={t.map.search}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            pickedRef.current = false;
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <Clear type="button" aria-label={t.map.searchClear} onClick={clear}>
            ×
          </Clear>
        )}
      </Field>
      {expanded && (
        <List id={listId} role="listbox" aria-label={t.map.searchResults}>
          {state.status === 'error' && <Status role="presentation">{t.map.searchError}</Status>}
          {state.status === 'done' && !places.length && <Status role="presentation">{t.map.searchNoResults}</Status>}
          {places.map((place, index) => (
            <Option
              key={place.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              $active={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              // Picked on mouse down, which would otherwise blur the input and so close the list before the click.
              onMouseDown={(event) => {
                event.preventDefault();
                select(place);
              }}
            >
              {place.name}
              {place.context && <small>{place.context}</small>}
            </Option>
          ))}
        </List>
      )}
    </Box>
  );
}
