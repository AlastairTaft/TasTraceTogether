import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import HeaderText from './../components/HeaderText'
import EmphasizedText from '../components/EmphasizedText'

import COLORS from '../constants/Colors'
import SIZES from '../constants/Sizes'
import IMAGES from '../constants/Images'

const ReportFailedScreen = props => {
  return (
    <ImageBackground source={IMAGES.HomeBackground} style={IMAGES.BackgroundStyle}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <Icon name="sentiment-dissatisfied" color={COLORS.errorText} size={SIZES.headerSize} />
          </View>
          <HeaderText style={styles.title}>
            Something went wrong
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            You can try again later to save lives
          </EmphasizedText>
        </View>
      </View>
    </ImageBackground>
  )
}

export default ReportFailedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    color: COLORS.errorText
  },
  emphasized: {
    paddingTop: "5%",
    marginHorizontal: "5%"
  },
})
