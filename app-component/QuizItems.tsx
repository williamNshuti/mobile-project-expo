import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
const { width } = Dimensions.get("window");
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { COLORS } from "@/constants/theme";

type ModifiedQuestionType = {
  question: string;
  correct_answer: string;
  selectedOption?: string;
  allOptions: string[];
};

const QuizItem = ({
  data,
  selectedOption,
  currentIndex,
  getOptionBgColor,
  getOptionTextColor,
}: {
  data: ModifiedQuestionType;
  selectedOption: any;
  currentIndex: number;
  getOptionBgColor: (currentQuestion: any, currentOption: any) => string;
  getOptionTextColor: (currentQuestion: any, currentOption: any) => string;
}) => {
  return (
    <View
      style={{
        flex: 1,
        width: width,
        marginTop: 40,
      }}
    >
      <AutoSizeText
        fontSizePresets={[20, 15]}
        numberOfLines={1}
        mode={ResizeTextMode.preset_font_sizes}
        style={{
          color: COLORS.secondary,
          marginHorizontal: 20,
          fontStyle: "italic",
          marginBottom: 20,
          fontWeight: "bold",
        }}
      >
        {"Question : " + currentIndex}
      </AutoSizeText>
      <AutoSizeText
        fontSizePresets={[20, 18]}
        numberOfLines={1}
        mode={ResizeTextMode.preset_font_sizes}
        style={{ color: COLORS.black, fontWeight: "900", marginHorizontal: 20 }}
      >
        {data.question}
      </AutoSizeText>
      <View style={{ flex: 1, marginTop: 20 }}>
        {data?.allOptions?.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={data.allOptions}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: 60,
                    elevation: 3,
                    backgroundColor: getOptionBgColor(data, item),
                    marginTop: 10,
                    marginBottom: 10,
                    alignSelf: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                    flexDirection: "row",
                    borderRadius: 25,
                  }}
                  onPress={() => {
                    selectedOption(item);
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor:
                        data.selectedOption === item
                          ? data.selectedOption === data.correct_answer
                            ? "green"
                            : "white"
                          : "cyan",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {data.selectedOption === item ? (
                      data.selectedOption === data.correct_answer ? (
                        <AntDesign name="check" size={22} color="white" />
                      ) : (
                        <Entypo
                          name="circle-with-cross"
                          size={24}
                          color="red"
                        />
                      )
                    ) : (
                      <Text style={{ fontWeight: "600", color: "#000" }}>
                        {index === 0
                          ? "A"
                          : index === 1
                          ? "B"
                          : index === 2
                          ? "C"
                          : index === 3
                          ? "D"
                          : index === 4
                          ? "E"
                          : "F"}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      marginLeft: 20,
                      color: getOptionTextColor(data, item),
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 80,
            }}
          >
            <AutoSizeText
              fontSize={16}
              numberOfLines={1}
              style={{
                color: "#666633",
                fontWeight: "800",
              }}
              mode={ResizeTextMode.max_lines}
            >
              This Question Has No Options !!!
            </AutoSizeText>
          </View>
        )}
      </View>
    </View>
  );
};

export default QuizItem;
