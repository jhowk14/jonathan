import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import { MaterialCommunityIcons, MaterialIcons, Entypo } from "@expo/vector-icons";
import axios from 'axios';
import { Buffer } from 'buffer'; // Import the Buffer object from the buffer module

export default function Empresa() {
  const [empresa, setEmpresa] = useState(null);
  const [logoSource, setLogoSource] = useState(null);
  const [logoSourceBG, setLogoSourceBG] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.0.188:3001/empresa/bella-capri`);
        const data = await response.json();
        setEmpresa(data);

        // Convert Buffer data to base64-encoded string using the Buffer constructor
        const base64StringLogo = `data:image/png;base64,${Buffer.from(data.EmprLogotipo.data).toString('base64')}`;
        const base64StringBG= `data:image/png;base64,${Buffer.from(data.EmprImagemCabecalho.data).toString('base64')}`;
        setLogoSourceBG(base64StringBG)
        setLogoSource(base64StringLogo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const getSessionToken = async () => {
    try {
      const tokenResponse = await axios.post("http://192.168.0.188:3001/sessionToken", {
        EmprCodigo: empresa?.EmprCodigo,
      });
      // handle the tokenResponse and navigation accordingly
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {empresa && (
        <>
        <ImageBackground source={{ uri: logoSourceBG }} className="absolute w-full h-full">
        <View className={`flex justify-center items-center top-1/4 gap-6`}>
          {/* Your other UI components */}
          {logoSource && (
            <Image
              style={{
                width: 200,
                height: 200,
              }}
              source={{ uri: logoSource }}
            />
          )}
          {/* Check for the interval and render accordingly */}
          <TouchableOpacity
            style={{ backgroundColor: empresa.CorSite }}
            className={`bg-gray-700 p-4 rounded`}
            onPress={getSessionToken}
          >
            <View className={'flex-row items-center justify-center'}>
              <Text className={'text-white text-lg mr-2'}>Efetuar um pedido </Text>
              <MaterialIcons name="border-color" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View >
        </ImageBackground>
        </>
      )}
      <StatusBar/>
      {
        empresa && (

        <View className='bg-gray-600 w-full text-base bottom-0 text-gray-100 py-3 px-4 mt-2' style={{ backgroundColor: empresa.CorSite, bottom: 0, position: "absolute" }}>
          <View className='flex-row justify-around m-2' >
          <TouchableOpacity>
            <Entypo name="home" size={40} color="white" className='right-0'/>
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="cart-variant" size={40} color="white" />
          </TouchableOpacity>
          </View>
        </View>
        )
      }
    </>
  );
}
