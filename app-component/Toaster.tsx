import Toast from "react-native-root-toast";

export const showToast = (
  message: string,
  duration: number = 2000,
  backgroundColor: string = "#6c47ff",
  position?: string
): void => {
  const toast = Toast.show(message, {
    duration,
    position: position ? Toast.positions.TOP : Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: backgroundColor,
  });

  setTimeout(() => {
    Toast.hide(toast);
  }, duration);
};
