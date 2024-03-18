import axios from "axios";

export async function sendNotification() {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const notificationData = {
    appId: 20219,
    appToken: "GMmAuG6Yvmx3RfQDY9PNWF",
    title: "New Quiz Added!",
    body: "A new quiz has been added. Check it out now!",
    dateSent: formattedDate,
    pushData: { screenName: "home" },
  };

  try {
    const response = await axios.post(
      "https://app.nativenotify.com/api/notification",
      notificationData
    );
    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
