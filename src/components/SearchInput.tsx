import { FC, createRef, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { LIGHT_DEFAULT_COLOR } from '../theme/color';

const styles = StyleSheet.create({
  container: {
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: LIGHT_DEFAULT_COLOR.button.postive,
    paddingHorizontal: 8,
    width: '100%',
  },
  expandedStyle: {
    width: '100%',
  },
  clapsedStyle: {
    width: 40,
  },
  searchInput: {
    width: '100%',
    height: '100%',
  },
});

export const SearchInput: FC<{ onFocus: () => void; onFold: () => void; isSearch: boolean }> = ({
  onFocus,
  onFold,
  isSearch,
}) => {
  const inputRef = createRef<TextInput>();

  const foldSearch = useCallback(() => {
    onFold();
  }, [onFold]);

  const expandToSearch = useCallback(() => {
    onFocus();
  }, [onFocus]);

  useEffect(() => {
    if (isSearch) {
      inputRef.current?.focus();
    }
  }, [inputRef, isSearch]);
  return (
    <Pressable onPress={expandToSearch} style={[styles.container]}>
      {isSearch ? (
        <TextInput
          ref={inputRef}
          placeholder="input to search"
          style={[styles.searchInput]}
          onBlur={foldSearch}
        />
      ) : (
        <FontAwesomeIcon icon={faSearch} />
      )}
    </Pressable>
  );
};
