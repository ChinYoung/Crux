import { FC, createRef, useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

const styles = StyleSheet.create({
  debug: {
    borderColor: 'blue',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  searchInputContainer: {
    borderRadius: 5,
    borderStyle: 'solid',
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  expandedStyle: {
    padding: 6,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    width: '100%',
  },
});

export const SearchInput: FC<{ onFocus: () => void; onFold: () => void; isExpanded: boolean }> = ({
  onFocus,
  onFold,
  isExpanded,
}) => {
  console.log('🚀 ~ isExpanded:', isExpanded);
  const inputRef = createRef<TextInput>();
  // const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const foldSearch = useCallback(() => {
    // setIsExpanded(false);
    onFold();
  }, [onFold]);

  const expandToSearch = useCallback(() => {
    // setIsExpanded(true);
    onFocus();
  }, [onFocus]);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [inputRef, isExpanded]);
  return (
    <View style={[styles.searchInputContainer, isExpanded ? styles.expandedStyle : null]}>
      {isExpanded ? (
        <TextInput
          ref={inputRef}
          placeholder="input to search"
          style={[styles.searchInput]}
          onBlur={foldSearch}
        />
      ) : (
        <Pressable onPress={expandToSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </Pressable>
      )}
    </View>
  );
};
