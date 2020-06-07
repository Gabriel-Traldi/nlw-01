import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, ImageBackground, View, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface Select {
  id: string;
  label: string;
  value: string;
}

const Home: React.FC = () => {

  const [ufs, setUfs] = useState<Select[]>([]);
  const [cities, setCities] = useState<Select[]>([]);
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const naviagation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
          const ufInitials = response.data.map(uf => ({ id: uf.sigla, label: uf.sigla, value: uf.sigla}));
          setUfs(ufInitials);
      })
      .catch(err => console.error('error', err));
  }, []);

  useEffect(() => {
    if(uf === '') {
      return;
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
          const cityNames = response.data.map(city => ({ id: city.nome, label: city.nome, value: city.nome}));
          setCities(cityNames);
      })
      .catch(err => console.error('error', err));
  }, [uf]);

  function handleNavigateToPoints() {
    naviagation.navigate('Points', {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
       >

      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
        </View>
      </View>

      <View style={styles.footer}>

        <RNPickerSelect
          style={{
            inputAndroid: styles.input,
            inputIOS: styles.input,
          }}
          placeholder={{ label: 'Selecione uma uf'}}
          onValueChange={setUf}
          itemKey="id"
          items={
            [...ufs]
          }
        />

        <RNPickerSelect
          style={{
            inputAndroid: styles.input,
            inputIOSContainer: styles.input,
          }}
          itemKey="id"
          placeholder={{ label: 'Selecione uma cidade'}}
          onValueChange={setCity}
          items={
            [...cities]
          }
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
        </RectButton>
      </View>

    </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#fff',
    color: 'black',
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;