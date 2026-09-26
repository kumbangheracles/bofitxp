import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Animated,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/use-app-theme";
import AppGradButton from "./app-gradient-btn";

const { height } = Dimensions.get("window");

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  showCloseIcon?: boolean;

  onConfirm?: () => void;
  confirmText?: string;
  isConfirmLoading?: boolean;
  confirmVariant?:
    | "default"
    | "combo"
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success";

  onCancel?: () => void;
  cancelText?: string;
  isCancelLoading?: boolean;
}

const AppModal = ({
  visible,
  onClose,
  title,
  header,
  children,
  footer,
  showCloseIcon = true,
  onConfirm,
  confirmText = "SAVE",
  isConfirmLoading = false,
  confirmVariant = "primary",
  onCancel,
  cancelText = "CANCEL",
  isCancelLoading = false,
}: AppModalProps) => {
  const theme = useAppTheme();

  const [showModal, setShowModal] = useState(visible);

  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, translateY, opacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height * 0.15 || gestureState.vy > 1) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    }),
  ).current;

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.surface,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View {...panResponder.panHandlers}>
            <View style={styles.handleContainer}>
              <View
                style={[styles.handle, { backgroundColor: theme.border }]}
              />
            </View>

            <View style={styles.headerContainer}>
              {header ? (
                header
              ) : (
                <View style={styles.defaultHeader}>
                  {title && (
                    <Text style={[styles.title, { color: theme.text }]}>
                      {title}
                    </Text>
                  )}
                  {showCloseIcon && (
                    <Pressable onPress={onClose} style={styles.closeButton}>
                      <Ionicons
                        name="close"
                        size={24}
                        color={theme.textSecondary}
                      />
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>

          <View style={styles.footerContainer}>
            {footer ? (
              footer
            ) : (
              <View style={styles.buttonRow}>
                {onCancel && (
                  <View style={styles.flex1}>
                    <AppGradButton
                      label={cancelText}
                      onPress={onCancel}
                      isLoading={isCancelLoading}
                      variantGrad="secondary"
                      isGrad={false}
                      title={"Cancel"}
                    />
                  </View>
                )}
                {onConfirm && (
                  <View style={styles.flex1}>
                    <AppGradButton
                      label={confirmText}
                      onPress={onConfirm}
                      isLoading={isConfirmLoading}
                      variantGrad={confirmVariant}
                      isGrad={true}
                      title={"Confirm"}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "100%",
    maxHeight: height * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  defaultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  flex1: {
    flex: 1,
  },
});

export default AppModal;
