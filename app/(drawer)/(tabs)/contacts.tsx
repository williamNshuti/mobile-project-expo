import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as PhoneContacts from "expo-contacts";

const Contacts: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [contactsList, setContactsList] = useState<PhoneContacts.Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { status } = await PhoneContacts.requestPermissionsAsync();
        if (status !== "granted") {
          throw new Error("Permission not granted");
        }

        const { data } = await PhoneContacts.getContactsAsync({
          fields: [
            PhoneContacts.Fields.Emails,
            PhoneContacts.Fields.FirstName,
            PhoneContacts.Fields.LastName,
            PhoneContacts.Fields.PhoneNumbers,
          ],
        });

        if (data.length > 0) {
          const sortedContacts = data.sort((a, b) => {
            const nameA = a.name || "";
            const nameB = b.name || "";
            return nameA.localeCompare(nameB);
          });

          setContactsList(sortedContacts);
        } else {
          throw new Error("No contacts found");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
          console.error("Error fetching contacts:", error);
        } else {
          console.error("Unexpected error type:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sections = React.useMemo(() => {
    const sectionsMap = contactsList.reduce(
      (acc: { [key: string]: PhoneContacts.Contact[] }, contact) => {
        const firstLetter = contact.name
          ? contact.name.charAt(0).toUpperCase()
          : null;

        if (firstLetter && firstLetter.match(/[A-Z]/)) {
          return {
            ...acc,
            [firstLetter]: [...(acc[firstLetter] || []), contact],
          };
        }

        return acc;
      },
      {}
    );

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [contactsList]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fffff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Contacts</Text>
          </View>
          {sections &&
            sections?.map(({ letter, items }) => (
              <View style={styles.section} key={letter}>
                <Text style={styles.sectionTitle}>{letter}</Text>
                <View style={styles.sectionItems}>
                  {items.map(
                    ({ imageAvailable, name, phoneNumbers }, index) => {
                      return (
                        <View key={index} style={styles.cardWrapper}>
                          <TouchableOpacity
                            onPress={() => {
                              // handle onPress
                            }}>
                            <View style={styles.card}>
                              {imageAvailable ? (
                                <View
                                  style={[styles.cardImg, styles.cardAvatar]}>
                                  <Text style={styles.cardAvatarText}>
                                    {name ? name[0] : "#"}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[styles.cardImg, styles.cardAvatar]}>
                                  <Text style={styles.cardAvatarText}>
                                    {name ? name[0] : "#"}
                                  </Text>
                                </View>
                              )}

                              <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{name}</Text>
                                {phoneNumbers?.map((phoneNumber) => (
                                  <Text
                                    key={phoneNumber.id}
                                    style={styles.cardPhone}>
                                    {phoneNumber.number}
                                  </Text>
                                ))}
                              </View>

                              <View style={styles.cardAction}>
                                <Entypo
                                  name="chevron-right"
                                  size={22}
                                  color="#9ca3af"
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  )}
                </View>
              </View>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
    paddingLeft: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  sectionItems: {
    marginTop: 8,
  },
  card: {
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardWrapper: {
    borderBottomWidth: 1,
    borderColor: "#d6d6d6",
  },
  cardImg: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  cardAvatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9ca1ac",
  },
  cardAvatarText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#fff",
  },
  cardBody: {
    marginRight: "auto",
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  cardPhone: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "#616d79",
    marginTop: 3,
  },
  cardAction: {
    paddingRight: 16,
  },
});

export default Contacts;
