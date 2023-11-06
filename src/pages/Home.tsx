import React, { FC, createRef, useCallback, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from 'react-native';
import { ETag } from '../entities';
import { globalContext } from '../context/globalContext';
import { Capsule } from '../components/Capsule';
import { NativeEvent } from 'react-native-reanimated/lib/typescript/reanimated2/commonTypes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  listContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 4,
  },
  formContainer: {},
  inputs: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'blue',
  },
});

export const Home: FC = () => {
  const [allTag, setAllTag] = useState<ETag[]>([]);
  const { dbConn } = useContext(globalContext);
  const getAllTag = useCallback(async () => {
    const res = await dbConn?.manager.find(ETag);
    return res || [];
  }, [dbConn?.manager]);

  const inputRef = createRef<TextInput>();

  const [newName, setNewName] = useState<string>('');
  const updateName = useCallback((_e: NativeEvent<TextInputChangeEventData>) => {
    setNewName(_e.nativeEvent.text);
  }, []);
  const addTag = useCallback(() => {
    const newTag = dbConn?.manager.create(ETag, {
      name: newName,
    });
    dbConn?.manager.save(newTag).then(() => {
      getAllTag().then((res) => setAllTag(res));
    });
    inputRef.current?.clear();
  }, [dbConn?.manager, getAllTag, inputRef, newName]);

  useEffect(() => {
    getAllTag().then((res) => {
      console.log('🚀 ~ file: Home.tsx:65 ~ getAllTag ~ res:', res);
      setAllTag(res);
    });
  }, [getAllTag]);

  return (
    <View style={styles.container}>
      {allTag.map((_i) => (
        <Capsule name={_i.name} key={_i.id} toDetail={() => {}} />
      ))}
      <View>
        <View>
          <Text>name</Text>
          <TextInput onChange={updateName} ref={inputRef} />
        </View>
        <Button title="confirm" onPress={addTag} />
      </View>
    </View>
  );
};
