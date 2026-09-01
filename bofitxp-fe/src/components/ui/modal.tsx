import React, { ReactNode } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";

export type ModalSize = "small" | "medium" | "large" | "full";

export interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  size?: ModalSize;
  showCloseButton?: boolean;
}

export const ReusableModal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = false,
  size = "medium",
  showCloseButton = true,
}: ReusableModalProps) => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;

  const maxWidth = getMaxWidth(size, width, isTablet);
  const maxHeight = size === "full" ? height * 0.95 : height * 0.85;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                {
                  width: size === "full" ? width * 0.95 : "100%",
                  maxWidth,
                  maxHeight,
                },
              ]}
            >
              <View style={styles.header}>
                {title ? (
                  <Text style={styles.title} numberOfLines={2}>
                    {title}
                  </Text>
                ) : (
                  <View />
                )}
                {showCloseButton ? (
                  <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}
              </View>

              <View style={styles.content}>{children}</View>

              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

function getMaxWidth(
  size: ModalSize,
  screenWidth: number,
  isTablet: boolean,
): number {
  switch (size) {
    case "small":
      return isTablet ? 360 : screenWidth * 0.8;
    case "large":
      return isTablet ? 640 : screenWidth * 0.95;
    case "full":
      return screenWidth;
    case "medium":
    default:
      return isTablet ? 480 : screenWidth * 0.9;
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginRight: 12,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  closeButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e5e5",
  },
});
