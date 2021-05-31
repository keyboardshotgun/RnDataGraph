import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export const HEADER_HEIGHT = 150;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    height: HEADER_HEIGHT,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  selected: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  size: {
    margin: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    fontSize: 32,
    fontFamily: "Antpolt",
    color: "#814035",
  },
  label: {
    fontFamily: "SFProDisplay-Medium",
  },
  labelSelected: {
    fontFamily: "SFProDisplay-Bold",
  },
});

interface SizeProps {
  label: string;
  selected?: boolean;
  onPress : (label: string) => void
}

const Size = ({label, selected, onPress}: SizeProps) => {

  const selectedHandler = () => {
      onPress(label);
  }

  return (
    <Pressable onPress={selectedHandler}>
      <View style={[selected ? styles.selected : undefined, styles.size]}>
          <Text style={[selected ? styles.labelSelected : undefined , styles.label]}>
            {label}
          </Text>
      </View>
    </Pressable>
  );
};

const Header = () => {
  const [size, setSize] = useState('S');

  const selectedSize = (label:string) => {
      setSize(label);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.price}>17 $</Text>
      <View style={styles.sizes}>
          <Size label="S" onPress={selectedSize} selected={(size === 'S')} />
          <Size label="M" onPress={selectedSize} selected={(size === 'M')} />
          <Size label="L" onPress={selectedSize} selected={(size === 'L')} />
      </View>
    </View>
  );
};

export default Header;
