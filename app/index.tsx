import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'

const Index = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()
  const {user , loading} = useAuth()

  useEffect(()=>{
    if(!loading){
      if(user)router.replace("/home")
      else router.replace("/login")  
    }
  },[user,loading])

  if(loading){
    return(
      <View className='flex-1 w-full justify-center align-items-center'>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return null
}

export default Index