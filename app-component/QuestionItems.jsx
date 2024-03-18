import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
const { height, width } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";

const QuestionItem = ({ data, selectedOption, currentIndex }) => {
  return (
    <View style={{ width: width, borderWidth: 4, borderColor: "red" }}>
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "black",
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
        }}
      >
        {"Question : " + currentIndex}
      </Text>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 20 }}>
        {data.question}
      </Text>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={data.Options}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{
                  width: "90%",
                  height: 60,
                  elevation: 3,
                  backgroundColor: data.marked == index + 1 ? "purple" : "#fff",
                  marginTop: 10,
                  marginBottom: 10,
                  alignSelf: "center",
                  alignItems: "center",
                  paddingLeft: 15,
                  flexDirection: "row",
                  borderRadius: 25,
                }}
                onPress={() => {
                  selectedOption(index + 1);
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor:
                      data.marked == index + 1 ? "green" : "cyan",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {data.marked === index + 1 ? (
                    <AntDesign name="check" size={22} color="white" />
                  ) : (
                    <Text style={{ fontWeight: "600", color: "#000" }}>
                      {index === 0
                        ? "A"
                        : index === 1
                        ? "B"
                        : index === 2
                        ? "C"
                        : "D"}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    marginLeft: 20,
                    color: data.marked == index + 1 ? "#fff" : "#000",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default QuestionItem;
