import { FC, createRef, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';

const styles = StyleSheet.create({
  container: {
    padding: 6,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'blue',
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
    <Pressable
      onPress={expandToSearch}
      style={[styles.container, isExpanded ? styles.expandedStyle : styles.clapsedStyle]}
    >
      {isExpanded ? (
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
