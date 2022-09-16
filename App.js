import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, StatusBar } from 'react-native';
import { API_URL, API_KEY } from'@env';
import {Picker} from '@react-native-picker/picker';

export default function App() {

  const [rate, setRate] = useState("GBP");
  const [exchange, setExchange] = useState([]);
  const [amount, setAmount] = useState("");
  const [value, setValue] = useState("0");
  
  
  const getExchange = () => {
    var myHeaders = new Headers();
    myHeaders.append("apikey", `${API_KEY}`);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    fetch("https://api.apilayer.com/exchangerates_data/latest?&base=EUR", requestOptions)
      .then(response => response.json())
      .then(data => setExchange(data.rates))
      .catch(error => {
        Alert.alert('Error:', error.message);
      });
  }

  useEffect(() => {
    getExchange();
  }, [])

  const convert = () => {
    setValue((parseInt(amount)/exchange[rate]).toFixed(2));
  }

  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 24, fontWeight: "bold" }}>{value} €
      </Text>

      <View style={styles.row}>
        <TextInput style={styles.input}
          placeholder='amount'
          keyboardType='numeric'
          //value={amount}
          onChangeText={text => setAmount(text)} />
        <Picker style={styles.picker}
          mode="dropdown"
          selectedValue={rate}
          onValueChange={(itemValue, itemIndex) =>
            setRate(itemValue)}
        >
          {Object.keys(exchange).map((key)=>
          <Picker.Item label ={key} value={key} key={key}/>)}
        
      </Picker>
      </View>

      <Button title="Convert" onPress={convert} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 100,
  },
  input: {
    fontSize: 18,
    padding: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});